import { Component, OnInit } from '@angular/core';
import { ComidaServiceService } from '../../../services/comida-service.service';
import { AguaServiceService } from '../../../services/agua-service.service';
import { RegistroComida } from '../../../Models/comida.model';
import { Agua } from '../../../Models/agua.model';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-grafico-diario',
  standalone: true,
  imports: [],
  templateUrl: './grafico-diario.component.html',
  styleUrl: './grafico-diario.component.css'
})
export class GraficoDiarioComponent {
  resumenSemanal = this.resetResumen();
  resumenMensual = this.resetResumen();

  constructor(
    private CService: ComidaServiceService,
    private AService: AguaServiceService,
    private toast:ToastrService
  ) {}
  ngOnInit(): void {
    this.calcularEstadisticas();
  }

  resetResumen() {
    return {
      calorias: 0,
      proteina: 0,
      carbohidratos: 0,
      grasas: 0,
      fibra: 0,
      azucares: 0,
      sodio: 0,
      agua: 0
    };
  }

  async calcularEstadisticas(): Promise<void> {
    const comidasSemana = await this.CService.obtenerComidasDeLaSemana();
    const comidasMes = await this.CService.obtenerComidasDelMes();
    const aguaSemana = await this.AService.obtenerAguaDeLaSemana();
    const aguaMes = await this.AService.obtenerAguaDelMes();

    for (const comida of comidasSemana) {
      this.resumenSemanal.calorias += comida.totales.calorias;
      this.resumenSemanal.proteina += comida.totales.proteina;
      this.resumenSemanal.carbohidratos += comida.totales.carbohidratos;
      this.resumenSemanal.grasas += comida.totales.grasas;
      this.resumenSemanal.fibra += comida.totales.fibra;
      this.resumenSemanal.azucares += comida.totales.azucares;
      this.resumenSemanal.sodio += comida.totales.sodio;
    }

    for (const entrada of aguaSemana) {
      this.resumenSemanal.agua += entrada.cantidad;
    }

    for (const comida of comidasMes) {
      this.resumenMensual.calorias += comida.totales.calorias;
      this.resumenMensual.proteina += comida.totales.proteina;
      this.resumenMensual.carbohidratos += comida.totales.carbohidratos;
      this.resumenMensual.grasas += comida.totales.grasas;
      this.resumenMensual.fibra += comida.totales.fibra;
      this.resumenMensual.azucares += comida.totales.azucares;
      this.resumenMensual.sodio += comida.totales.sodio;
    }

    for (const entrada of aguaMes) {
      this.resumenMensual.agua += entrada.cantidad;
    }
  }
}
