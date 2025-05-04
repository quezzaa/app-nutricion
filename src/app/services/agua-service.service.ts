import { Injectable } from '@angular/core';
import { SqliteService } from './sql-lite-service.service';
import { Agua } from '../Models/agua.model';

@Injectable({
  providedIn: 'root'
})
export class AguaServiceService {

  constructor(private sqliteService: SqliteService) {}

  async guardarAgua(nuevaEntrada: Agua): Promise<void> {
    const db = await this.sqliteService.getDb();
    if (db) {
      const query = `
        INSERT INTO tbAgua (cantidad, fecha, idUsuario)
        VALUES (?, ?, ?)
      `;
      await db.run(query, [nuevaEntrada.cantidad, nuevaEntrada.fecha, nuevaEntrada.idUsuario]);
    }
  }

  async eliminarAguaPorId(idAgua: number): Promise<void> {
    const db = await this.sqliteService.getDb();
    if (db) {
      const query = 'DELETE FROM tbAgua WHERE idAgua = ?';
      await db.run(query, [idAgua]);
    }
  }

  async obtenerSoloDeHoy(idUsuario:number): Promise<Agua[]> {
    const hoy = new Date();
    const hoyLocal = hoy.toLocaleDateString('en-CA');
    const db = await this.sqliteService.getDb();
    if (db) {
      const query = 'SELECT * FROM tbAgua WHERE fecha LIKE ? and idUsuario = ?';
      const result = await db.query(query, [`${hoyLocal}%`, idUsuario]);
      return result.values as Agua[];
    }
    return [];
  }

// Obtener el agua registrada en la semana (últimos 7 días)
async obtenerAguaDeLaSemana(idUsuario: number): Promise<any[]> {
  const db = await this.sqliteService.getDb();
  const fechaHoy = new Date();
  const fechaHace7Dias = new Date();
  fechaHace7Dias.setDate(fechaHoy.getDate() - 7);
  const fechaInicioSemana = fechaHace7Dias.toISOString().slice(0, 10);

  const query = `
    SELECT 
      fecha, 
      SUM(cantidad) AS cantidad
    FROM tbAgua
    WHERE date(fecha) >= '${fechaInicioSemana}' 
    AND idUsuario = ${idUsuario}
    GROUP BY fecha
  `;

  const result = await db?.query(query);
  return result?.values || [];
}

  
  
// Obtener el agua registrada en el mes (últimos 30 días)
async obtenerAguaDelMes(idUsuario: number): Promise<any[]> {
  const db = await this.sqliteService.getDb();
  const fechaHoy = new Date();
  const fechaHace30Dias = new Date();
  fechaHace30Dias.setDate(fechaHoy.getDate() - 30);
  const fechaInicioMes = fechaHace30Dias.toISOString().slice(0, 10);

  const query = `
    SELECT 
      fecha, 
      SUM(cantidad) AS cantidad
    FROM tbAgua
    WHERE date(fecha) >= '${fechaInicioMes}' 
    AND idUsuario = ${idUsuario}
    GROUP BY fecha
  `;

  const result = await db?.query(query);
  return result?.values || [];
}

  

}
