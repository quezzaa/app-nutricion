import { Injectable } from '@angular/core';
import { SqliteService } from './sql-lite-service.service';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {
  constructor(private db: SqliteService) { }

  // Verificar si el usuario ya está registrado
  async checkUserExists(email: string): Promise<boolean> {
    const db = await this.db.getDb();
    const query = 'SELECT * FROM tbUsuario WHERE correo = ?';
    const result = await db?.query(query, [email]);
    const check = (result?.values?.length ?? 0) > 0;
    return check;
  }

// Registrar un nuevo usuario
async registerUser(email: string, password: string): Promise<void> {
  const db = await this.db.getDb();
  const query = `INSERT INTO tbUsuario 
    (idActividad, idGenero, nombre, altura, fechaNacimiento, peso, correo, pass, metaCalorias, metaProteinas, metaCarbohidratos, metaFibra, metaAzucares, metaSodio, metaGrasas, metaAgua) 
    VALUES 
    (1, 1, '', 0, '1970-01-01', 0, ?, ?, 2000, 150, 250, 30, 25, 2300, 70, 3000)`;

  await db?.run(query, [email, password]);
}


  // Iniciar sesión con el correo y la contraseña
  async loginUser(email: string, password: string): Promise<any> {
    const db = await this.db.getDb();
    const query = 'SELECT * FROM tbUsuario WHERE correo = ? AND pass = ?';
    const result = await db?.query(query, [email, password]);
    return result?.values?.[0] || null; // Retorna el usuario si existe, de lo contrario null
  }
}
