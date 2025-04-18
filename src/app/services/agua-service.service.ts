import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { Agua } from '../Models/agua.model';

const CLAVE_AGUA = 'registro_agua';
@Injectable({
  providedIn: 'root'
})
export class AguaServiceService {

  constructor() { }

  async guardarAgua(nuevaEntrada: Agua): Promise<void> {
    const lista = await this.obtenerAgua();
    lista.push(nuevaEntrada);
    await Preferences.set({
      key: CLAVE_AGUA,
      value: JSON.stringify(lista)
    });
  }

  async eliminarAguaPorId(id: string): Promise<void> {
    const lista = await this.obtenerAgua();
    const nuevaLista = lista.filter(a => a.id !== id);
    await Preferences.set({
      key: CLAVE_AGUA,
      value: JSON.stringify(nuevaLista)
    });
  }

  async obtenerAgua(): Promise<Agua[]> {
    const { value } = await Preferences.get({ key: CLAVE_AGUA });
    return value ? JSON.parse(value) : [];
  }

  async obtenerSoloDeHoy(): Promise<Agua[]> {
    const hoy = new Date();
    const hoyLocal = hoy.toLocaleDateString('en-CA'); // Formato 'YYYY-MM-DD'
    const lista = await this.obtenerAgua();
    return lista.filter(a => new Date(a.Fecha).toLocaleDateString('en-CA') === hoyLocal);
  }
  
  
}
