import { Injectable } from '@angular/core';
import { Usuario } from '../Models/usuario.models';
import { SqliteService } from './sql-lite-service.service';

@Injectable({
  providedIn: 'root'
})
export class AjustesPerfilServiceService {

  constructor(private db: SqliteService) {
  }

  async obtenerIdUsuario(): Promise<number | null> {
    const data = localStorage.getItem('idUsuario');
    return data ? parseInt(data) : null;
  }

  async obtenerUsuarioDesdeDB(idUsuario: number): Promise<Usuario | null> {
    const db = await this.db.getDb();
    const res = await db?.query(`SELECT * FROM tbUsuario WHERE idUsuario = ?`, [idUsuario]);
    return res?.values?.[0] ?? null;
  }

  async actualizarUsuario(usuario: Usuario): Promise<boolean> {
    const db = await this.db.getDb();
    try {
      const sql = `
        UPDATE tbUsuario SET
          idGenero = ?, idActividad = ?, nombre = ?, correo = ?, fechaNacimiento = ?,
          altura = ?, peso = ?, metaCalorias = ?, metaProteinas = ?, metaCarbohidratos = ?,
          metaFibra = ?, metaAzucares = ?, metaSodio = ?, metaGrasas = ?, metaAgua = ?
        WHERE idUsuario = ?
      `;
      const values = [
        usuario.idGenero, usuario.idActividad, usuario.nombre, usuario.correo, usuario.fechaNacimiento,
        usuario.altura, usuario.peso, usuario.metaCalorias, usuario.metaProteinas, usuario.metaCarbohidratos,
        usuario.metaFibra, usuario.metaAzucares, usuario.metaSodio, usuario.metaGrasas, usuario.metaAgua,
        usuario.idUsuario
      ];
      await db?.run(sql, values);
      return true;
    } catch (err) {
      console.error('Error al actualizar usuario', err);
      return false;
    }
  }

  async cambiarPassword(idUsuario: number, actual: string, nueva: string): Promise<boolean> {
    const db = await this.db.getDb();
    const res = await db?.query(`SELECT pass FROM tbUsuario WHERE idUsuario = ?`, [idUsuario]);
    if (!res?.values?.length || res.values[0].pass !== actual) return false;

    await db?.run(`UPDATE tbUsuario SET pass = ? WHERE idUsuario = ?`, [nueva, idUsuario]);
    return true;
  }
}

