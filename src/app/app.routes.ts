import { Routes } from '@angular/router';
import {AjustesComponent} from './features/configuracion/ajustes/ajustes.component';
import { GraficoDiarioComponent } from './features/estadisticas/grafico-diario/grafico-diario.component';
import { FormularioAlimentoComponent } from './features/registro-alimento/formulario-alimento/formulario-alimento.component';
import { FormularioAguaComponent } from './features/registro-agua/formulario-agua/formulario-agua.component';   
import { FormularioPerfilComponent } from './features/perfil-usuario/formulario-perfil/formulario-perfil.component';
import { ResumenComponent } from './features/resumen-dia/resumen/resumen.component';
import { EstablecerMetasComponent } from './features/metas/establecer-metas/establecer-metas.component';

export const routes: Routes = [
  { path: 'registro-alimento', component: FormularioAlimentoComponent },
  { path: 'resumen-dia', component: ResumenComponent },
  { path: 'estadisticas', component: GraficoDiarioComponent },
  { path: 'perfil-usuario', component: FormularioPerfilComponent },
  { path: 'metas', component: EstablecerMetasComponent },
  { path: 'registro-agua', component: FormularioAguaComponent },
  { path: 'configuracion', component: AjustesComponent},
  { path: '', redirectTo: '/resumen-dia', pathMatch: 'full' },
];


