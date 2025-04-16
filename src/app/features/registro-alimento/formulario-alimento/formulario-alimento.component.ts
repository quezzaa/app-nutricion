import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Alimento } from '../../../Models/alimento.model';

@Component({
  selector: 'app-formulario-alimento',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './formulario-alimento.component.html',
  styleUrl: './formulario-alimento.component.css'
})
export class FormularioAlimentoComponent {
  alimento: Alimento = {
    nombre: '',
    unidad: 'g',
    calorias: 0,
    proteina: 0,
    carbohidratos: 0,
    grasas: 0,
    sodio: 0,
    azucares: 0,
    fibra: 0,
  };

  guardarAlimento() {
    if (!this.alimento.unidad) {
      alert('Por favor selecciona si el alimento es sólido o líquido.');
      return;
    }

    console.log('Alimento guardado:', this.alimento);
    // Aquí iría el guardado en almacenamiento local o servicio
  }
}

