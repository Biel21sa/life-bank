import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { Chart, registerables } from 'chart.js';
import { ToastrService } from 'ngx-toastr';

import { BloodStock } from '../../../domain/model/blood-stock';
import { BloodStockReadService } from '../../../services/blood-stock/blood-stock-read.service';
import { AuthenticationService } from '../../../services/security/authentication.service';

Chart.register(...registerables);

@Component({
  selector: 'app-blood-stock',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule
  ],
  templateUrl: './blood-stock.component.html',
  styleUrls: ['./blood-stock.component.css']
})
export class BloodStockComponent implements OnInit {
  bloodStockData: BloodStock[] = [];
  chart: Chart | null = null;
  locationId: string = '';

  constructor(
    private bloodStockService: BloodStockReadService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit() {
    this.locationId = this.getUserLocationFromCache();
    this.loadBloodStock();
  }

  getUserLocationFromCache(): string {
    return this.authenticationService.getDonationLocationId()!;
  }

  loadBloodStock() {
    this.bloodStockService.getStockByLocationId(this.locationId).subscribe({
      next: (data) => {
        this.bloodStockData = data;
        this.createChart();
      },
      error: () => this.toastr.error('Erro ao carregar dados do estoque')
    });
  }

  createChart() {
    if (this.chart) {
      this.chart.destroy();
    }

    const ctx = document.getElementById('stockChart') as HTMLCanvasElement;

    const labels = this.bloodStockData.map(stock => stock.bloodType);
    const currentStock = this.bloodStockData.map(stock => stock.currentStock);
    const minStock = this.bloodStockData.map(stock => stock.minimumStock);
    const maxStock = this.bloodStockData.map(stock => stock.maximumStock);

    const backgroundColors = this.bloodStockData.map(stock => {
      if (stock.currentStock <= stock.minimumStock) return '#f44336'; // Crítico - Vermelho
      if (stock.currentStock <= stock.minimumStock * 1.5) return '#ff9800'; // Alerta - Laranja
      return '#4caf50'; // Normal - Verde
    });

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Estoque Atual',
            data: currentStock,
            backgroundColor: backgroundColors,
            borderColor: backgroundColors,
            borderWidth: 1
          },
          {
            label: 'Estoque Mínimo',
            data: minStock,
            backgroundColor: 'rgba(255, 193, 7, 0.3)',
            borderColor: '#ffc107',
            borderWidth: 2,
            type: 'line'
          },
          {
            label: 'Estoque Máximo',
            data: maxStock,
            backgroundColor: 'rgba(33, 150, 243, 0.3)',
            borderColor: '#2196f3',
            borderWidth: 2,
            type: 'line'
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Estoque de Sangue por Tipo Sanguíneo'
          },
          legend: {
            display: true,
            position: 'top'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Quantidade (ml)'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Tipo Sanguíneo'
            }
          }
        }
      }
    });
  }

  openMinStockDialog() {
    // TODO: Implementar dialog para atualizar estoque mínimo
    this.toastr.info('Funcionalidade em desenvolvimento');
  }

  openMaxStockDialog() {
    // TODO: Implementar dialog para atualizar estoque máximo
    this.toastr.info('Funcionalidade em desenvolvimento');
  }

  getStockStatusClass(stock: BloodStock): string {
    if (stock.currentStock <= stock.minimumStock) return 'status-critical';
    if (stock.currentStock <= stock.minimumStock * 1.5) return 'status-warning';
    return 'status-normal';
  }

  getStockStatusIcon(stock: BloodStock): string {
    if (stock.currentStock <= stock.minimumStock) return 'warning';
    if (stock.currentStock <= stock.minimumStock * 1.5) return 'info';
    return 'check_circle';
  }

  ngOnDestroy() {
    if (this.chart) {
      this.chart.destroy();
    }
  }
}