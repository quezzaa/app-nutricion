import { Injectable } from '@angular/core';
import { SqliteService } from './sql-lite-service.service';
import { Alimento } from '../Models/alimento.model';

@Injectable({
  providedIn: 'root'
})
export class AlimentosServiceService {

  constructor(private db: SqliteService) {}

  async guardarAlimento(nuevoAlimento: Alimento): Promise<void> {
    const query = `
      INSERT INTO tbAlimento (nombre, idUnidad, calorias, proteina, carbohidratos, grasas, sodio, azucares, fibra, idUsuario)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const db = await this.db.getDb();
    if (db) {
      await db.run(query, [
        nuevoAlimento.nombre,
        nuevoAlimento.idUnidad,
        nuevoAlimento.calorias || 0,
        nuevoAlimento.proteina || 0,
        nuevoAlimento.carbohidratos || 0,
        nuevoAlimento.grasas || 0,
        nuevoAlimento.sodio || 0,
        nuevoAlimento.azucares || 0,
        nuevoAlimento.fibra || 0,
        nuevoAlimento.idUsuario || null
      ]);
    }else{
      throw new Error('No se pudo obtener la base de datos');
    }
  }

  async obtenerAlimentos(): Promise<Alimento[]> {
    const query = 'SELECT * FROM tbAlimento';
    const db = await this.db.getDb();
    if (db) {
      const result = await db.query(query);
      if (result.values?.length === 0) {
        return [];
      } else {
        return (result.values ?? []).map((row: any) => ({
          idAlimento: row.idAlimento,
          nombre: row.nombre,
          idUnidad: row.idUnidad,
          calorias: row.calorias ?? 0,
          proteina: row.proteina ?? 0,
          carbohidratos: row.carbohidratos ?? 0,
          grasas: row.grasas ?? 0,
          sodio: row.sodio ?? 0,
          azucares: row.azucares ?? 0,
          fibra: row.fibra ?? 0,
          idUsuario: row.idUsuario ?? null
        }));        
      }
    } else {
      throw new Error('No se pudo obtener la base de datos');
      return [];
    }
  }

  async eliminarAlimentoPorId(idAlimento: number, idUsuario:number): Promise<void> {
    const query = 'DELETE FROM tbAlimento WHERE idAlimento = ? and idUsuario=?';
    const db = await this.db.getDb();
    if (db) {
      const result = await db.query(query, [idAlimento,idUsuario]);
    }else{
      throw new Error('No se pudo obtener la base de datos');
    }
  }  
  
}

