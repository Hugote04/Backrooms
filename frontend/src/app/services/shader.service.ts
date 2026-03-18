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

  float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    float a = rand(i);
    float b = rand(i + vec2(1.0, 0.0));
    float c = rand(i + vec2(0.0, 1.0));
    float d = rand(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  float fbm(vec2 st) {
    float value = 0.0;
    float amplitude = 0.5;
    vec2 shift = vec2(100.0);
    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
    for (int i = 0; i < 6; i++) {
      value += amplitude * noise(st);
      st = rot * st * 2.1 + shift;
      amplitude *= 0.5;
    }
    return value;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    vec2 mouse = u_mouse / u_resolution.xy;

    float t = u_time * 0.12;

    // Mouse ripple influence
    vec2 diff = uv - mouse;
    float dist = length(diff);
    vec2 mouseWarp = diff * smoothstep(0.45, 0.0, dist) * 0.18;

    // Domain warping layers
    vec2 q = vec2(
      fbm(uv + t * 0.4),
      fbm(uv + vec2(1.7, 9.2))
    );

    vec2 r = vec2(
      fbm(uv + 1.2 * q + vec2(1.7, 9.2) + 0.14 * t + mouseWarp),
      fbm(uv + 1.2 * q + vec2(8.3, 2.8) + 0.12 * t + mouseWarp)
    );

    float f = fbm(uv + r);

    // Orange nebula palette
    vec3 color = mix(
      vec3(0.02, 0.01, 0.0),      // deep black
      vec3(0.55, 0.18, 0.01),     // dark burnt orange
      clamp(f * f * 4.5, 0.0, 1.0)
    );
    color = mix(
      color,
      vec3(0.88, 0.42, 0.04),     // vivid orange
      clamp(length(q) * 0.9, 0.0, 1.0)
    );
    color = mix(
      color,
      vec3(1.0, 0.72, 0.18),      // warm yellow-orange
      clamp(r.x * r.x * 0.9, 0.0, 1.0)
    );

    // Keep it dark overall — this is a background
    color = color * 0.65;

    // Subtle vignette
    float vig = 1.0 - smoothstep(0.4, 1.4, length(uv - vec2(0.5)));
    color *= vig * 1.3;

    gl_FragColor = vec4(color, 1.0);
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
