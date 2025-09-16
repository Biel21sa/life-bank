import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Chart, registerables } from 'chart.js';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from '../../../services/security/authentication.service';
import { DonationReadService } from '../../../services/donation/donation-read.service';
import { DonationEvolutionData } from '../../../domain/dto/donation-evolution-dto';
import { DonationByBloodTypeData } from '../../../domain/dto/donation-by-blood-type-dto';
import { DonationEvolutionByTypeData } from '../../../domain/dto/donation-evolution-by-blood-type-dto';

Chart.register(...registerables);

@Component({
  selector: 'app-reports',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule
  ],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit, OnDestroy {
  selectedChart: string = 'evolution';
  selectedYear: number = new Date().getFullYear();
  locationId: string = '';
  chart: Chart | null = null;
  availableYears: number[] = [];

  chartOptions = [
    { value: 'evolution', label: 'Evolução de Doações', icon: 'show_chart' },
    { value: 'bloodType', label: 'Doações por Tipo Sanguíneo', icon: 'pie_chart' },
    { value: 'evolutionByType', label: 'Evolução por Tipo Sanguíneo', icon: 'multiline_chart' }
  ];

  constructor(
    private authService: AuthenticationService,
    private donationReadService: DonationReadService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.locationId = this.authService.getDonationLocationId()!;
    this.initializeYears();
    this.loadChart();
  }

  translateMonth(month: string): string {
    const monthTranslations: { [key: string]: string } = {
      'January': 'Janeiro',
      'February': 'Fevereiro',
      'March': 'Março',
      'April': 'Abril',
      'May': 'Maio',
      'June': 'Junho',
      'July': 'Julho',
      'August': 'Agosto',
      'September': 'Setembro',
      'October': 'Outubro',
      'November': 'Novembro',
      'December': 'Dezembro'
    };
    return monthTranslations[month] || month;
  }

  initializeYears() {
    const currentYear = new Date().getFullYear();
    this.availableYears = Array.from({ length: 5 }, (_, i) => currentYear - i);
  }

  onYearChange() {
    this.loadChart();
  }

  onChartChange() {
    this.loadChart();
  }

  loadChart() {
    if (this.selectedChart === 'evolution') {
      this.loadEvolutionChart();
    } else if (this.selectedChart === 'bloodType') {
      this.loadBloodTypeChart();
    } else if (this.selectedChart === 'evolutionByType') {
      this.loadEvolutionByTypeChart();
    }
  }

  loadEvolutionChart() {
    this.donationReadService.getDonationEvolution(this.locationId, this.selectedYear).subscribe({
      next: (data) => this.createEvolutionChart(data),
      error: () => this.toastr.error('Não há dados de evolução')
    });
  }

  loadBloodTypeChart() {
    this.donationReadService.getDonationsByBloodType(this.locationId, this.selectedYear).subscribe({
      next: (data) => this.createBloodTypeChart(data),
      error: () => this.toastr.error('Não há dados por tipo sanguíneo')
    });
  }

  loadEvolutionByTypeChart() {
    this.donationReadService.getDonationEvolutionByType(this.locationId, this.selectedYear).subscribe({
      next: (data) => this.createEvolutionByTypeChart(data),
      error: () => this.toastr.error('Não há evolução por tipo sanguíneo')
    });
  }

  createEvolutionChart(data: DonationEvolutionData[]) {
    if (this.chart) {
      this.chart.destroy();
    }
  
    const ctx = document.getElementById('reportsChart') as HTMLCanvasElement;
  
    // Todos os meses do ano em inglês, para garantir labels completas
    const allMonthsEnglish = ['January', 'February', 'March', 'April', 'May', 'June', 
                              'July', 'August', 'September', 'October', 'November', 'December'];
  
    // Traduzir meses para português para exibir no gráfico
    const allMonths = allMonthsEnglish.map(m => this.translateMonth(m));
  
    // Mapear dados recebidos para o array completo de meses
    const dataPerMonth = allMonthsEnglish.map(monthEng => {
      const monthData = data.find(d => d.month === monthEng);
      return monthData ? monthData.totalLiters : 0;
    });
  
    // Calcular o maior valor para definir max no eixo Y
    const maxValue = Math.max(...dataPerMonth);
    const maxY = maxValue * 1.2;
  
    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: allMonths,
        datasets: [{
          label: 'Litros Doados',
          data: dataPerMonth,
          borderColor: '#1976d2',
          backgroundColor: 'rgba(25, 118, 210, 0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: `Evolução de Doações - ${this.selectedYear}`
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: maxY,
            title: {
              display: true,
              text: 'Quantidade (Litros)'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Mês'
            }
          }
        }
      }
    });
  }
  
  createBloodTypeChart(data: DonationByBloodTypeData[]) {
    if (this.chart) {
      this.chart.destroy();
    }

    const ctx = document.getElementById('reportsChart') as HTMLCanvasElement;

    const colors = ['#1976d2', '#1565c0', '#0d47a1', '#42a5f5', '#64b5f6', '#90caf9', '#bbdefb', '#e3f2fd'];

    this.chart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: data.map(d => d.bloodType),
        datasets: [{
          data: data.map(d => d.totalLiters),
          backgroundColor: colors.slice(0, data.length),
          borderColor: '#ffffff',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: `Doações por Tipo Sanguíneo - ${this.selectedYear}`
          },
          legend: {
            position: 'right'
          }
        }
      }
    });
  }

  getSelectedChartIcon(): string {
    const option = this.chartOptions.find(opt => opt.value === this.selectedChart);
    return option?.icon || 'bar_chart';
  }

  getSelectedChartLabel(): string {
    const option = this.chartOptions.find(opt => opt.value === this.selectedChart);
    return option?.label || 'Gráfico';
  }

  createEvolutionByTypeChart(data: DonationEvolutionByTypeData[]) {
    if (this.chart) {
      this.chart.destroy();
    }
  
    const ctx = document.getElementById('reportsChart') as HTMLCanvasElement;

    const allMonthsEnglish = ['January', 'February', 'March', 'April', 'May', 'June', 
                              'July', 'August', 'September', 'October', 'November', 'December'];

    const allMonths = allMonthsEnglish.map(m => this.translateMonth(m));

    const bloodTypes = [...new Set(data.flatMap(d => d.data.map(item => item.bloodType)))];
    const colors = ['#1976d2', '#1565c0', '#0d47a1', '#42a5f5', '#64b5f6', '#90caf9', '#bbdefb', '#e3f2fd'];

    const datasets = bloodTypes.map((bloodType, index) => ({
      label: bloodType,
      data: allMonthsEnglish.map(monthEng => {
        const monthData = data.find(d => d.month === monthEng);
        const typeData = monthData?.data.find(item => item.bloodType === bloodType);
        return typeData?.totalLiters || 0;
      }),
      backgroundColor: colors[index % colors.length]
    }));
  
    const totalPerMonth = allMonthsEnglish.map(monthEng => {
      const monthData = data.find(d => d.month === monthEng);
      if (!monthData) return 0;
      return monthData.data.reduce((sum, item) => sum + item.totalLiters, 0);
    });

    const maxTotal = Math.max(...totalPerMonth);
  
    const maxY = maxTotal * 1.06;
  
    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: allMonths,
        datasets: datasets
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: `Evolução por Tipo Sanguíneo - ${this.selectedYear}`
          },
          legend: {
            position: 'top'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: maxY,
            title: {
              display: true,
              text: 'Quantidade (Litros)'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Mês'
            },
            stacked: false
          }
        }
      }
    });
  }  

  ngOnDestroy() {
    if (this.chart) {
      this.chart.destroy();
    }
  }
}