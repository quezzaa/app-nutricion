import { Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Alimento } from '../../../Models/alimento.model';
import { AlimentosServiceService } from '../../../services/alimentos-service.service';
import { ToastrService } from 'ngx-toastr';
import { v4 as uuidv4 } from 'uuid';


@Component({
  selector: 'app-formulario-alimento',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './formulario-alimento.component.html',
  styleUrl: './formulario-alimento.component.css'
})
export class FormularioAlimentoComponent implements OnInit {
  alimento: Alimento = {
    id: '',
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
  alimentos: Alimento[] = [];
  alimentoAEliminar: Alimento | null = null;

  constructor(private AService: AlimentosServiceService, private toast:ToastrService) {}
  ngOnInit(): void {
    this.getalimentos();
  }
  busqueda: string = '';

  get alimentosFiltrados() {
    return this.alimentos.filter(a =>
      a.nombre.toLowerCase().includes(this.busqueda.toLowerCase())
    );
  }

  getalimentos(){
     this.AService.obtenerAlimentos().then(
      (res: Alimento[]) => {
      this.alimentos = res;
      console.log(this.alimentos);
      },
      (err:any) => {
      console.log(err);
      this.toast.error('No se han podido cargar los alimentos','Error');}
    );
  }


  guardarAlimento() {
    if (!this.alimento.nombre || !this.alimento.unidad) {
      this.toast.warning('Por favor completa todos los campos obligatorios.','Cuidado');
      return;
    }
    if(this.alimentos.filter(a => a.nombre.toLowerCase().trim() !== this.alimento.nombre.toLowerCase().trim()).length < this.alimentos.length){
      this.toast.warning('El nombre del alimento ya existe.','Cuidado');
      return;
    }
    this.alimento.id = uuidv4();
    this.AService.guardarAlimento(this.alimento).then(
      (res:any) => {
        console.log(res);
        this.getalimentos();
        this.ClearForm();
        this.toast.success('Alimento guardado exitosamente.','Exito');
      },
      (err:any) => {
        console.log(err);
        this.toast.error('Error al guardar el alimento.','Error');
      });
  }

  abrirModalEliminar(alimento: Alimento) {
    this.alimentoAEliminar = alimento;
  }
  eliminarAlimento(id: string) {
    this.AService.eliminarAlimentoPorId(id).then(
      (res:any) => {
        console.log(res);
        this.alimentoAEliminar = null;
        this.getalimentos();
        this.toast.success('Alimento eliminado exitosamente.','Exito');
      },
      (err:any) => {
        console.log(err);
        this.toast.error('Error al eliminar el alimento.','Error');
      }
    );
  }
  

  ClearForm(){
    this.alimento = {
      id: '',
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
  }
}

