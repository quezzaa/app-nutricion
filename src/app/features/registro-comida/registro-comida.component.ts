import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Alimento } from '../../Models/alimento.model';
import { AlimentoConCantidad, RegistroComida } from '../../Models/comida.model';
import { ToastrService } from 'ngx-toastr';
import { AlimentosServiceService } from '../../services/alimentos-service.service';
import { v4 as uuidv4 } from 'uuid';
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
  alimentoSeleccionado: any= null;
  cantidad: number = 100;
  alimentosAgregados: any[] = [];
  ComidaDelDia: RegistroComida[] = [];
  ComidaSeleccionada: RegistroComida | null = null;
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
  constructor(private toast:ToastrService,private AService:AlimentosServiceService,private CService:ComidaServiceService) {}
  ngOnInit(): void {
    this.cargarAlimentosDisponibles();
    this.obtenerComidasDelDia();
  }
  busquedaAlimento: string = '';
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
        id: this.alimentoSeleccionado.id,
        nombre: this.alimentoSeleccionado.nombre,
        unidad: this.alimentoSeleccionado.unidad,
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
  
  guardarComida() {
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
    const comida: RegistroComida = {
      id: uuidv4(),
      fecha: fechaFormateada,
      alimentos: this.alimentosAgregados.map(a => ({
        ...a,
        caloriasTotales: a.calorias || 0,
        proteinaTotal: a.proteina || 0,
        carbohidratosTotales: a.carbohidratos || 0,
        grasasTotales: a.grasas || 0,
        sodioTotal: a.sodio || 0,
        azucaresTotal: a.azucares || 0,
        fibraTotal: a.fibra || 0,
      })),
      totales: this.totales
    };

    this.CService.guardarComida(comida).then(() => {
      this.toast.success('Comida registrada correctamente','Exito');
      this.alimentosAgregados = [];
      this.ComidaSeleccionada = null;
      this.obtenerComidasDelDia();
    }).catch(() => {
      this.toast.error('Error al registrar la comida','Error');
    });
  }

  eliminarAlimento(index: number) {
    this.alimentosAgregados.splice(index, 1);
  }

  seleccionarComida(comida: RegistroComida) {
    this.ComidaSeleccionada = comida;
  }

  eliminarComida(id: string) {
    this.CService.eliminarComida(id).then(() => {
      this.toast.success('Comida eliminada correctamente','Exito');
      this.obtenerComidasDelDia();
    }).catch(() => {
      this.toast.error('Error al eliminar la comida','Error');
    });
  }

  obtenerComidasDelDia() {
    this.CService.obtenerComidasDelDia(new Date().toLocaleDateString('en-CA', { hour12: false }).replace(',', '')).then(comidas => {
      this.ComidaDelDia = comidas;
    })
  }
  
}

