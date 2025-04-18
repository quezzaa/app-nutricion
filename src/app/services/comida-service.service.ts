import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { RegistroComida } from '../Models/comida.model';

@Injectable({
  providedIn: 'root'
})
export class ComidaServiceService {
  private STORAGE_KEY = 'registro_comidas';

  constructor() { }

  async guardarComida(comida: RegistroComida): Promise<void> {
    const comidas = await this.obtenerComidas();
    comidas.push(comida);
    await Preferences.set({
      key: this.STORAGE_KEY,
      value: JSON.stringify(comidas)
    });
  }

  async obtenerComidas(): Promise<RegistroComida[]> {
    const { value } = await Preferences.get({ key: this.STORAGE_KEY });
    return value ? JSON.parse(value) : [];
  }

  async obtenerComidasDelDia(fecha: string): Promise<RegistroComida[]> {
    const comidas = await this.obtenerComidas();
    return comidas.filter(c => c.fecha.slice(0, 10) === fecha);
  }

  async eliminarComida(id: string): Promise<void> {
    const comidas = await this.obtenerComidas();
    const nuevaLista = comidas.filter(a => a.id !== id);
    await Preferences.set({
      key: this.STORAGE_KEY,
      value: JSON.stringify(nuevaLista)
    });
  }

  async obtenerComidasDeLaSemana(): Promise<RegistroComida[]> {
    const ahora = new Date();
    const primerDiaSemana = new Date(ahora);
    primerDiaSemana.setDate(ahora.getDate() - ahora.getDay());
    const lista = await this.obtenerComidas();
    return lista.filter(c => {
      const fecha = new Date(c.fecha);
      return fecha >= primerDiaSemana && fecha <= ahora;
    });
  }

  async obtenerComidasDelMes(): Promise<RegistroComida[]> {
    const ahora = new Date();
    const primerDiaMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
    const lista = await this.obtenerComidas();
    return lista.filter(c => {
      const fecha = new Date(c.fecha);
      return fecha >= primerDiaMes && fecha <= ahora;
    });
  }
}
