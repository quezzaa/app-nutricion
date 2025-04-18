import { ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComidaServiceService } from '../../../services/comida-service.service';
import { AjustesPerfilServiceService } from '../../../services/ajustes-perfil-service.service';
import { AguaServiceService } from '../../../services/agua-service.service';
import { RegistroComida } from '../../../Models/comida.model';
import { Agua } from '../../../Models/agua.model';
@Component({
    selector: 'app-resumen',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './resumen.component.html',
    styleUrl: './resumen.component.css'
})
export class ResumenComponent implements OnInit {
  constructor(private AService:AjustesPerfilServiceService,private CService:ComidaServiceService,
    private AgService:AguaServiceService, private cd:ChangeDetectorRef){}

  metas:any
  resumen: any = { // Inicializamos resumen como un objeto vacío
    calorias: 0,
    proteina: 0,
    carbohidratos: 0,
    grasas: 0,
    sodio: 0,
    azucares: 0,
    fibra: 0,
    agua: 0,
  };
  porcentajes: any = {};

  ngOnInit(): void {
    this.cargarMetas();
    this.cargarDatosDelDia();
  }
  
  cargarMetas() {
    this.metas = this.AService.obtener();
  }
  
  cargarDatosDelDia() {
    const fecha = this.obtenerFechaActual();
    const comidasDelDia = this.CService.obtenerComidasDelDia(fecha);
    const aguaRegistrada = this.AgService.obtenerSoloDeHoy();
  
    Promise.all([comidasDelDia, aguaRegistrada]).then(([comidas, agua]) => {
      this.resumen = this.calcularTotalesDelDia(comidas, agua);
      this.calcularPorcentajes();
    });
  }
  
  obtenerFechaActual(): string {
    return new Date().toLocaleDateString('en-CA', { hour12: false }).replace(',', '');
  }
  calcularTotalesDelDia(comidas: RegistroComida[], agua: Agua[]) {
    const totales = {
      calorias: 0,
      proteina: 0,
      carbohidratos: 0,
      grasas: 0,
      sodio: 0,
      azucares: 0,
      fibra: 0,
      agua: 0,
    };
  
    for (const comida of comidas) {
      totales.calorias += comida.totales.calorias;
      totales.proteina += comida.totales.proteina;
      totales.carbohidratos += comida.totales.carbohidratos;
      totales.grasas += comida.totales.grasas;
      totales.sodio += comida.totales.sodio;
      totales.azucares += comida.totales.azucares;
      totales.fibra += comida.totales.fibra;
    }
  
    totales.agua = agua.reduce((sum, r) => sum + r.cantidad, 0);
    return totales;
  }

  calcularPorcentajes() {
    this.porcentajes = {
      calorias: this.porcentaje(this.resumen.calorias, this.metas.MetaCalorias),
      proteina: this.porcentaje(this.resumen.proteina, this.metas.MetaProteinas),
      carbohidratos: this.porcentaje(this.resumen.carbohidratos, this.metas.MetaCarbohidratos),
      grasas: this.porcentaje(this.resumen.grasas, this.metas.MetaGrasas),
      fibra: this.porcentaje(this.resumen.fibra, this.metas.MetaFibra),
      azucares: this.porcentaje(this.resumen.azucares, this.metas.MetaAzucares),
      sodio: this.porcentaje(this.resumen.sodio, this.metas.MetaSodio),
      agua: this.porcentaje(this.resumen.agua, this.metas.MetaAgua),
    };
  }

  porcentaje(valor: number, meta: number): number {
    if (!meta || meta === 0) return 0;
    const p = (valor / meta) * 100;
    return p > 100 ? 100 : p;
  }
  
}
