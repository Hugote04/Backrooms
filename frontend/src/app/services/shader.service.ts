import { Injectable, OnDestroy } from '@angular/core';

const VERTEX_SHADER_SOURCE = `
  attribute vec2 a_position;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER_SOURCE = `
precision mediump float;

uniform float u_time;
uniform vec2  u_resolution;
uniform vec2  u_mouse;

float rand(vec2 co) {
  return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(rand(i), rand(i + vec2(1,0)), u.x),
    mix(rand(i + vec2(0,1)), rand(i + vec2(1,1)), u.x),
    u.y
  );
}

float flickerVal(float t) {
  float f = 1.0;
  f *= 1.0 - 0.07 * step(0.95, fract(t * 1.3));
  f *= 1.0 - 0.12 * step(0.92, fract(t * 0.7 + 0.4));
  f *= 1.0 - 0.05 * step(0.98, fract(t * 2.1 + 0.2));
  return clamp(f, 0.6, 1.0);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 mouse = u_mouse / u_resolution.xy;

  vec2 centered = uv - 0.5;
  float aspect = u_resolution.x / u_resolution.y;
  centered.x *= aspect;

  float distCenter = length(centered);
  float depth = distCenter * 2.5;
  float walkSpeed = u_time * 0.08;
  float perspDepth = fract(depth - walkSpeed);

  vec3 wallColor = mix(
    vec3(0.06, 0.05, 0.01),
    vec3(0.85, 0.79, 0.28),
    1.0 - smoothstep(0.0, 0.6, distCenter)
  );

  float wallNoise = noise(uv * 24.0 + vec2(u_time * 0.01, 0.0));
  float carpetNoise = noise(uv * 80.0) * 0.4 + noise(uv * 40.0) * 0.3 + noise(uv * 20.0) * 0.3;

  float isFloor = smoothstep(0.35, 0.1, uv.y);
  float isCeiling = smoothstep(0.65, 0.9, uv.y);

  vec3 carpetColor = mix(
    vec3(0.08, 0.07, 0.02),
    vec3(0.42, 0.38, 0.12),
    carpetNoise
  );
  float moistPatch = noise(uv * 12.0 + vec2(5.0)) * noise(uv * 8.0);
  carpetColor = mix(carpetColor, vec3(0.28, 0.26, 0.08), moistPatch * 0.6);

  vec3 ceilingColor = mix(
    vec3(0.65, 0.62, 0.22),
    vec3(0.88, 0.84, 0.38),
    wallNoise * 0.5 + 0.5
  );

  vec3 surfaceColor = wallColor;
  surfaceColor = mix(surfaceColor, carpetColor, isFloor * 0.9);
  surfaceColor = mix(surfaceColor, ceilingColor, isCeiling * 0.8);

  float stain = noise(uv * 6.0 + 3.7) * noise(uv * 14.0);
  surfaceColor = mix(surfaceColor, surfaceColor * 0.6, stain * 0.4 * (1.0 - isFloor) * (1.0 - isCeiling));

  float lightStripY = smoothstep(0.06, 0.0, abs(uv.y - 0.72));
  float lightStripX = 1.0 - smoothstep(0.0, 0.35, abs(uv.x - 0.5));
  float lightStrip = lightStripY * lightStripX;

  float flicker = flickerVal(u_time * 1.5);

  float lightHalo = exp(-distCenter * 2.8) * 0.7 + exp(-distCenter * 1.0) * 0.3;

  vec3 lightColor = vec3(0.95, 0.92, 0.62) * flicker;
  vec3 ambientLight = vec3(0.72, 0.68, 0.28) * lightHalo * flicker * 0.8;

  vec3 finalColor = surfaceColor;
  finalColor += ambientLight;
  finalColor = mix(finalColor, lightColor, lightStrip * flicker * 1.2);

  vec2 mouseDiff = uv - mouse;
  float mouseDist = length(mouseDiff);
  float mouseEffect = exp(-mouseDist * 4.0) * 0.08;
  finalColor += vec3(0.6, 0.58, 0.22) * mouseEffect * flicker;

  float vignette = 1.0 - smoothstep(0.3, 0.85, distCenter);
  finalColor *= (vignette * 0.7 + 0.3);

  float grain = (rand(uv + fract(u_time)) - 0.5) * 0.025;
  finalColor += grain;

  finalColor *= 0.88;

  gl_FragColor = vec4(clamp(finalColor, 0.0, 1.0), 1.0);
}
`;

@Injectable({ providedIn: 'root' })
export class ShaderService implements OnDestroy {
  private gl: WebGLRenderingContext | null = null;
  private program: WebGLProgram | null = null;
  private animationId: number | null = null;
  private startTime = 0;
  private mouseX = 0;
  private mouseY = 0;
  private canvas: HTMLCanvasElement | null = null;

  private uTime: WebGLUniformLocation | null = null;
  private uResolution: WebGLUniformLocation | null = null;
  private uMouse: WebGLUniformLocation | null = null;

  private boundMouseMove!: (e: MouseEvent) => void;
  private boundResize!: () => void;

  init(canvas: HTMLCanvasElement): boolean {
    this.canvas = canvas;
    this.startTime = performance.now();

    const gl = (canvas.getContext('webgl') ?? canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null;
    if (!gl) {
      console.warn('WebGL not supported');
      return false;
    }
    this.gl = gl;

    const vert = this.compileShader(gl.VERTEX_SHADER, VERTEX_SHADER_SOURCE);
    const frag = this.compileShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SOURCE);
    if (!vert || !frag) return false;

    const program = this.gl.createProgram()!;
    this.gl.attachShader(program, vert);
    this.gl.attachShader(program, frag);
    this.gl.linkProgram(program);

    if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
      console.error('Shader link error:', this.gl.getProgramInfoLog(program));
      return false;
    }

    this.program = program;
    this.gl.useProgram(program);

    // Full-screen quad
    const buf = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buf);
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, -1, 1, 1, -1, 1]),
      this.gl.STATIC_DRAW
    );
    const pos = this.gl.getAttribLocation(program, 'a_position');
    this.gl.enableVertexAttribArray(pos);
    this.gl.vertexAttribPointer(pos, 2, this.gl.FLOAT, false, 0, 0);

    this.uTime       = this.gl.getUniformLocation(program, 'u_time');
    this.uResolution = this.gl.getUniformLocation(program, 'u_resolution');
    this.uMouse      = this.gl.getUniformLocation(program, 'u_mouse');

    this.boundMouseMove = (e: MouseEvent) => {
      this.mouseX = e.clientX;
      this.mouseY = canvas.height - e.clientY;
    };
    this.boundResize = () => this.resize();

    window.addEventListener('mousemove', this.boundMouseMove);
    window.addEventListener('resize', this.boundResize);
    this.resize();
    this.render();
    return true;
  }

  destroy(): void {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    window.removeEventListener('mousemove', this.boundMouseMove);
    window.removeEventListener('resize', this.boundResize);
    this.gl = null;
    this.program = null;
    this.canvas = null;
  }

  ngOnDestroy(): void {
    this.destroy();
  }

  private resize(): void {
    if (!this.canvas || !this.gl) return;
    this.canvas.width  = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
  }

  private render(): void {
    if (!this.gl || !this.program) return;
    const elapsed = (performance.now() - this.startTime) / 1000;

    this.gl.uniform1f(this.uTime, elapsed);
    this.gl.uniform2f(this.uResolution, this.canvas!.width, this.canvas!.height);
    this.gl.uniform2f(this.uMouse, this.mouseX, this.mouseY);
    this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);

    this.animationId = requestAnimationFrame(() => this.render());
  }

  private compileShader(type: number, source: string): WebGLShader | null {
    const gl = this.gl!;
    const shader = gl.createShader(type)!;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('Shader compile error:', gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }
}
