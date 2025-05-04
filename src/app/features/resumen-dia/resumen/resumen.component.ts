import { ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComidaServiceService } from '../../../services/comida-service.service';
import { AjustesPerfilServiceService } from '../../../services/ajustes-perfil-service.service';
import { AguaServiceService } from '../../../services/agua-service.service';
import { RegistroComida } from '../../../Models/comida.model';
import { Agua } from '../../../Models/agua.model';
import { Usuario } from '../../../Models/usuario.models';
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
  idUsuario: any;
  metas:any
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
    this.idUsuario = sessionStorage.getItem('userId');
    this.cargarMetas();
    this.cargarDatosDelDia();
  }
  
  async cargarMetas() {
    const datos = await this.AService.obtenerUsuarioDesdeDB(parseInt(this.idUsuario));
    if (datos) this.usuario = datos;
  }
  
  cargarDatosDelDia() {
    const fecha = this.obtenerFechaActual();
    const comidasDelDia = this.CService.obtenerComidasDelDia(fecha, parseInt(this.idUsuario));
    const aguaRegistrada = this.AgService.obtenerSoloDeHoy(parseInt(this.idUsuario));
  
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
      totales.calorias += comida?.totales?.calorias || 0;
      totales.proteina += comida?.totales?.proteina || 0;
      totales.carbohidratos += comida.totales?.carbohidratos || 0;
      totales.grasas += comida.totales?.grasas || 0;
      totales.sodio += comida.totales?.sodio || 0;
      totales.azucares += comida.totales?.azucares || 0;
      totales.fibra += comida.totales?.fibra || 0;
    }
  
    totales.agua = agua.reduce((sum, r) => sum + r.cantidad, 0);
    return totales;
  }

  calcularPorcentajes() {
    this.porcentajes = {
      calorias: this.porcentaje(this.resumen.calorias, this.usuario.metaCalorias),
      proteina: this.porcentaje(this.resumen.proteina, this.usuario.metaProteinas),
      carbohidratos: this.porcentaje(this.resumen.carbohidratos, this.usuario.metaCarbohidratos),
      grasas: this.porcentaje(this.resumen.grasas, this.usuario.metaGrasas),
      fibra: this.porcentaje(this.resumen.fibra, this.usuario.metaFibra),
      azucares: this.porcentaje(this.resumen.azucares, this.usuario.metaAzucares),
      sodio: this.porcentaje(this.resumen.sodio, this.usuario.metaSodio),
      agua: this.porcentaje(this.resumen.agua, this.usuario.metaAgua),
    };
  }

  porcentaje(valor: number, meta: number): number {
    if (!meta || meta === 0) return 0;
    const p = (valor / meta) * 100;
    return p > 100 ? 100 : p;
  }
  
}
