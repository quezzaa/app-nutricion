import { Routes } from '@angular/router';
import {AjustesComponent} from './features/configuracion/ajustes/ajustes.component';
import { GraficoDiarioComponent } from './features/estadisticas/grafico-diario/grafico-diario.component';
import { FormularioAlimentoComponent } from './features/registro-alimento/formulario-alimento/formulario-alimento.component';
import { FormularioAguaComponent } from './features/registro-agua/formulario-agua/formulario-agua.component';   
import { ResumenComponent } from './features/resumen-dia/resumen/resumen.component';
import { RegistroComidaComponent } from './features/registro-comida/registro-comida.component';
import { LoginComponent } from './login/login/login.component';

export const routes: Routes = [
  { path: 'registro-alimento', component: FormularioAlimentoComponent },
  { path: 'resumen-dia', component: ResumenComponent },
  { path: 'estadisticas', component: GraficoDiarioComponent },
  { path: 'registro-agua', component: FormularioAguaComponent },
  { path: 'configuracion', component: AjustesComponent},
  {path: 'registro-comida', component: RegistroComidaComponent}, 
  {path: 'login', component: LoginComponent}, 
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];


