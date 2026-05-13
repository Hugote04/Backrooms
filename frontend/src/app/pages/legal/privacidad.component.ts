import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-privacidad',
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
            Política de Privacidad
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
export class PrivacidadComponent {
  sections = [
    {
      title: '1. Responsable del tratamiento',
      content: `Backrooms: Lurking In The Shadows es un proyecto académico desarrollado en el IES Isidra de Guzmán en el marco del Ciclo Formativo de Grado Superior de Desarrollo de Aplicaciones Web (DAW), segundo curso 2025/2026.\n\nAl ser un proyecto educativo sin actividad comercial, no existe una empresa responsable en sentido estricto. Los datos recogidos se utilizan exclusivamente con fines de demostración y evaluación académica.`,
    },
    {
      title: '2. Datos que recopilamos',
      content: `Al crear una cuenta recogemos:\n\n· Dirección de correo electrónico\n· Nombre de usuario (opcional)\n· Contraseña (almacenada de forma cifrada mediante Supabase Auth)\n· Fecha de registro\n\nAl publicar una reseña o comentario recogemos:\n\n· Nombre de usuario visible\n· Puntuación (1-5 estrellas)\n· Texto de la reseña o comentario\n· Fecha y hora de la publicación`,
    },
    {
      title: '3. Finalidad del tratamiento',
      content: `Los datos se utilizan para:\n\n· Gestionar tu cuenta y sesión de usuario\n· Mostrar tus reseñas y comentarios en la aplicación\n· Permitirte editar o eliminar tu propio contenido\n· Fines académicos y de evaluación del proyecto`,
    },
    {
      title: '4. Base legal',
      content: `El tratamiento se basa en el consentimiento explícito que otorgas al crear una cuenta (art. 6.1.a RGPD). Puedes retirar tu consentimiento en cualquier momento eliminando tu cuenta.`,
    },
    {
      title: '5. Conservación de los datos',
      content: `Los datos se conservan mientras la cuenta esté activa. Al eliminar tu cuenta, todos tus datos personales, reseñas y comentarios se eliminarán de forma permanente.`,
    },
    {
      title: '6. Tus derechos',
      content: `Tienes derecho a:\n\n· Acceder a tus datos personales\n· Rectificar datos incorrectos\n· Solicitar la eliminación de tus datos\n· Oponerte al tratamiento\n\nPara ejercer cualquiera de estos derechos, usa el formulario de contacto de la aplicación.`,
    },
    {
      title: '7. Seguridad',
      content: `Las contraseñas se almacenan cifradas con bcrypt mediante Supabase Auth. La comunicación entre el navegador y el servidor se realiza a través de HTTPS. Los tokens de sesión se gestionan con JWT firmados con la clave secreta del proyecto.`,
    },
  ];
}
