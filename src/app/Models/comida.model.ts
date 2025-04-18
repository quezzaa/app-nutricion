import { Alimento } from "./alimento.model";

export interface AlimentoConCantidad extends Alimento {
  id: string;
  cantidad: number;
  caloriasTotales: number;
  proteinaTotal: number;
  carbohidratosTotales: number;
  grasasTotales: number;
  sodioTotal?: number;
  azucaresTotal?: number;
  fibraTotal?: number;
}

export interface RegistroComida {
  id: string;
  fecha: string;
  alimentos: AlimentoConCantidad[];
  totales: {
    calorias: number;
    proteina: number;
    carbohidratos: number;
    grasas: number;
    sodio: number;
    azucares: number;
    fibra: number;
  };
}
