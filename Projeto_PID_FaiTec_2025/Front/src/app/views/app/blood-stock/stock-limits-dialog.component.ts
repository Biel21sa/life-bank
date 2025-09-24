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
    <div class="dialog-container">
      <!-- Header -->
      <div class="dialog-header">
        <div class="header-icon">
          <mat-icon>tune</mat-icon>
        </div>
        <div class="header-content">
          <h2>Configurar Limites de Estoque</h2>
          <p>Ajuste os níveis mínimos e máximos para cada tipo sanguíneo</p>
        </div>
        <button mat-icon-button class="close-button" (click)="onCancel()">
          <mat-icon>close</mat-icon>
        </button>
      </div>
      
      <!-- Content -->
      <div class="dialog-content">
        <div class="selection-summary" *ngIf="selectedStocks.size > 0">
          <div class="summary-icon">
            <mat-icon>check_circle</mat-icon>
          </div>
          <div class="summary-text">
            <span class="summary-count">{{selectedStocks.size}}</span>
            <span class="summary-label">tipo(s) selecionado(s) para atualização</span>
          </div>
        </div>
        
        <div class="instruction-text" *ngIf="selectedStocks.size === 0">
          <mat-icon>info</mat-icon>
          <span>Selecione os tipos sanguíneos que deseja configurar</span>
        </div>
        
        <form [formGroup]="limitsForm">
          <div class="blood-types-list">
            <div class="blood-type-item" 
                 *ngFor="let stock of data.bloodStockList; let i = index"
                 [class.selected]="selectedStocks.has(stock.id!)"
                 [style.animation-delay.ms]="i * 100">
              
              <!-- Selection Header -->
              <div class="item-header">
                <mat-checkbox 
                  [checked]="selectedStocks.has(stock.id!)"
                  (change)="toggleStock(stock, $event.checked)"
                  class="selection-checkbox">
                </mat-checkbox>
                
                <div class="blood-type-info">
                  <div class="blood-type-display">
                    <div class="blood-type-icon">
                      <mat-icon>bloodtype</mat-icon>
                    </div>
                    <div class="blood-type-details">
                      <span class="blood-type-label">{{stock.bloodType}}</span>
                      <span class="current-stock">Estoque atual: {{stock.currentStock}}L</span>
                    </div>
                  </div>
                  
                  <div class="current-limits">
                    <div class="limit-item">
                      <mat-icon>trending_down</mat-icon>
                      <span>Min: {{stock.minimumStock}}L</span>
                    </div>
                    <div class="limit-item">
                      <mat-icon>trending_up</mat-icon>
                      <span>Max: {{stock.maximumStock}}L</span>
                    </div>
                  </div>
                </div>
                
                <div class="status-indicator" [ngClass]="getStockStatus(stock)">
                  <mat-icon>{{getStockStatusIcon(stock)}}</mat-icon>
                </div>
              </div>
              
              <!-- Configuration Panel -->
              <div class="limits-panel" *ngIf="selectedStocks.has(stock.id!)">
                <div class="panel-header">
                  <mat-icon>settings</mat-icon>
                  <span>Configurar Limites</span>
                </div>
                
                <div class="limits-inputs">
                  <div class="input-group">
                    <mat-form-field appearance="outline" class="limit-field">
                      <mat-label>Estoque Mínimo</mat-label>
                      <input matInput type="number" 
                             min="0"
                             [value]="getLimitValue(stock.id!, 'min')"
                             (input)="updateLimit(stock.id!, 'min', $event)"
                             placeholder="0">
                      <span matSuffix>L</span>
                      <mat-icon matPrefix>trending_down</mat-icon>
                      <mat-hint>Nível crítico para alertas</mat-hint>
                    </mat-form-field>
                    
                    <mat-form-field appearance="outline" class="limit-field">
                      <mat-label>Estoque Máximo</mat-label>
                      <input matInput type="number"
                             min="0"
                             [value]="getLimitValue(stock.id!, 'max')"
                             (input)="updateLimit(stock.id!, 'max', $event)"
                             placeholder="0">
                      <span matSuffix>L</span>
                      <mat-icon matPrefix>trending_up</mat-icon>
                      <mat-hint>Capacidade máxima de armazenamento</mat-hint>
                    </mat-form-field>
                  </div>
                  
                  <!-- Validation Messages -->
                  <div class="validation-messages" *ngIf="hasValidationErrors(stock.id!)">
                    <div class="validation-error" *ngIf="getLimitValue(stock.id!, 'min') >= getLimitValue(stock.id!, 'max')">
                      <mat-icon>error</mat-icon>
                      <span>O limite mínimo deve ser menor que o máximo</span>
                    </div>
                    <div class="validation-warning" *ngIf="getLimitValue(stock.id!, 'min') > stock.currentStock">
                      <mat-icon>warning</mat-icon>
                      <span>Limite mínimo maior que estoque atual</span>
                    </div>
                  </div>
                  
                  <!-- Preview -->
                  <div class="limits-preview" *ngIf="!hasValidationErrors(stock.id!)">
                    <div class="preview-header">
                      <mat-icon>preview</mat-icon>
                      <span>Visualização</span>
                    </div>
                    <div class="preview-bar">
                      <div class="bar-container">
                        <div class="bar-fill" 
                             [style.width.%]="getPreviewPercentage(stock.id!, stock.currentStock)"
                             [ngClass]="getPreviewStatus(stock.id!, stock.currentStock)">
                        </div>
                        <div class="bar-markers">
                          <div class="marker min-marker" 
                               [style.left.%]="getPreviewPercentage(stock.id!, getLimitValue(stock.id!, 'min'))">
                            <span>Min</span>
                          </div>
                          <div class="marker current-marker" 
                               [style.left.%]="getPreviewPercentage(stock.id!, stock.currentStock)">
                            <span>Atual</span>
                          </div>
                        </div>
                      </div>
                      <div class="bar-labels">
                        <span>0L</span>
                        <span>{{getLimitValue(stock.id!, 'max')}}L</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
      
      <!-- Actions -->
      <div class="dialog-actions">
        <div class="actions-left">
          <button mat-stroked-button class="secondary-button" (click)="selectAll()">
            <mat-icon>select_all</mat-icon>
            <span>Selecionar Todos</span>
          </button>
          <button mat-stroked-button class="secondary-button" (click)="clearSelection()">
            <mat-icon>clear</mat-icon>
            <span>Limpar Seleção</span>
          </button>
        </div>
        
        <div class="actions-right">
          <button mat-stroked-button class="cancel-button" (click)="onCancel()">
            <mat-icon>close</mat-icon>
            <span>Cancelar</span>
          </button>
          <button mat-raised-button color="primary" 
                  class="save-button"
                  [disabled]="!canSave()"
                  (click)="onSave()">
            <mat-icon>save</mat-icon>
            <span>Salvar Alterações</span>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dialog-container {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      max-width: 800px;
      width: 100%;
      background: white;
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 24px 64px rgba(25, 118, 210, 0.2);
      animation: dialogEnter 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    @keyframes dialogEnter {
      from {
        opacity: 0;
        transform: scale(0.9) translateY(40px);
      }
      to {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
    }
    
    /* Header */
    .dialog-header {
      background: linear-gradient(135deg, #0d47a1 0%, #1565c0 50%, #1976d2 100%);
      color: white;
      padding: 32px;
      display: flex;
      align-items: center;
      gap: 20px;
      position: relative;
      overflow: hidden;
    }
    
    .dialog-header::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
      opacity: 0.3;
    }
    
    .header-icon {
      width: 64px;
      height: 64px;
      border-radius: 16px;
      background: rgba(255, 255, 255, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      backdrop-filter: blur(20px);
      border: 2px solid rgba(255, 255, 255, 0.3);
      flex-shrink: 0;
      z-index: 1;
    }
    
    .header-icon mat-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
    }
    
    .header-content {
      flex: 1;
      z-index: 1;
    }
    
    .header-content h2 {
      font-size: 1.8rem;
      font-weight: 600;
      margin: 0 0 8px 0;
      letter-spacing: -0.01em;
    }
    
    .header-content p {
      font-size: 1rem;
      opacity: 0.9;
      margin: 0;
      font-weight: 400;
    }
    
    .close-button {
      background: rgba(255, 255, 255, 0.1);
      color: white;
      border-radius: 50%;
      z-index: 1;
      transition: all 0.3s ease;
    }
    
    .close-button:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: scale(1.1);
    }
    
    /* Content */
    .dialog-content {
      padding: 32px;
      max-height: 500px;
      overflow-y: auto;
      overflow-x: hidden;
    }
    
    .selection-summary {
      background: linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%);
      border: 1px solid rgba(46, 125, 50, 0.2);
      border-radius: 16px;
      padding: 20px;
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 24px;
      animation: fadeIn 0.3s ease-out;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .summary-icon {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: linear-gradient(135deg, #2e7d32 0%, #4caf50 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      flex-shrink: 0;
    }
    
    .summary-icon mat-icon {
      font-size: 24px;
      width: 24px;
      height: 24px;
    }
    
    .summary-count {
      font-size: 1.5rem;
      font-weight: 700;
      color: #2e7d32;
      margin-right: 8px;
    }
    
    .summary-label {
      color: #2e7d32;
      font-weight: 500;
    }
    
    .instruction-text {
      background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
      border: 1px solid rgba(25, 118, 210, 0.2);
      border-radius: 16px;
      padding: 20px;
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 24px;
      color: #1976d2;
      font-weight: 500;
    }
    
    .instruction-text mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }
    
    /* Blood Types List */
    .blood-types-list {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    
    .blood-type-item {
      background: white;
      border: 2px solid #f0f4f8;
      border-radius: 20px;
      padding: 24px;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      animation: slideInUp 0.6s ease-out both;
      position: relative;
      overflow: hidden;
    }
    
    @keyframes slideInUp {
      from {
        opacity: 0;
        transform: translateY(40px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .blood-type-item::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(135deg, #1976d2 0%, #42a5f5 100%);
      transform: scaleX(0);
      transition: transform 0.3s ease;
    }
    
    .blood-type-item:hover::before,
    .blood-type-item.selected::before {
      transform: scaleX(1);
    }
    
    .blood-type-item:hover {
      border-color: rgba(25, 118, 210, 0.3);
      box-shadow: 0 8px 32px rgba(25, 118, 210, 0.15);
      transform: translateY(-4px);
    }
    
    .blood-type-item.selected {
      border-color: #1976d2;
      background: linear-gradient(135deg, #f8faff 0%, #e3f2fd 100%);
      box-shadow: 0 12px 40px rgba(25, 118, 210, 0.2);
    }
    
    /* Item Header */
    .item-header {
      display: flex;
      align-items: center;
      gap: 20px;
      margin-bottom: 16px;
    }
    
    .selection-checkbox {
      flex-shrink: 0;
    }
    
    .blood-type-info {
      flex: 1;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 20px;
    }
    
    .blood-type-display {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    
    .blood-type-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #1976d2;
    }
    
    .blood-type-icon mat-icon {
      font-size: 24px;
      width: 24px;
      height: 24px;
    }
    
    .blood-type-details {
      display: flex;
      flex-direction: column;
    }
    
    .blood-type-label {
      font-size: 1.4rem;
      font-weight: 700;
      color: #1a1a1a;
      letter-spacing: -0.01em;
    }
    
    .current-stock {
      font-size: 0.9rem;
      color: #666;
      font-weight: 500;
    }
    
    .current-limits {
      display: flex;
      gap: 16px;
    }
    
    .limit-item {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 0.85rem;
      color: #666;
      background: rgba(25, 118, 210, 0.1);
      padding: 6px 12px;
      border-radius: 12px;
    }
    
    .limit-item mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
      color: #1976d2;
    }
    
    .status-indicator {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      flex-shrink: 0;
    }
    
    .status-indicator.normal {
      background: linear-gradient(135deg, #2e7d32 0%, #4caf50 100%);
    }
    
    .status-indicator.warning {
      background: linear-gradient(135deg, #f57c00 0%, #ff9800 100%);
    }
    
    .status-indicator.critical {
      background: linear-gradient(135deg, #d32f2f 0%, #f44336 100%);
    }
    
    .status-indicator mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }
    
    /* Limits Panel */
    .limits-panel {
      background: rgba(25, 118, 210, 0.05);
      border: 1px solid rgba(25, 118, 210, 0.1);
      border-radius: 16px;
      padding: 24px;
      margin-top: 16px;
      animation: expandPanel 0.3s ease-out;
    }
    
    @keyframes expandPanel {
      from {
        opacity: 0;
        max-height: 0;
        padding-top: 0;
        padding-bottom: 0;
      }
      to {
        opacity: 1;
        max-height: 500px;
        padding-top: 24px;
        padding-bottom: 24px;
      }
    }
    
    .panel-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 20px;
      color: #1976d2;
      font-weight: 600;
      font-size: 0.95rem;
    }
    
    .panel-header mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }
    
    .limits-inputs {
      margin-bottom: 20px;
    }
    
    .input-group {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 16px;
    }
    
    .limit-field {
      width: 100%;
    }
    
    .limit-field ::ng-deep .mat-mdc-form-field-outline {
      border-radius: 12px;
      border-color: rgba(25, 118, 210, 0.2);
    }
    
    .limit-field ::ng-deep .mat-mdc-form-field-outline-thick {
      border-color: #1976d2;
      border-width: 2px;
    }
    
    .limit-field ::ng-deep .mat-mdc-form-field-label {
      color: #666;
      font-weight: 500;
      font-family: 'Inter', sans-serif;
    }
    
    .limit-field ::ng-deep .mat-mdc-form-field.mat-focused .mat-mdc-form-field-label {
      color: #1976d2;
    }
    
    .limit-field ::ng-deep .mat-mdc-input-element {
      color: #1a1a1a;
      font-weight: 500;
      font-family: 'Inter', sans-serif;
    }
    
    .limit-field ::ng-deep .mat-mdc-form-field-icon-prefix,
    .limit-field ::ng-deep .mat-mdc-form-field-icon-suffix {
      color: #1976d2;
    }
    
    /* Validation Messages */
    .validation-messages {
      margin-bottom: 16px;
    }
    
    .validation-error,
    .validation-warning {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 16px;
      border-radius: 8px;
      font-size: 0.85rem;
      font-weight: 500;
      margin-bottom: 8px;
    }
    
    .validation-error {
      background: linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%);
      color: #d32f2f;
      border: 1px solid rgba(211, 47, 47, 0.2);
    }
    
    .validation-warning {
      background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
      color: #f57c00;
      border: 1px solid rgba(245, 124, 0, 0.2);
    }
    
    .validation-error mat-icon,
    .validation-warning mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }
    
    /* Preview */
    .limits-preview {
      background: white;
      border: 1px solid rgba(25, 118, 210, 0.1);
      border-radius: 12px;
      padding: 16px;
    }
    
    .preview-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 16px;
      color: #1976d2;
      font-weight: 600;
      font-size: 0.9rem;
    }
    
    .preview-header mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }
    
    .preview-bar {
      margin-bottom: 12px;
    }
    
    .bar-container {
      position: relative;
      width: 100%;
      height: 12px;
      background: #f0f0f0;
      border-radius: 6px;
      overflow: hidden;
      margin-bottom: 8px;
    }
    
    .bar-fill {
      height: 100%;
      transition: all 0.4s ease;
      border-radius: 6px;
    }
    
    .bar-fill.normal {
      background: linear-gradient(135deg, #2e7d32 0%, #4caf50 100%);
    }
    
    .bar-fill.warning {
      background: linear-gradient(135deg, #f57c00 0%, #ff9800 100%);
    }
    
    .bar-fill.critical {
      background: linear-gradient(135deg, #d32f2f 0%, #f44336 100%);
    }
    
    .bar-markers {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }
    
    .marker {
      position: absolute;
      top: -20px;
      transform: translateX(-50%);
      font-size: 0.7rem;
      color: #666;
      font-weight: 600;
    }
    
    .marker::after {
      content: '';
      position: absolute;
      top: 16px;
      left: 50%;
      transform: translateX(-50%);
      width: 2px;
      height: 12px;
      background: #666;
    }
    
    .min-marker {
      color: #f57c00;
    }
    
    .min-marker::after {
      background: #f57c00;
    }
    
    .current-marker {
      color: #1976d2;
    }
    
    .current-marker::after {
      background: #1976d2;
    }
    
    .bar-labels {
      display: flex;
      justify-content: space-between;
      font-size: 0.8rem;
      color: #999;
    }
    
    /* Actions */
    .dialog-actions {
      background: linear-gradient(135deg, #f8faff 0%, #e3f2fd 100%);
      padding: 24px 32px;
      border-top: 1px solid rgba(25, 118, 210, 0.1);
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
    }
    
    .actions-left,
    .actions-right {
      display: flex;
      gap: 12px;
    }
    
    .secondary-button,
    .cancel-button,
    .save-button {
      height: 48px;
      padding: 0 24px;
      border-radius: 24px;
      font-weight: 600;
      font-size: 0.95rem;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.3s ease;
      font-family: 'Inter', sans-serif;
      text-transform: none;
    }
    
    .secondary-button {
      background: transparent;
      color: #666;
      border: 2px solid rgba(25, 118, 210, 0.2);
    }
    
    .secondary-button:hover {
      background: rgba(25, 118, 210, 0.05);
      color: #1976d2;
      border-color: rgba(25, 118, 210, 0.3);
      transform: translateY(-1px);
    }
    
    .cancel-button {
      background: transparent;
      color: #666;
      border: 2px solid rgba(102, 102, 102, 0.2);
    }
    
    .cancel-button:hover {
      background: rgba(102, 102, 102, 0.05);
      color: #333;
      border-color: rgba(102, 102, 102, 0.3);
      transform: translateY(-1px);
    }
    
    .save-button {
      background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
      color: white;
      box-shadow: 0 4px 16px rgba(25, 118, 210, 0.3);
    }
    
    .save-button:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(25, 118, 210, 0.4);
    }
    
    .save-button:disabled {
      background: #ccc;
      color: #999;
      box-shadow: none;
      transform: none;
      cursor: not-allowed;
    }
    
    /* Checkbox Styling */
    ::ng-deep .mat-mdc-checkbox .mdc-checkbox {
      --mdc-checkbox-selected-checkmark-color: white;
      --mdc-checkbox-selected-focus-icon-color: #1976d2;
      --mdc-checkbox-selected-hover-icon-color: #1976d2;
      --mdc-checkbox-selected-icon-color: #1976d2;
      --mdc-checkbox-selected-pressed-icon-color: #1976d2;
    }
    
    /* Scrollbar Styling */
    .dialog-content::-webkit-scrollbar {
      width: 8px;
    }
    
    .dialog-content::-webkit-scrollbar-track {
      background: #f0f4f8;
      border-radius: 4px;
    }
    
    .dialog-content::-webkit-scrollbar-thumb {
      background: linear-gradient(135deg, #1976d2 0%, #42a5f5 100%);
      border-radius: 4px;
    }
    
    .dialog-content::-webkit-scrollbar-thumb:hover {
      background: linear-gradient(135deg, #1565c0 0%, #1976d2 100%);
    }
    
    /* Responsividade */
    @media (max-width: 768px) {
      .dialog-container {
        max-width: 95vw;
        margin: 20px;
      }
      
      .dialog-header {
        padding: 24px;
        flex-direction: column;
        text-align: center;
        gap: 16px;
      }
      
      .close-button {
        position: absolute;
        top: 16px;
        right: 16px;
      }
      
      .dialog-content {
        padding: 24px;
        max-height: 60vh;
      }
      
      .blood-type-info {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
      }
      
      .current-limits {
        flex-direction: column;
        gap: 8px;
      }
      
      .input-group {
        grid-template-columns: 1fr;
        gap: 16px;
      }
      
      .dialog-actions {
        padding: 20px 24px;
        flex-direction: column;
        gap: 16px;
      }
      
      .actions-left,
      .actions-right {
        width: 100%;
        justify-content: center;
      }
      
      .secondary-button,
      .cancel-button,
      .save-button {
        flex: 1;
        justify-content: center;
      }
    }
    
    /* Melhorias de acessibilidade */
    @media (prefers-reduced-motion: reduce) {
      * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
    }
    
    /* Focus states melhorados */
    .secondary-button:focus-visible,
    .cancel-button:focus-visible,
    .save-button:focus-visible,
    .close-button:focus-visible {
      outline: 2px solid #1976d2;
      outline-offset: 2px;
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

  getStockStatus(stock: BloodStock): string {
    if (stock.currentStock <= stock.minimumStock) {
      return 'critical';
    } else if (stock.currentStock <= stock.minimumStock * 1.5) {
      return 'warning';
    }
    return 'normal';
  }

  getStockStatusIcon(stock: BloodStock): string {
    const status = this.getStockStatus(stock);
    switch (status) {
      case 'critical': return 'error';
      case 'warning': return 'warning';
      default: return 'check_circle';
    }
  }

  hasValidationErrors(stockId: number): boolean {
    const min = this.getLimitValue(stockId, 'min');
    const max = this.getLimitValue(stockId, 'max');
    return min >= max;
  }

  getPreviewPercentage(stockId: number, value: number): number {
    const max = this.getLimitValue(stockId, 'max');
    return max > 0 ? Math.min((value / max) * 100, 100) : 0;
  }

  getPreviewStatus(stockId: number, currentStock: number): string {
    const min = this.getLimitValue(stockId, 'min');
    if (currentStock <= min) {
      return 'critical';
    } else if (currentStock <= min * 1.5) {
      return 'warning';
    }
    return 'normal';
  }

  selectAll() {
    this.data.bloodStockList.forEach(stock => {
      this.selectedStocks.add(stock.id!);
    });
  }

  clearSelection() {
    this.selectedStocks.clear();
  }

  canSave(): boolean {
    if (this.selectedStocks.size === 0) {
      return false;
    }

    // Verificar se há erros de validação
    for (const stockId of this.selectedStocks) {
      if (this.hasValidationErrors(stockId)) {
        return false;
      }
    }

    return true;
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSave() {
    if (!this.canSave()) {
      return;
    }

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
