import { Injectable } from '@angular/core';
import { Usuario } from '../Models/usuario.models';

@Injectable({
  providedIn: 'root'
})
export class AjustesPerfilServiceService {
  private readonly STORAGE_KEY = 'ajustesUsuario';

  guardar(usuario: Usuario): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(usuario));
  }

  obtener(): Usuario | null {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  }
}
