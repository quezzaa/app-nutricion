import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Agua } from '../../../Models/agua.model';
@Component({
  selector: 'app-formulario-agua',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './formulario-agua.component.html',
  styleUrl: './formulario-agua.component.css'
})
export class FormularioAguaComponent {
  agua: Agua = { cantidad: 0, Fecha: '' };
  guardarAgua() {
    const fechaHoy = new Date();
    const horaConsumida = this.agua.Fecha;
    fechaHoy.setHours(parseInt(horaConsumida.split(':')[0]), parseInt(horaConsumida.split(':')[1]), 0, 0);
    this.agua.Fecha = fechaHoy.toISOString();
    console.log("Agua registrada: ", this.agua);
    // Aquí iría el guardado en almacenamiento local
  }

}
