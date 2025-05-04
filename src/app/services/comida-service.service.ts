import { Injectable } from '@angular/core';
import { RegistroComida } from '../Models/comida.model';
import { SqliteService } from './sql-lite-service.service';
import { AlimentoConCantidad } from '../Models/comida.model';

@Injectable({
  providedIn: 'root'
})
export class ComidaServiceService {
  private STORAGE_KEY = 'registro_comidas';

  constructor(private db: SqliteService) { }

  async guardarComida(registro: RegistroComida): Promise<void> {
    const db = await this.db.getDb();
    const { fecha, idUsuario, alimentos } = registro;
  
    // Insertar la comida
    const res = await db?.run(
      `INSERT INTO tbComida (fecha, idUsuario) VALUES (?, ?)`,
      [fecha, idUsuario]
    );
    const idComida = res?.changes?.lastId;
  
    // Insertar cada alimento relacionado
    for (const alimento of alimentos) {
      await db?.run(
        `INSERT INTO tbComidaAlimento (idComida, idAlimento, cantidad)
         VALUES (?, ?, ?)`,
        [idComida, alimento.idAlimento, alimento.cantidad]
      );
    }
  }

  async obtenerComidasDelDia(fecha: string, idUsuario: number): Promise<RegistroComida[]> {
    const db = await this.db.getDb();
    const comidas: RegistroComida[] = [];
  
    const rows = await db?.query(
      `SELECT * FROM tbComida WHERE fecha LIKE ? AND idUsuario = ?`,
      [`${fecha}%`, idUsuario]
    );
  
    for (const row of rows?.values ?? []) {
      const alimentosResult = await db?.query(
        `SELECT B.*, A.cantidad
         FROM tbComidaAlimento A
         JOIN tbAlimento B ON A.idAlimento = B.idAlimento
         WHERE A.idComida = ?`,
        [row.idComida]
      );
  
      // Cálculo de los totales usando SUM en la consulta SQL
      const totalesResult = await db?.query(
        `SELECT 
           SUM(A.cantidad * B.calorias / 100) AS calorias,
           SUM(A.cantidad * B.proteina / 100) AS proteina,
           SUM(A.cantidad * B.carbohidratos / 100) AS carbohidratos,
           SUM(A.cantidad * B.grasas / 100) AS grasas,
           SUM(A.cantidad * B.sodio / 100) AS sodio,
           SUM(A.cantidad * B.azucares / 100) AS azucares,
           SUM(A.cantidad * B.fibra / 100) AS fibra
         FROM tbComidaAlimento A
         JOIN tbAlimento B ON A.idAlimento = B.idAlimento
         WHERE A.idComida = ?`,
        [row.idComida]
      );
  
      // Mapear los alimentos
      const alimentos: AlimentoConCantidad[] = (alimentosResult?.values ?? []).map(a => {
        const factor = a.cantidad / 100;
        return {
          idAlimento: a.idAlimento,
          nombre: a.nombre,
          cantidad: a.cantidad,
          idUnidad: a.idUnidad,
          caloriasTotales: +(factor * (a.calorias ?? 0)).toFixed(2),
          proteinaTotal: +(factor * (a.proteina ?? 0)).toFixed(2),
          carbohidratosTotales: +(factor * (a.carbohidratos ?? 0)).toFixed(2),
          grasasTotal: +(factor * (a.grasas ?? 0)).toFixed(2),
          sodioTotal: +(factor * (a.sodio ?? 0)).toFixed(2),
          azucaresTotal: +(factor * (a.azucares ?? 0)).toFixed(2),
          fibraTotal: +(factor * (a.fibra ?? 0)).toFixed(2),
        };
      });
  
      // Totales calculados de la consulta SUM
      const values = totalesResult?.values || [];
      const totales = values[0] || {};

      const comidaTotal = {
        proteina: +(totales.proteina ?? 0).toFixed(2),
        carbohidratos: +(totales.carbohidratos ?? 0).toFixed(2),
        grasas: +(totales.grasas ?? 0).toFixed(2),
        calorias: +(totales.calorias ?? 0).toFixed(2),
        sodio: +(totales.sodio ?? 0).toFixed(2),
        azucares: +(totales.azucares ?? 0).toFixed(2),
        fibra: +(totales.fibra ?? 0).toFixed(2),
      };

  
      comidas.push({
        idComida: row.idComida,
        fecha: row.fecha,
        idUsuario: row.idUsuario,
        alimentos,
        totales: comidaTotal,
      });
    }
  
    return comidas;
  }
  

  async eliminarComida(idComida: number): Promise<void> {
    const db = await this.db.getDb();
    await db?.run(`DELETE FROM tbComida WHERE idComida = ?`, [idComida]);
  }

// Obtener las comidas de la semana (últimos 7 días) con los totales calculados
async obtenerComidasDeLaSemana(idUsuario: number): Promise<any[]> {
  const db = await this.db.getDb();
  const fechaHoy = new Date();
  const fechaHace7Dias = new Date(fechaHoy.setDate(fechaHoy.getDate() - 7));
  const fechaInicioSemana = fechaHace7Dias.toISOString().slice(0, 10); // 'YYYY-MM-DD'

  const query = `
    SELECT 
      c.idComida, 
      c.fecha, 
      SUM(a.calorias * ca.cantidad) AS calorias,
      SUM(a.proteina * ca.cantidad) AS proteina,
      SUM(a.carbohidratos * ca.cantidad) AS carbohidratos,
      SUM(a.grasas * ca.cantidad) AS grasas,
      SUM(a.sodio * ca.cantidad) AS sodio,
      SUM(a.azucares * ca.cantidad) AS azucares,
      SUM(a.fibra * ca.cantidad) AS fibra
    FROM tbComida c
    JOIN tbComidaAlimento ca ON ca.idComida = c.idComida
    JOIN tbAlimento a ON a.idAlimento = ca.idAlimento
    WHERE date(c.fecha) >= '${fechaInicioSemana}' AND c.idUsuario = ${idUsuario}
    GROUP BY c.idComida, c.fecha
  `;

  const result = await db?.query(query);
  const comidas = result?.values || [];
  return comidas;
}


  

// Obtener las comidas del mes (últimos 30 días) con los totales calculados
async obtenerComidasDelMes(idUsuario: number): Promise<any[]> {
  const db = await this.db.getDb();
  const fechaHoy = new Date();
  const fechaHace30Dias = new Date(fechaHoy.setDate(fechaHoy.getDate() - 30));
  const fechaInicioMes = fechaHace30Dias.toISOString().slice(0, 10); // 'YYYY-MM-DD'

  const query = `
    SELECT 
      c.idComida, 
      c.fecha, 
      SUM(a.calorias * ca.cantidad) AS calorias,
      SUM(a.proteina * ca.cantidad) AS proteina,
      SUM(a.carbohidratos * ca.cantidad) AS carbohidratos,
      SUM(a.grasas * ca.cantidad) AS grasas,
      SUM(a.sodio * ca.cantidad) AS sodio,
      SUM(a.azucares * ca.cantidad) AS azucares,
      SUM(a.fibra * ca.cantidad) AS fibra
    FROM tbComida c
    JOIN tbComidaAlimento ca ON ca.idComida = c.idComida
    JOIN tbAlimento a ON a.idAlimento = ca.idAlimento
    WHERE date(c.fecha) >= '${fechaInicioMes}' AND c.idUsuario = ${idUsuario}
    GROUP BY c.idComida, c.fecha
  `;

  const result = await db?.query(query);
  const comidas = result?.values || [];
  return comidas;
}


  
}
