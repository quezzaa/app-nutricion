import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { FooterComponent } from './bars/footer/footer.component';
import { NavbarComponent } from './bars/navbar/navbar.component';
import { SqliteService } from './services/sql-lite-service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FooterComponent, NavbarComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'Let me cook!';
  hideBars = false;

  constructor(private sqliteService: SqliteService, private router: Router) {}

  async ngOnInit() {
    try {
      await this.sqliteService.initDB();
      console.log('Base de datos inicializada.');
    } catch (error) {
      console.error('Error al iniciar la base de datos:', error);
    }
  
    this.router.events.subscribe(() => {
      const hiddenRoutes = ['/login', '/signup'];
      this.hideBars = hiddenRoutes.includes(this.router.url);
    });
  }
  
}

