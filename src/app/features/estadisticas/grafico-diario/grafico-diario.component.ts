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

  idUsuario:any
  ngOnInit(): void {
    this.idUsuario = sessionStorage.getItem('userId');
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
    try {
      const comidasSemana = await this.CService.obtenerComidasDeLaSemana(parseInt(this.idUsuario));
      const comidasMes = await this.CService.obtenerComidasDelMes(parseInt(this.idUsuario));
      const aguaSemana = await this.AService.obtenerAguaDeLaSemana(parseInt(this.idUsuario));
      const aguaMes = await this.AService.obtenerAguaDelMes(parseInt(this.idUsuario));
  
      let semanaLabels: string[] = [];
      let semanaData: any[] = [];
      
      for (let i = 0; i < 7; i++) {
        let totalDia = this.resetResumen();
        const comidasDia = comidasSemana.filter((comida) => this.esMismoDiaSemana(comida.fecha, i));
        const aguaDia = aguaSemana.filter((agua) => this.esMismoDiaSemana(agua.fecha, i));
  
        comidasDia.forEach((comida) => {
            totalDia.calorias += comida.calorias || 0;
            totalDia.proteina += comida.proteina || 0;
            totalDia.carbohidratos += comida.carbohidratos || 0;
            totalDia.grasas += comida.grasas || 0;
            totalDia.fibra += comida.fibra || 0;
            totalDia.azucares += comida.azucares || 0;
            totalDia.sodio += comida.sodio || 0;
        });
  
        aguaDia.forEach((entrada) => {
          totalDia.agua += entrada.cantidad || 0;
        });
  
        semanaLabels.push(`Día ${i + 1}`);
        semanaData.push(totalDia);
      }
  
      let mesLabels: string[] = [];
      let mesData: any[] = [];
  
      for (let i = 1; i <= 30; i++) {
        let totalDia = this.resetResumen();
        const comidasDia = comidasMes.filter((comida) => this.esMismoDiaMes(comida.fecha, i));
        const aguaDia = aguaMes.filter((agua) => this.esMismoDiaMes(agua.fecha, i));
  
        comidasDia.forEach((comida) => {
            totalDia.calorias += comida.calorias || 0;
            totalDia.proteina += comida.proteina || 0;
            totalDia.carbohidratos += comida.carbohidratos || 0;
            totalDia.grasas += comida.grasas || 0;
            totalDia.fibra += comida.fibra || 0;
            totalDia.azucares += comida.azucares || 0;
            totalDia.sodio += comida.sodio || 0;
        });
  
        aguaDia.forEach((entrada) => {
          totalDia.agua += entrada.cantidad || 0;
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
    } catch (error) {
      console.error('Error al calcular estadísticas:', error);
      this.toast.error('Ocurrió un error al cargar las estadísticas');
    }
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

