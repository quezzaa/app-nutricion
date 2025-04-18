export interface Alimento {
    id: string;
    nombre: string;
    unidad?: 'g' | 'ml';
    calorias?: number;
    proteina?: number;
    carbohidratos?: number;
    grasas?: number;
    sodio?: number;
    azucares?: number;
    fibra?: number;
  }