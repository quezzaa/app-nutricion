import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserServiceService } from '../../services/user-service.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private userService: UserServiceService, private router: Router,
    private toast: ToastrService) {}
  async login() {
    try {
      const user = await this.userService.loginUser(this.email, this.password);
      if (user) {
        sessionStorage.setItem('userId', user.idUsuario); // Guarda el ID del usuario
        this.router.navigate(['/resumen-dia']);
      } else {
        this.errorMessage = 'Credenciales incorrectas';
      }
    } catch (error) {
      this.errorMessage = 'Hubo un error al intentar iniciar sesión';
    }
  }
  

  // Función para registrar un nuevo usuario
  async register() {
    try {
      const userExists = await this.userService.checkUserExists(this.email);
      if (userExists) {
        this.errorMessage = 'El correo ya está registrado';
        this.toast.error('userExists')
      } else {
        await this.userService.registerUser(this.email, this.password);
        const user = await this.userService.loginUser(this.email, this.password); // login después de registrar
        if (user) {
          sessionStorage.setItem('userId', user.idUsuario); // Guarda ID en sesión
          this.router.navigate(['/resumen-dia']);
        }
      }
    } catch (error) {
      this.errorMessage = 'Hubo un error al registrar el usuario';
    }
  }
  
}
