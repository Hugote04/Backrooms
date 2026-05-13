import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-terminos',
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
            Términos de Servicio
          </h1>
          <p class="text-[#5a5828] font-mono text-xs">Última actualización: mayo de 2026</p>
        </div>

        <div class="bg-[#0e0d04] border border-[#d4c87a]/15 p-8 space-y-8 font-mono text-xs leading-relaxed text-[#8b7a2e]">

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
export class TerminosComponent {
  sections = [
    {
      title: '1. Aceptación de los términos',
      content: `Al acceder o usar esta aplicación web aceptas estos Términos de Servicio. Si no estás de acuerdo con alguna parte, no debes usar la aplicación.\n\nEsta aplicación es un proyecto académico sin ánimo de lucro desarrollado en el IES Isidra de Guzmán, segundo curso de DAW 2025/2026.`,
    },
    {
      title: '2. Uso de la aplicación',
      content: `Puedes usar esta aplicación para:\n\n· Consultar información sobre el videojuego\n· Registrarte y crear una cuenta de usuario\n· Publicar reseñas y comentarios sobre el juego\n· Descargar el videojuego de forma gratuita\n\nNo está permitido:\n\n· Publicar contenido ofensivo, violento o discriminatorio\n· Intentar acceder a cuentas de otros usuarios\n· Realizar ataques de cualquier tipo contra la infraestructura\n· Usar la aplicación para actividades ilegales`,
    },
    {
      title: '3. Contenido generado por usuarios',
      content: `Al publicar una reseña o comentario:\n\n· Garantizas que el contenido es tuyo y no viola derechos de terceros\n· Nos otorgas permiso para mostrar ese contenido en la aplicación\n· Eres el único responsable de lo que publicas\n\nNos reservamos el derecho de eliminar cualquier contenido que incumpla estas condiciones.`,
    },
    {
      title: '4. Cuentas de usuario',
      content: `Eres responsable de mantener la confidencialidad de tu contraseña y de todas las actividades realizadas desde tu cuenta. Notifícanos inmediatamente si sospechas de un uso no autorizado.`,
    },
    {
      title: '5. Disponibilidad del servicio',
      content: `Al ser un proyecto académico, no garantizamos una disponibilidad continua del servicio. La aplicación puede estar temporalmente inactiva por mantenimiento o tras la finalización del período de evaluación.`,
    },
    {
      title: '6. Propiedad intelectual',
      content: `El videojuego, su código fuente, los assets gráficos y sonoros son propiedad de sus autores. Queda prohibida la redistribución, venta o modificación del juego sin permiso expreso.`,
    },
    {
      title: '7. Limitación de responsabilidad',
      content: `Esta aplicación se proporciona "tal cual", sin garantías de ningún tipo. No nos hacemos responsables de daños directos o indirectos derivados del uso o imposibilidad de uso de la aplicación.`,
    },
    {
      title: '8. Modificaciones',
      content: `Podemos modificar estos términos en cualquier momento. Si los cambios son significativos, lo notificaremos en la aplicación. El uso continuado de la aplicación tras los cambios implica su aceptación.`,
    },
  ];
}
