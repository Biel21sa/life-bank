import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';

import { BloodStock } from '../../../domain/model/blood-stock';

export interface StockLimitsData {
  bloodStockList: BloodStock[];
}

export interface StockLimitsResult {
  updates: {
    id: number;
    minimumStock: number;
    maximumStock: number;
  }[];
}

@Component({
  selector: 'app-stock-limits-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatIconModule
  ],
  template: `
    <h2 mat-dialog-title>
      <mat-icon>tune</mat-icon>
      Atualizar Limites de Estoque
    </h2>
    
    <mat-dialog-content>
      <form [formGroup]="limitsForm">
        <div class="blood-types-list">
          <div class="blood-type-item" *ngFor="let stock of data.bloodStockList">
            <mat-checkbox 
              [checked]="selectedStocks.has(stock.id!)"
              (change)="toggleStock(stock, $event.checked)">
              <span class="blood-type">{{stock.bloodType}}</span>
              <span class="current-stock">(Atual: {{stock.currentStock}} ml)</span>
            </mat-checkbox>
            
            <div class="limits-inputs" *ngIf="selectedStocks.has(stock.id!)">
              <mat-form-field appearance="outline">
                <mat-label>Mínimo</mat-label>
                <input matInput type="number" 
                       [value]="getLimitValue(stock.id!, 'min')"
                       (input)="updateLimit(stock.id!, 'min', $event)">
              </mat-form-field>
              
              <mat-form-field appearance="outline">
                <mat-label>Máximo</mat-label>
                <input matInput type="number"
                       [value]="getLimitValue(stock.id!, 'max')"
                       (input)="updateLimit(stock.id!, 'max', $event)">
              </mat-form-field>
            </div>
          </div>
        </div>
      </form>
    </mat-dialog-content>
    
    <mat-dialog-actions>
      <button mat-button (click)="onCancel()">Cancelar</button>
      <button mat-raised-button color="primary" 
              [disabled]="selectedStocks.size === 0"
              (click)="onSave()">
        Salvar Alterações
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    h2[mat-dialog-title] {
      background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
      color: white;
      margin: -24px -24px 24px -24px;
      padding: 1.5rem 2rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 1.4rem;
      font-weight: 500;
    }
    
    mat-dialog-content {
      padding: 0;
      overflow: hidden;
    }
    
    .blood-types-list {
      max-height: 350px;
      overflow-y: auto;
      overflow-x: hidden;
      padding: 0 24px;
    }
    
    .blood-type-item {
      background: white;
      border: 1px solid #e3f2fd;
      border-radius: 12px;
      margin-bottom: 1rem;
      padding: 1.5rem;
      box-shadow: 0 2px 8px rgba(25, 118, 210, 0.1);
      transition: all 0.3s ease;
    }
    
    .blood-type-item:hover {
      border-color: #1976d2;
      box-shadow: 0 4px 16px rgba(25, 118, 210, 0.15);
    }
    
    .blood-type {
      font-weight: 600;
      color: #1976d2;
      font-size: 1.1rem;
    }
    
    .current-stock {
      color: #666;
      font-size: 0.9rem;
      margin-left: 0.5rem;
      background: #f8faff;
      padding: 2px 8px;
      border-radius: 12px;
    }
    
    .limits-inputs {
      display: flex;
      gap: 1rem;
      margin-top: 1.5rem;
      padding: 1rem;
      background: #f8faff;
      border-radius: 8px;
      border: 1px solid #e3f2fd;
      min-width: 0;
    }
    
    .limits-inputs mat-form-field {
      flex: 1;
      min-width: 0;
    }
    
    mat-dialog-actions {
      background: #f8faff;
      margin: 24px -24px -24px -24px;
      padding: 1.5rem 2rem;
      border-top: 1px solid #e3f2fd;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    mat-dialog-actions button {
      border-radius: 8px;
      font-weight: 500;
      padding: 12px 24px;
      text-transform: none;
    }
    
    mat-dialog-actions button[mat-button] {
      color: #1976d2;
    }
    
    mat-dialog-actions button[mat-raised-button] {
      background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
      box-shadow: 0 4px 12px rgba(25, 118, 210, 0.3);
    }
    
    mat-dialog-actions button[mat-raised-button]:hover:not(:disabled) {
      box-shadow: 0 6px 16px rgba(25, 118, 210, 0.4);
      transform: translateY(-2px);
    }
    
    mat-checkbox {
      margin-bottom: 0.5rem;
    }
    
    mat-checkbox .mdc-checkbox {
      --mdc-checkbox-selected-checkmark-color: white;
      --mdc-checkbox-selected-focus-icon-color: #1976d2;
      --mdc-checkbox-selected-hover-icon-color: #1976d2;
      --mdc-checkbox-selected-icon-color: #1976d2;
      --mdc-checkbox-selected-pressed-icon-color: #1976d2;
    }
  `]
})
export class StockLimitsDialogComponent {
  limitsForm: FormGroup;
  selectedStocks = new Set<number>();
  limitsData = new Map<number, { min: number, max: number }>();

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<StockLimitsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: StockLimitsData
  ) {
    this.limitsForm = this.fb.group({});

    // Inicializar com valores atuais
    this.data.bloodStockList.forEach(stock => {
      this.limitsData.set(stock.id!, {
        min: stock.minimumStock,
        max: stock.maximumStock
      });
    });
  }

  toggleStock(stock: BloodStock, checked: boolean) {
    if (checked) {
      this.selectedStocks.add(stock.id!);
    } else {
      this.selectedStocks.delete(stock.id!);
    }
  }

  getLimitValue(stockId: number, type: 'min' | 'max'): number {
    const limits = this.limitsData.get(stockId);
    return type === 'min' ? limits?.min || 0 : limits?.max || 0;
  }

  updateLimit(stockId: number, type: 'min' | 'max', event: any) {
    const value = parseInt(event.target.value) || 0;
    const currentLimits = this.limitsData.get(stockId) || { min: 0, max: 0 };

    if (type === 'min') {
      currentLimits.min = value;
    } else {
      currentLimits.max = value;
    }

    this.limitsData.set(stockId, currentLimits);
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSave() {
    const updates = Array.from(this.selectedStocks).map(stockId => {
      const limits = this.limitsData.get(stockId)!;
      return {
        id: stockId,
        minimumStock: limits.min,
        maximumStock: limits.max
      };
    });

    this.dialogRef.close({ updates });
  }
}