import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-registro-comida',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './registro-comida.component.html',
  styleUrl: './registro-comida.component.css'
})
export class RegistroComidaComponent {
  alimentosDisponibles = [
    { nombre: 'Pollo', tipo: 'g', proteina: 31, carbohidratos: 0, grasas: 3.6, calorias: 165 },
    { nombre: 'Frijoles', tipo: 'g', proteina: 8.9, carbohidratos: 27, grasas: 0.5, calorias: 127 },
    { nombre: 'Arroz', tipo: 'g', proteina: 2.7, carbohidratos: 28, grasas: 0.3, calorias: 130 },
    { nombre: 'Jugo de naranja', tipo: 'ml', proteina: 0.7, carbohidratos: 8.4, grasas: 0.2, calorias: 39 },
    { nombre: 'Café con azúcar', tipo: 'ml', proteina: 0.1, carbohidratos: 5, grasas: 0.1, calorias: 20 }
  ];

  alimentoSeleccionado: any = null;
  cantidad: number = 100;
  alimentosAgregados: any[] = [];

  get totales() {
    return this.alimentosAgregados.reduce((acc, a) => {
      acc.proteina += a.proteina;
      acc.carbohidratos += a.carbohidratos;
      acc.grasas += a.grasas;
      acc.calorias += a.calorias;
      return acc;
    }, { proteina: 0, carbohidratos: 0, grasas: 0, calorias: 0 });
  }

  agregarAlimento() {
    if (this.alimentoSeleccionado && this.cantidad > 0) {
      const factor = this.cantidad / 100;
      const datos = {
        nombre: this.alimentoSeleccionado.nombre,
        tipo: this.alimentoSeleccionado.tipo,
        cantidad: this.cantidad,
        proteina: +(this.alimentoSeleccionado.proteina * factor).toFixed(2),
        carbohidratos: +(this.alimentoSeleccionado.carbohidratos * factor).toFixed(2),
        grasas: +(this.alimentoSeleccionado.grasas * factor).toFixed(2),
        calorias: +(this.alimentoSeleccionado.calorias * factor).toFixed(2),
      };
      this.alimentosAgregados.push(datos);
      this.cantidad = 100;
    }
  }

  guardarComida() {
    console.log("Comida guardada:", this.alimentosAgregados);
    this.alimentosAgregados = [];
  }
}

