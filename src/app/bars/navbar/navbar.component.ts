import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [RouterModule,CommonModule],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
    constructor(private router: Router) { }
    logoutHide: any;
    ngOnInit(): void {
        if (this.router.url.includes('login')) {
          this.logoutHide = true;
        }
      }
      
    logout() {
        sessionStorage.removeItem('userId');
        this.router.navigate(['/login']);
      }
      
}
