import { Alimento } from './alimento.model';


export interface ComidaAlimento {
  idAlimento: number;
  cantidad: number;
}

export interface Comida {
  idComida: number;
  fecha: string;
  idUsuario: number;
}

export interface RegistroComida {
  idComida?: number;
  fecha: string; // 'YYYY-MM-DD HH:MM:SS'
  idUsuario: number;
  totales?:{
    calorias?: number,
    proteina?: number,
    carbohidratos?: number,
    grasas?: number,
    sodio?: number,
    azucares?: number,
    fibra?: number,
  }
  alimentos: {
    idAlimento?: number;
    idUnidad?: number;
    nombre?: string;
    cantidad: number;
    caloriasTotales?: number,
    proteinaTotal?: number,
    carbohidratosTotales?: number,
    grasasTotal?: number,
    sodioTotal?: number,
    azucaresTotal?: number,
    fibraTotal?: number,
  }[];
}


export interface AlimentoConCantidad extends Alimento {
  cantidad: number;
  caloriasTotales: number;
  proteinaTotal: number;
  carbohidratosTotales: number;
  grasasTotal: number;
  sodioTotal?: number;
  azucaresTotal?: number;
  fibraTotal?: number;
}