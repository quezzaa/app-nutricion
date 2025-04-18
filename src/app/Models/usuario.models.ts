export interface Usuario {
    Nombre: string;
    Apellidos: string;
    Correo: string;
    FechaNacimiento: Date;
    Sexo: 'Masculino' | 'Femenino';
    Altura: number;
    Peso: number;
    ActividadFisica: 'Baja' | 'Media' | 'Alta';
    MetaCalorias: number;
    MetaProteinas: number;
    MetaCarbohidratos: number;
    MetaFibra: number;
    MetaAzucares: number;
    MetaSodio: number;
    MetaGrasas: number;
    MetaAgua: number;
  }
  