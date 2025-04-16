import { Alimento } from "./alimento.model";

export interface AlimentoConCantidad extends Alimento {
  cantidad: number;
  caloriasTotales: number;
  proteinaTotal: number;
  carbohidratosTotales: number;
  grasasTotales: number;
}

export interface RegistroComida {
  fecha: string;
  alimentos: AlimentoConCantidad[];
  totales: {
    calorias: number;
    proteina: number;
    carbohidratos: number;
    grasas: number;
  };
}
