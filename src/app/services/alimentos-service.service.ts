import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { Alimento } from '../Models/alimento.model';

const CLAVE_ALIMENTOS = 'alimentos';

@Injectable({
  providedIn: 'root'
})
export class AlimentosServiceService {

  async guardarAlimento(nuevoAlimento: Alimento): Promise<void> {
    const lista = await this.obtenerAlimentos();
    lista.push(nuevoAlimento);
    await Preferences.set({
      key: CLAVE_ALIMENTOS,
      value: JSON.stringify(lista)
    });
  }
  async obtenerAlimentos(): Promise<Alimento[]> {
    const { value } = await Preferences.get({ key: CLAVE_ALIMENTOS });
    return value ? JSON.parse(value) : [];
  }
  async eliminarAlimentoPorId(id: string): Promise<void> {
      const lista = await this.obtenerAlimentos();
      const nuevaLista = lista.filter(a => a.id !== id);
      await Preferences.set({
        key: CLAVE_ALIMENTOS,
        value: JSON.stringify(nuevaLista)
      });
    }

}
