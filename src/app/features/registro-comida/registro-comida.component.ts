import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Alimento } from '../../Models/alimento.model';
import { RegistroComida } from '../../Models/comida.model';
import { ToastrService } from 'ngx-toastr';
import { AlimentosServiceService } from '../../services/alimentos-service.service';
import { ComidaServiceService } from '../../services/comida-service.service';
@Component({
  selector: 'app-registro-comida',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './registro-comida.component.html',
  styleUrl: './registro-comida.component.css'
})
export class RegistroComidaComponent implements OnInit {
  alimentosDisponibles: Alimento[] = [];
  alimentoSeleccionado: Alimento | null = null;
  cantidad: number = 100;
  alimentosAgregados: any[] = [];
  ComidaDelDia: RegistroComida[] = [];
  ComidaSeleccionada: RegistroComida | null = null;
  busquedaAlimento: string = '';

  get totales() {
    return this.alimentosAgregados.reduce((acc, a) => {
      acc.proteina += a.proteina || 0;
      acc.carbohidratos += a.carbohidratos || 0;
      acc.grasas += a.grasas || 0;
      acc.calorias += a.calorias || 0;
      acc.sodio += a.sodio || 0;
      acc.azucares += a.azucares || 0;
      acc.fibra += a.fibra || 0;
      return acc;
    }, {
      proteina: 0,
      carbohidratos: 0,
      grasas: 0,
      calorias: 0,
      sodio: 0,
      azucares: 0,
      fibra: 0
    });
  }

  constructor(
    private toast: ToastrService,
    private AService: AlimentosServiceService,
    private CService: ComidaServiceService
  ) {}
  idUsuario: any;
  ngOnInit(): void {
    this.idUsuario = sessionStorage.getItem('userId');
    this.cargarAlimentosDisponibles();
    this.obtenerComidasDelDia();
  }

  get alimentosFiltradosSelect() {
    return this.alimentosDisponibles.filter(a =>
      a.nombre.toLowerCase().includes(this.busquedaAlimento.toLowerCase())
    );
  }

  async cargarAlimentosDisponibles() {
    this.alimentosDisponibles = await this.AService.obtenerAlimentos();
  }

  agregarAlimento() {
    if (this.alimentoSeleccionado && this.cantidad > 0) {
      const factor = this.cantidad / 100;
      const datos = {
        id: this.alimentoSeleccionado.idAlimento,
        nombre: this.alimentoSeleccionado.nombre,
        unidad: this.alimentoSeleccionado.idUnidad,
        cantidad: this.cantidad,
        proteina: +(factor * (this.alimentoSeleccionado.proteina || 0)).toFixed(2),
        carbohidratos: +(factor * (this.alimentoSeleccionado.carbohidratos || 0)).toFixed(2),
        grasas: +(factor * (this.alimentoSeleccionado.grasas || 0)).toFixed(2),
        calorias: +(factor * (this.alimentoSeleccionado.calorias || 0)).toFixed(2),
        sodio: +(factor * (this.alimentoSeleccionado.sodio || 0)).toFixed(2),
        azucares: +(factor * (this.alimentoSeleccionado.azucares || 0)).toFixed(2),
        fibra: +(factor * (this.alimentoSeleccionado.fibra || 0)).toFixed(2),
      };
      this.alimentosAgregados.push(datos);
      this.cantidad = 100;
    }
  }

  async guardarComida() {
    if (this.alimentosAgregados.length === 0) {
      this.toast.warning('Agrega al menos un alimento');
      return;
    }
  
    const fecha = new Date();
    const fechaFormateada = fecha.toLocaleString('en-CA', {
      hour12: false,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).replace(',', '');
  
    try {
      const alimentosParaGuardar = this.alimentosAgregados.map(a => ({
        idAlimento: a.id,
        cantidad: a.cantidad
      }));
  
      await this.CService.guardarComida({
        fecha: fechaFormateada,
        idUsuario: parseInt(this.idUsuario),
        alimentos: alimentosParaGuardar
      });
  
      this.toast.success('Comida registrada correctamente', 'Éxito');
      this.alimentosAgregados = [];
      this.ComidaSeleccionada = null;
      this.obtenerComidasDelDia();
    } catch (err) {
      console.error(err);
      this.toast.error('Error al registrar la comida', 'Error');
    }
  }
  

  eliminarAlimento(index: number) {
    this.alimentosAgregados.splice(index, 1);
  }

  seleccionarComida(comida: RegistroComida) {
    this.ComidaSeleccionada = comida;
  }

  eliminarComida(id: number) {
    this.CService.eliminarComida(id).then(() => {
      this.toast.success('Comida eliminada correctamente', 'Éxito');
      this.obtenerComidasDelDia();
    }).catch(() => {
      this.toast.error('Error al eliminar la comida', 'Error');
    });
  }

  obtenerComidasDelDia() {
    const hoy = new Date().toLocaleDateString('en-CA', { hour12: false }).replace(',', '');
    this.CService.obtenerComidasDelDia(hoy,parseInt(this.idUsuario)).then(comidas => {
      this.ComidaDelDia = comidas;
    });
  }
}
