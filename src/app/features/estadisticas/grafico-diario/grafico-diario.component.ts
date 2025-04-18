import { Component, OnInit } from '@angular/core';
import { ComidaServiceService } from '../../../services/comida-service.service';
import { AguaServiceService } from '../../../services/agua-service.service';
import { ToastrService } from 'ngx-toastr';
import { BaseChartDirective } from 'ng2-charts';
import { ChartOptions, ChartData } from 'chart.js';

@Component({
  selector: 'app-grafico-diario',
  standalone: true,
  imports: [BaseChartDirective],
  templateUrl: './grafico-diario.component.html',
  styleUrl: './grafico-diario.component.css'
})
export class GraficoDiarioComponent implements OnInit {

  public barChartOptionsSemana: ChartOptions = {
    responsive: true,
    indexAxis: 'y',
    scales: {
      x: {
        beginAtZero: true
      }
    }
  };

  public barChartLabelsSemana: string[] = [];
  public barChartDataSemana: ChartData<'bar'> = {
    labels: this.barChartLabelsSemana,
    datasets: [
      { data: [], label: 'Semana' }
    ]
  };

  public barChartOptionsMes: ChartOptions = {
    responsive: true,
    indexAxis: 'y',
    scales: {
      x: {
        beginAtZero: true
      }
    }
  };

  public barChartLabelsMes: string[] = [];
  public barChartDataMes: ChartData<'bar'> = {
    labels: this.barChartLabelsMes,
    datasets: [
      { data: [], label: 'Mes' }
    ]
  };

  constructor(
    private CService: ComidaServiceService,
    private AService: AguaServiceService,
    private toast: ToastrService
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

    let semanaLabels: string[] = [];
    let semanaData: any[] = [];
    for (let i = 0; i < 7; i++) {
      let totalDia = this.resetResumen();
      const comidasDia = comidasSemana.filter((comida) => this.esMismoDiaSemana(comida.fecha, i));
      const aguaDia = aguaSemana.filter((agua) => this.esMismoDiaSemana(agua.Fecha, i));
      comidasDia.forEach((comida) => {
        totalDia.calorias += comida.totales.calorias;
        totalDia.proteina += comida.totales.proteina;
        totalDia.carbohidratos += comida.totales.carbohidratos;
        totalDia.grasas += comida.totales.grasas;
        totalDia.fibra += comida.totales.fibra;
        totalDia.azucares += comida.totales.azucares;
        totalDia.sodio += comida.totales.sodio;
      });
      aguaDia.forEach((entrada) => {
        totalDia.agua += entrada.cantidad;
      });
      semanaLabels.push(`Día ${i + 1}`);
      semanaData.push(totalDia);
    }

    let mesLabels: string[] = [];
    let mesData: any[] = [];
    for (let i = 1; i <= 30; i++) {
      let totalDia = this.resetResumen();
      const comidasDia = comidasMes.filter((comida) => this.esMismoDiaMes(comida.fecha, i));
      const aguaDia = aguaMes.filter((agua) => this.esMismoDiaMes(agua.Fecha, i));

      comidasDia.forEach((comida) => {
        totalDia.calorias += comida.totales.calorias;
        totalDia.proteina += comida.totales.proteina;
        totalDia.carbohidratos += comida.totales.carbohidratos;
        totalDia.grasas += comida.totales.grasas;
        totalDia.fibra += comida.totales.fibra;
        totalDia.azucares += comida.totales.azucares;
        totalDia.sodio += comida.totales.sodio;
      });

      aguaDia.forEach((entrada) => {
        totalDia.agua += entrada.cantidad;
      });
      mesLabels.push(`Día ${i}`);
      mesData.push(totalDia);
    }

    this.barChartLabelsSemana = semanaLabels;
    this.barChartLabelsMes = mesLabels;

    this.barChartDataSemana = {
      labels: semanaLabels,
      datasets: [
        { data: semanaData.map(d => d.calorias), label: 'Calorías', backgroundColor: '#e74c3c' },
        { data: semanaData.map(d => d.proteina), label: 'Proteína', backgroundColor: '#27ae60' },
        { data: semanaData.map(d => d.carbohidratos), label: 'Carbohidratos', backgroundColor: '#dd9117' },
        { data: semanaData.map(d => d.grasas), label: 'Grasas', backgroundColor: '#f1c40f' },
        { data: semanaData.map(d => d.fibra), label: 'Fibra', backgroundColor: '#907122' },
        { data: semanaData.map(d => d.azucares), label: 'Azúcares', backgroundColor: '#a73185' },
        { data: semanaData.map(d => d.sodio), label: 'Sodio', backgroundColor: '#299680' },
        { data: semanaData.map(d => d.agua), label: 'Agua (ml)', backgroundColor: '#1749d2' },
      ]
    };

    this.barChartDataMes = {
      labels: mesLabels,
      datasets: [
        { data: mesData.map(d => d.calorias), label: 'Calorías', backgroundColor: '#e74c3c' },
        { data: mesData.map(d => d.proteina), label: 'Proteína', backgroundColor: '#27ae60' },
        { data: mesData.map(d => d.carbohidratos), label: 'Carbohidratos', backgroundColor: '#dd9117' },
        { data: mesData.map(d => d.grasas), label: 'Grasas', backgroundColor: '#f1c40f' },
        { data: mesData.map(d => d.fibra), label: 'Fibra', backgroundColor: '#907122' },
        { data: mesData.map(d => d.azucares), label: 'Azúcares', backgroundColor: '#a73185' },
        { data: mesData.map(d => d.sodio), label: 'Sodio', backgroundColor: '#299680' },
        { data: mesData.map(d => d.agua), label: 'Agua (ml)', backgroundColor: '#1749d2' },
      ]
    };
  }

  esMismoDiaSemana(fecha: string, diaSemana: number): boolean {
    const fechaObjeto = new Date(fecha);
    return fechaObjeto.getDay() === diaSemana;
  }

  esMismoDiaMes(fecha: string, diaMes: number): boolean {
    const fechaObjeto = new Date(fecha);
    return fechaObjeto.getDate() === diaMes;
  }
}

