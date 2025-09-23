import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { Chart, registerables } from 'chart.js';
import { ToastrService } from 'ngx-toastr';
import { BloodStock } from '../../../domain/model/blood-stock';
import { BloodStockReadService } from '../../../services/blood-stock/blood-stock-read.service';
import { BloodStockUpdateService } from '../../../services/blood-stock/blood-stock-update.service';
import { AuthenticationService } from '../../../services/security/authentication.service';
import { StockLimitsDialogComponent, StockLimitsResult } from './stock-limits-dialog.component';
import { Router } from '@angular/router';

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
export class BloodStockComponent implements OnInit, OnDestroy {
  bloodStockData: BloodStock[] = [];
  chart: Chart | null = null;
  locationId: string = '';

  constructor(
    private bloodStockService: BloodStockReadService,
    private bloodStockUpdateService: BloodStockUpdateService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private authenticationService: AuthenticationService,
    private router: Router
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
      if (stock.currentStock <= stock.minimumStock) return '#e53935';
      if (stock.currentStock <= stock.minimumStock * 1.5) return '#fb8c00';
      return '#43a047';
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
            borderWidth: 1,
            borderRadius: 6
          },
          {
            label: 'Estoque Mínimo',
            data: minStock,
            borderColor: '#fbc02d',
            backgroundColor: 'transparent',
            borderWidth: 2,
            borderDash: [6, 6],
            type: 'line',
            pointRadius: 0
          },
          {
            label: 'Estoque Máximo',
            data: maxStock,
            borderColor: '#1e88e5',
            backgroundColor: 'transparent',
            borderWidth: 2,
            borderDash: [6, 6],
            type: 'line',
            pointRadius: 0
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Estoque de Sangue por Tipo Sanguíneo',
            font: {
              size: 18,
              weight: 'bold'
            }
          },
          legend: {
            display: true,
            position: 'top'
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                return `${context.dataset.label}: ${context.formattedValue} ml`;
              }
            }
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

  openStockLimitsDialog() {
    const dialogRef = this.dialog.open(StockLimitsDialogComponent, {
      width: '800px',
      data: { bloodStockList: this.bloodStockData }
    });

    dialogRef.afterClosed().subscribe((result: StockLimitsResult) => {
      if (result && result.updates.length > 0) {
        this.updateStockLimits(result.updates);
      }
    });
  }

  updateStockLimits(updates: any[]) {
    const updatePromises = updates.map(update =>
      this.bloodStockUpdateService.updateStockLimits(update).toPromise()
    );

    Promise.all(updatePromises).then(() => {
      this.toastr.success('Limites de estoque atualizados com sucesso');
      this.loadBloodStock();
    }).catch(() => {
      this.toastr.error('Erro ao atualizar limites de estoque');
    });
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

  navigateToBloodWithdrawal() {
    this.router.navigate(['/blood-withdrawal']);
  }

  navigateToDonationCreate() {
    this.router.navigate(['/donation-create']);
  }

  navigateToReports() {
    this.router.navigate(['/reports']);
  }

  ngOnDestroy() {
    if (this.chart) {
      this.chart.destroy();
    }
  }
  hasAlerts(): boolean {
    return this.bloodStockData.some(stock => stock.currentStock <= stock.minimumStock);
  }

  getCriticalStock(): BloodStock[] {
    return this.bloodStockData.filter(stock => stock.currentStock <= stock.minimumStock);
  }

  getTotalStock(): number {
    return this.bloodStockData.reduce((sum, stock) => sum + stock.currentStock, 0);
  }

  getTotalStockTrend(): string {
    const total = this.getTotalStock();
    const maxTotal = this.bloodStockData.reduce((sum, stock) => sum + stock.maximumStock, 0);

    if (total >= maxTotal * 0.7) return 'positive';
    if (total <= maxTotal * 0.3) return 'negative';
    return 'stable';
  }

  getTotalStockIcon(): string {
    const trend = this.getTotalStockTrend();
    if (trend === 'positive') return 'trending_up';
    if (trend === 'negative') return 'trending_down';
    return 'trending_flat';
  }

  getTotalStockText(): string {
    const trend = this.getTotalStockTrend();
    if (trend === 'positive') return 'Estoque saudável';
    if (trend === 'negative') return 'Estoque baixo';
    return 'Estável';
  }

  getCriticalCount(): number {
    return this.getCriticalStock().length;
  }

  getCriticalTrend(): string {
    const count = this.getCriticalCount();
    if (count === 0) return 'positive';
    if (count <= 2) return 'stable';
    return 'negative';
  }

  getCriticalIcon(): string {
    const trend = this.getCriticalTrend();
    if (trend === 'positive') return 'check_circle';
    if (trend === 'stable') return 'info';
    return 'warning';
  }

  getCriticalText(): string {
    const trend = this.getCriticalTrend();
    if (trend === 'positive') return 'Nenhum crítico';
    if (trend === 'stable') return 'Alguns críticos';
    return 'Muitos críticos';
  }

  getAvailableTypes(): number {
    return this.bloodStockData.filter(stock => stock.currentStock > stock.minimumStock).length;
  }

  getLastUpdateTime(): string {
    const now = new Date();
    return now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }

  getStockPercentage(stock: BloodStock): number {
    if (!stock.maximumStock || stock.maximumStock === 0) return 0;
    return Math.min(100, Math.round((stock.currentStock / stock.maximumStock) * 100));
  }

  getStockStatusText(stock: BloodStock): string {
    if (stock.currentStock <= stock.minimumStock) return 'Crítico';
    if (stock.currentStock <= stock.minimumStock * 1.5) return 'Atenção';
    return 'Normal';
  }

}