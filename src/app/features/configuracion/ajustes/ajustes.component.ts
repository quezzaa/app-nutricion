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
  usuario: Usuario = {
    idUsuario: 0,
    idGenero: 1,
    idActividad: 1,
    nombre: '',
    correo: '',
    fechaNacimiento: '',
    altura: 0,
    peso: 0,
    metaCalorias: 0,
    metaProteinas: 0,
    metaCarbohidratos: 0,
    metaFibra: 0,
    metaAzucares: 0,
    metaSodio: 0,
    metaGrasas: 0,
    metaAgua: 0
  };

  Sexos = [
    { value: 1, label: 'Masculino' },
    { value: 2, label: 'Femenino' }
  ];

  Actividades = [
    { value: 1, label: 'Sedentario' },
    { value: 2, label: 'Ligero' },
    { value: 3, label: 'Moderado' },
    { value: 4, label: 'Activo' },
    { value: 5, label: 'Muy activo' }
  ];


  constructor(
    private ajustesPerfilService: AjustesPerfilServiceService,
    private toastr: ToastrService,
    private router: RouterModule,
  ) {}

  passwordActual: string = '';
  passwordNueva: string = '';
  passwordConfirmacion: string = '';
  
  async ngOnInit(): Promise<void> {
    const idUsuario = sessionStorage.getItem('userId');
    if (idUsuario) {
      const datos = await this.ajustesPerfilService.obtenerUsuarioDesdeDB(parseInt(idUsuario));
      if (datos) this.usuario = datos;
    }
  }
  
  async guardarCambios() {
    const exito = await this.ajustesPerfilService.actualizarUsuario(this.usuario);
    if (exito) {
      this.toastr.success('Ajustes guardados', 'Éxito');
    } else {
      this.toastr.error('Error al guardar', 'Error');
    }
  }
  
  async cambiarPassword() {
    if (this.passwordNueva !== this.passwordConfirmacion) {
      this.toastr.error('Las contraseñas no coinciden', 'Error');
      return;
    }
  
    const exito = await this.ajustesPerfilService.cambiarPassword(
      this.usuario.idUsuario,
      this.passwordActual,
      this.passwordNueva
    );
  
    if (exito) {
      this.toastr.success('Contraseña actualizada', 'Éxito');
      this.passwordActual = '';
      this.passwordNueva = '';
      this.passwordConfirmacion = '';
    } else {
      this.toastr.error('Contraseña actual incorrecta', 'Error');
    }
  }
  

}

