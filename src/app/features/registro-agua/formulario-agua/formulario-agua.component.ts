import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Agua } from '../../../Models/agua.model';
import { AguaServiceService } from '../../../services/agua-service.service';
import { ToastrService } from 'ngx-toastr';
import { v4 as uuidv4 } from 'uuid';

@Component({
    selector: 'app-formulario-agua',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './formulario-agua.component.html',
    styleUrl: './formulario-agua.component.css'
})
export class FormularioAguaComponent implements OnInit {
  agua: Agua = { id:'',cantidad: 0, Fecha: '' };
  historialHoy: Agua[] = [];
  registroSeleccionado: Agua | null = null;

  constructor(
    private aguaService: AguaServiceService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.setHora();
    this.cargarHistorialHoy();
  }

  async guardarAgua() {
    try {
      const fechaHoy = new Date();
      const horaConsumida = this.agua.Fecha;
      fechaHoy.setHours(
        parseInt(horaConsumida.split(':')[0]),
        parseInt(horaConsumida.split(':')[1]),
        0, 0
      );
      this.agua.Fecha = fechaHoy.toLocaleString('en-CA', { hour12: false }).replace(',', ''); // 'YYYY-MM-DD HH:MM:SS'
      this.agua.id = uuidv4();
      await this.aguaService.guardarAgua(this.agua);
      this.toastr.success('Agua registrada correctamente');
      this.cargarHistorialHoy();
      this.agua = { id:'',cantidad: 0, Fecha: '' };
      this.setHora();
    } catch (error) {
      this.toastr.error('Ocurrió un error al registrar el agua');
      this.setHora();
    }
  }
  
  

  async cargarHistorialHoy() {
    this.historialHoy = await this.aguaService.obtenerSoloDeHoy();
  }

  setHora(){
    const ahora = new Date();
    const horas = ahora.getHours().toString().padStart(2, '0');
    const minutos = ahora.getMinutes().toString().padStart(2, '0');
    this.agua.Fecha = `${horas}:${minutos}`;
  }

  seleccionarRegistro(agua: Agua) {
    this.registroSeleccionado = agua;
  }
  
  async confirmarEliminacionAgua() {
    if (this.registroSeleccionado) {
      await this.aguaService.eliminarAguaPorId(this.registroSeleccionado.id);
      this.toastr.success('Registro de agua eliminado correctamente');
      this.cargarHistorialHoy();
      this.registroSeleccionado = null;
    }
  }
}

