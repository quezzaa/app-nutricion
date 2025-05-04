// sqlite.service.ts
import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import {
  CapacitorSQLite,
  SQLiteDBConnection,
  SQLiteConnection,
} from '@capacitor-community/sqlite';

@Injectable({
  providedIn: 'root',
})
export class SqliteService {
  public sqlite: SQLiteConnection;
  public db: SQLiteDBConnection | null = null;
  public dbName = 'appNutricionDB'; // Nombre de la base de datos

  constructor() {
    this.sqlite = new SQLiteConnection(CapacitorSQLite);
  }

  async initDB(): Promise<void> {
    if (Capacitor.isNativePlatform()) {
      try {
        const existing = await this.sqlite.checkConnectionsConsistency();
        if (existing.result) {
          await this.sqlite.closeAllConnections();
        }
  
        this.db = await this.sqlite.createConnection(this.dbName, false, 'no-encryption', 1, false);
        await this.db.open();
        await this.createTables();
      } catch (error) {
        console.error('Error inicializando DB:', error);
      }
    } else {
      console.warn('SQLite solo está disponible en plataformas nativas');
    }
  }
  

  async createTables(): Promise<void> {
    if (!this.db) return;
    console.log('Creando tablas...');
    const sql = `
    CREATE TABLE IF NOT EXISTS tbGenero (
      idGenero INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL UNIQUE
    );

    CREATE TABLE IF NOT EXISTS tbActividadFisica (
      idActividad INTEGER PRIMARY KEY AUTOINCREMENT,
      nivel TEXT NOT NULL UNIQUE
    );

    CREATE TABLE IF NOT EXISTS tbUnidad (
      idUnidad INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL UNIQUE -- 'g' o 'ml'
    );

    CREATE TABLE IF NOT EXISTS tbUsuario (
      idUsuario INTEGER PRIMARY KEY AUTOINCREMENT,
      idActividad INTEGER,
      idGenero INTEGER,
      nombre TEXT,
      correo TEXT NOT NULL UNIQUE,
      fechaNacimiento TEXT , -- formato ISO 8601: 'YYYY-MM-DD'
      altura REAL,
      peso REAL,
      metaCalorias REAL,
      metaProteinas REAL,
      metaCarbohidratos REAL,
      metaFibra REAL,
      metaAzucares REAL,
      metaSodio REAL,
      metaGrasas REAL,
      metaAgua REAL,
      pass TEXT NOT NULL,
      FOREIGN KEY (idGenero) REFERENCES tbGenero(idGenero),
      FOREIGN KEY (idActividad) REFERENCES tbActividadFisica(idActividad)
    );

    CREATE TABLE IF NOT EXISTS tbAlimento (
      idAlimento INTEGER PRIMARY KEY AUTOINCREMENT,
      idUnidad INTEGER,
      idUsuario INTEGER, -- NULL si es preestablecido
      nombre TEXT NOT NULL,
      calorias REAL,
      proteina REAL,
      carbohidratos REAL,
      grasas REAL,
      sodio REAL,
      azucares REAL,
      fibra REAL,
      FOREIGN KEY (idUnidad) REFERENCES tbUnidad(idUnidad),
      FOREIGN KEY (idUsuario) REFERENCES tbUsuario(idUsuario) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS tbAgua (
      idAgua INTEGER PRIMARY KEY AUTOINCREMENT,
      idUsuario INTEGER NOT NULL,
      cantidad REAL NOT NULL,
      fecha TEXT NOT NULL, -- formato 'YYYY-MM-DD HH:MM:SS'
      FOREIGN KEY (idUsuario) REFERENCES tbUsuario(idUsuario) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS tbComida (
      idComida INTEGER PRIMARY KEY AUTOINCREMENT,
      idUsuario INTEGER NOT NULL,
      fecha TEXT NOT NULL, -- formato 'YYYY-MM-DD HH:MM:SS'
      FOREIGN KEY (idUsuario) REFERENCES tbUsuario(idUsuario) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS tbComidaAlimento (
      idComidaAlimento INTEGER PRIMARY KEY AUTOINCREMENT,
      idComida INTEGER NOT NULL,
      idAlimento INTEGER NOT NULL,
      cantidad REAL NOT NULL, -- en g o ml según unidad del alimento
      FOREIGN KEY (idComida) REFERENCES tbComida(idComida) ON DELETE CASCADE,
      FOREIGN KEY (idAlimento) REFERENCES tbAlimento(idAlimento)
    );

    INSERT OR IGNORE INTO tbGenero (nombre) VALUES ('Masculino'), ('Femenino');

    INSERT OR IGNORE INTO tbActividadFisica (nivel) VALUES
      ('Sedentario'),
      ('Ligero'),
      ('Moderado'),
      ('Activo'),
      ('Muy activo');

    INSERT OR IGNORE INTO tbUnidad (nombre) VALUES ('g'), ('ml');

    -- Insertar alimentos comunes (con idUnidad válidos)
INSERT OR IGNORE INTO tbAlimento (
    idUnidad, 
    idUsuario, 
    nombre, 
    calorias, 
    proteina, 
    carbohidratos, 
    grasas, 
    sodio, 
    azucares, 
    fibra
) VALUES 
(1, NULL, 'Huevo', 155, 13, 1.1, 11, 142, 1.1, 0),
(1, NULL, 'Pollo (Pechuga)', 165, 31, 0, 3.6, 74, 0, 0),
(1, NULL, 'Carne de res (Magro)', 250, 26, 0, 17, 70, 0, 0),
(1, NULL, 'Cerdo (Lomo)', 242, 27, 0, 14, 62, 0, 0),
(1, NULL, 'Salmón', 208, 20, 0, 13, 63, 0, 0),
(1, NULL, 'Atún', 132, 28, 0, 1, 47, 0, 0),
(1, NULL, 'Bacalao', 105, 23, 0, 1, 53, 0, 0),
(1, NULL, 'Pavo', 135, 30, 0, 1, 55, 0, 0),
(1, NULL, 'Ternera', 250, 26, 0, 17, 70, 0, 0),
(1, NULL, 'Arroz (Cocido)', 130, 2.7, 28.2, 0.3, 1, 0.05, 0.4),
(1, NULL, 'Pasta (Cocida)', 157, 5.8, 31.9, 0.9, 1, 0.1, 1.8),
(1, NULL, 'Lentejas', 116, 9, 20, 0.4, 2, 0.04, 7.9),
(1, NULL, 'Garbanzos', 164, 8.9, 27.4, 2.6, 24, 0.01, 7.6),
(1, NULL, 'Frijoles', 127, 8.7, 22.8, 0.8, 5, 0.01, 7.5),
(1, NULL, 'Alubias', 127, 8.7, 22.8, 0.8, 5, 0.01, 7.5),
(1, NULL, 'Patatas', 77, 2, 17.6, 0.1, 7, 0.8, 2.2),
(1, NULL, 'Zanahoria', 41, 0.9, 9.6, 0.2, 69, 4.7, 2.8),
(1, NULL, 'Pepino', 16, 0.7, 3.6, 0.1, 2, 1.7, 0.5),
(1, NULL, 'Tomate', 18, 0.9, 3.9, 0.2, 5, 2.6, 1.2),
(1, NULL, 'Lechuga', 15, 1.4, 2.9, 0.2, 28, 0.8, 1.3),
(1, NULL, 'Espinaca', 23, 2.9, 3.6, 0.4, 79, 0.4, 2.2),
(1, NULL, 'Brócoli', 34, 2.8, 6.6, 0.4, 33, 1.7, 2.6),
(1, NULL, 'Coliflor', 25, 1.9, 4.9, 0.3, 30, 1.91, 2),
(1, NULL, 'Acelga', 19, 1.8, 3.7, 0.2, 213, 0.6, 1.6),
(1, NULL, 'Guisante', 81, 5.4, 14.5, 0.4, 5, 5.7, 5.1),
(1, NULL, 'Aguacate', 160, 2, 8.5, 14.7, 7, 0.7, 6.7),
(1, NULL, 'Fresas', 32, 0.8, 7.7, 0.3, 1, 4.9, 2.0),
(1, NULL, 'Manzana', 52, 0.26, 13.81, 0.17, 1, 10.39, 2.4),
(1, NULL, 'Plátano', 89, 1.09, 22.84, 0.33, 1, 12.23, 2.6),
(1, NULL, 'Pera', 57, 0.4, 15.23, 0.14, 1, 9.75, 3.1),
(1, NULL, 'Naranja', 47, 0.9, 11.75, 0.1, 1, 9.35, 2.4),
(1, NULL, 'Mandarina', 53, 0.8, 13.34, 0.2, 1, 10.58, 1.8),
(1, NULL, 'Uva', 69, 0.72, 18.1, 0.16, 2, 15.48, 0.9),
(1, NULL, 'Mango', 60, 0.82, 15, 0.38, 1, 13.2, 1.6),
(1, NULL, 'Melón', 34, 0.91, 8.16, 0.19, 18, 7.86, 0.9),
(1, NULL, 'Sandía', 30, 0.61, 7.55, 0.15, 1, 6.2, 0.4),
(1, NULL, 'Cereza', 63, 1.06, 16.01, 0.2, 2, 12.8, 2.1),
(1, NULL, 'Piña', 50, 0.54, 13.12, 0.12, 1, 9.85, 1.4),
(1, NULL, 'Kiwi', 61, 1.14, 14.66, 0.5, 3, 9.17, 2.1),
(1, NULL, 'Granada', 83, 1.67, 18.67, 1.17, 3, 16.29, 4.0),
(1, NULL, 'Ciruela', 46, 0.7, 11.42, 0.3, 3, 9.92, 1.4),
(1, NULL, 'Durazno', 39, 0.91, 9.39, 0.25, 0, 8.39, 1.5),
(1, NULL, 'Higo', 74, 0.91, 19.18, 0.16, 1, 16.26, 2.4),
(1, NULL, 'Coco', 354, 3.3, 15.23, 33.49, 20, 6.23, 9),
(1, NULL, 'Almendra', 579, 21.15, 21.55, 49.93, 1, 3.89, 12.2),
(1, NULL, 'Nuez', 607, 15.23, 13.71, 54.12, 2, 3.42, 6.7),
(1, NULL, 'Cacahuate', 567, 25.8, 16.13, 49.24, 18, 3.8, 8.5),
(1, NULL, 'Avellana', 628, 14.07, 16.7, 60.75, 0, 3.7, 9.7),
(1, NULL, 'Pistache', 562, 20.16, 28.01, 45.32, 1, 7.66, 10.6),
(1, NULL, 'Pechuga de pavo', 135, 30, 0, 1, 55, 0, 0),
(2, NULL, 'Yogur natural', 59, 3.5, 4.5, 3.3, 36, 5, 0),
(2, NULL, 'Leche entera', 42, 3.4, 4.8, 1, 0.1, 5, 0),
(2, NULL, 'Leche descremada', 34, 3.4, 5.1, 0.1, 0.1, 5, 0),
(1, NULL, 'Queso fresco', 264, 18.3, 3.1, 21.7, 600, 0, 0),
(1, NULL, 'Queso cheddar', 402, 25, 1.3, 33.1, 621, 0, 0),
(1, NULL, 'Queso mozzarella', 280, 28.5, 3.1, 17.0, 520, 0, 0),
(1, NULL, 'Queso cottage', 98, 11.1, 3.4, 4.3, 320, 3.4, 0),
(1, NULL, 'Mantequilla', 717, 0.85, 0.06, 81.11, 31, 0.1, 0),
(1, NULL, 'Aceite de oliva', 884, 0, 0, 100, 2, 0, 0);


    `;
    const statements = sql.trim().split(';').filter(stmt => stmt.trim().length > 0);
    for (const stmt of statements) {
      await this.db.execute(stmt + ';');
    }

  }

  getDb(): SQLiteDBConnection | null {
    return this.db;
  }

  async close(): Promise<void> {
    if (this.db) {
      await this.sqlite.closeConnection(this.dbName,false);
      this.db = null;
    }
  }

}
