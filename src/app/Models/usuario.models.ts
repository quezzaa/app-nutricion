export interface Usuario {
  idUsuario: number;
  idGenero: number;
  idActividad: number;
  nombre: string;
  correo: string;
  fechaNacimiento: string;
  altura: number;
  peso: number;
  metaCalorias: number;
  metaProteinas: number;
  metaCarbohidratos: number;
  metaFibra: number;
  metaAzucares: number;
  metaSodio: number;
  metaGrasas: number;
  metaAgua: number;
  pass?: string;
}
