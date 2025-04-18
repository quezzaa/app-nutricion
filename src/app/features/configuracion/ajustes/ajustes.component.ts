import { Component,OnInit } from '@angular/core';
import { FormsModule, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Usuario } from '../../../Models/usuario.models';
import { AjustesPerfilServiceService } from '../../../services/ajustes-perfil-service.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-ajustes',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
    templateUrl: './ajustes.component.html',
    styleUrl: './ajustes.component.css'
})
export class AjustesComponent implements OnInit {
Sexos = [{ value: '1', label: 'Masculino' }
, { value: '2', label: 'Femenino' }]
Actividades = [{ value: '1', label: 'Baja'},
{ value: '2', label: 'Media'}, { value: '3', label: 'Alta' }]
usuario: Usuario={
  Nombre: '',
  Apellidos: '',
  Correo: '',
  FechaNacimiento: new Date(),
  Sexo: 'Masculino',
  Altura: 0,
  Peso: 0,
  ActividadFisica: 'Baja',
  MetaCalorias: 0,
  MetaProteinas: 0,
  MetaCarbohidratos: 0,
  MetaGrasas: 0,
  MetaAgua: 0,
  MetaAzucares: 0,
  MetaSodio: 0,
  MetaFibra:0
}

constructor(private ajustesPerfilService: AjustesPerfilServiceService, private toastr:ToastrService) { }

ngOnInit(): void {
  const usuarioGuardado = this.ajustesPerfilService.obtener();
  if (usuarioGuardado) {
    this.usuario = usuarioGuardado;
  }
}

  guardarCambios() {
    this.ajustesPerfilService.guardar(this.usuario);
    this.toastr.success('Ajustes guardados', 'Éxito');
  }
}
