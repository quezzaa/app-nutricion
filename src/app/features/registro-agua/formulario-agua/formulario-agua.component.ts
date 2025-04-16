import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-formulario-agua',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './formulario-agua.component.html',
  styleUrl: './formulario-agua.component.css'
})
export class FormularioAguaComponent {
  agua={
    cantidad: 0,
    hora: '',
  }

  guardarAgua() {
    const fechaHoy = new Date();
    const horaConsumida = this.agua.hora;
    fechaHoy.setHours(parseInt(horaConsumida.split(':')[0]), parseInt(horaConsumida.split(':')[1]), 0, 0);
    console.log("Agua registrada para: ", fechaHoy);
    // Aquí iría el guardado en almacenamiento local
  }

}
