export interface Alimento {
    nombre: string;
    unidad: 'g' | 'ml'; // Distinción entre sólidos y líquidos
    calorias: number;
    proteina: number;
    carbohidratos: number;
    grasas: number;
    sodio?: number;
    azucares?: number;
    fibra?: number;
  }