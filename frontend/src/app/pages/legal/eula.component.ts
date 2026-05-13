import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-eula',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="min-h-screen bg-[#050500] wallpaper-bg px-4 py-16">
      <div class="max-w-3xl mx-auto">

        <div class="text-center mb-12">
          <a routerLink="/" class="inline-flex flex-col items-center gap-2 mb-6">
            <img src="logo.png" alt="Backrooms logo"
                 class="h-10 w-10 object-contain"
                 style="filter: drop-shadow(0 0 6px rgba(212,200,122,0.4));" />
            <span class="text-xl font-bold tracking-[0.2em] text-[#d4c87a] flicker-slow"
                  style="font-family: 'Space Mono', monospace;">BACKROOMS</span>
          </a>
          <h1 class="text-[#d4c87a] font-mono font-bold tracking-widest uppercase text-2xl mb-2">
            EULA
          </h1>
          <p class="text-[#5a5828] font-mono text-xs tracking-widest mb-1">
            Acuerdo de Licencia de Usuario Final
          </p>
          <p class="text-[#5a5828] font-mono text-xs">Última actualización: mayo de 2026</p>
        </div>

        <div class="bg-[#0e0d04] border border-[#d4c87a]/15 p-8 space-y-8 font-mono text-xs leading-relaxed text-[#8b7a2e]">

          <div class="border border-[#d4c87a]/20 p-4 text-[#b8a84a]">
            Al descargar o ejecutar Lurking In The Shadows aceptas los términos de este acuerdo.
            Si no estás de acuerdo, no descargues ni uses el juego.
          </div>

          @for (section of sections; track section.title) {
            <div>
              <h2 class="text-[#b8a84a] font-bold uppercase tracking-widest mb-3">{{ section.title }}</h2>
              <p class="whitespace-pre-line">{{ section.content }}</p>
            </div>
          }

        </div>

        <p class="text-center mt-8">
          <a routerLink="/" class="text-[#3a3620] hover:text-[#8b7a2e] font-mono text-xs tracking-widest uppercase transition-colors">
            ← Volver al inicio
          </a>
        </p>
      </div>
    </div>
  `,
})
export class EulaComponent {
  sections = [
    {
      title: '1. Concesión de licencia',
      content: `Los autores de Lurking In The Shadows te conceden una licencia personal, no exclusiva, intransferible y gratuita para instalar y ejecutar el juego en dispositivos de tu propiedad o bajo tu control, únicamente para uso personal y no comercial.`,
    },
    {
      title: '2. Restricciones',
      content: `Queda expresamente prohibido:\n\n· Vender, alquilar, sublicenciar o distribuir el juego a terceros\n· Modificar, descompilar, desensamblar o realizar ingeniería inversa del juego o sus componentes\n· Eliminar o alterar cualquier aviso de propiedad intelectual incluido en el juego\n· Usar el juego para actividades ilegales o que infrinjan derechos de terceros\n· Distribuir versiones modificadas del juego sin autorización expresa de los autores`,
    },
    {
      title: '3. Propiedad intelectual',
      content: `Lurking In The Shadows, incluyendo su código fuente, assets gráficos, sonidos, música, diseño de niveles y demás elementos, es propiedad exclusiva de sus autores. Esta licencia no te transfiere ningún derecho de propiedad sobre el juego.`,
    },
    {
      title: '4. Actualizaciones',
      content: `Los autores pueden publicar actualizaciones, parches o nuevas versiones del juego. Esta licencia se aplica a todas las versiones actuales y futuras del juego que obtengas a través de los canales oficiales.`,
    },
    {
      title: '5. Exención de garantías',
      content: `El juego se proporciona "tal cual" sin garantías de ningún tipo, ya sean expresas o implícitas. Los autores no garantizan que el juego esté libre de errores, que funcione de forma ininterrumpida ni que sea compatible con todos los sistemas.`,
    },
    {
      title: '6. Limitación de responsabilidad',
      content: `En la máxima medida permitida por la ley aplicable, los autores no serán responsables de ningún daño directo, indirecto, incidental, especial o consecuente derivado del uso o la imposibilidad de uso del juego.`,
    },
    {
      title: '7. Terminación',
      content: `Esta licencia es vigente hasta su terminación. Se rescinde automáticamente si incumples cualquiera de sus términos. Al terminar la licencia debes cesar el uso del juego y eliminar todas las copias en tu posesión.`,
    },
    {
      title: '8. Legislación aplicable',
      content: `Este acuerdo se rige por la legislación española. Cualquier disputa derivada de este acuerdo se someterá a los tribunales competentes de España.`,
    },
  ];
}
