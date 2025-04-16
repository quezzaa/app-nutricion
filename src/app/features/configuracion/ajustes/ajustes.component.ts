import { Component } from '@angular/core';
import { FormsModule, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-ajustes',
  standalone: true,
  imports: [ CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './ajustes.component.html',
  styleUrl: './ajustes.component.css'
})
export class AjustesComponent {
Generos = [{ value: '1', label: 'Masculino' }
, { value: '2', label: 'Femenino' }]
Actividades = [{ value: '1', label: 'Sedentario'},
{ value: '2', label: 'Ligera'}, { value: '3', label: 'Moderada' }, { value: '4', label: 'Intensa' }]
usuario={
  Nombre:'',
  Apellidos:'',
  Correo:'',
  FechaNacimiento:'',
  Genero:'',
  Altura:'',
  Peso:'',
  ActividadFisica:'',
  MetaCalorias:'',
  MetaProteinas:'',
  MetaCarbohidratos:'',
  MetaGrasas:'',
  MetaAgua:'',
}


  eliminarCuenta() {}
  guardarCambios() {}
}
