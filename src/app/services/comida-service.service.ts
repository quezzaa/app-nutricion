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
}
