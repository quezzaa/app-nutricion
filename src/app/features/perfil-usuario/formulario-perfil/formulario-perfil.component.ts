import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-formulario-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './formulario-perfil.component.html',
  styleUrl: './formulario-perfil.component.css'
})
export class FormularioPerfilComponent {
  usuario = {
    nombre: 'Juan Pérez',
    email: 'juan@example.com',
    edad: 25,
    altura: 175
  };

  // Método para guardar los cambios del perfil
  guardarPerfil() {
    console.log("Perfil actualizado:", this.usuario);
    // Aquí podrías hacer un llamado a tu backend o almacenamiento para guardar los cambios.
  }
}
