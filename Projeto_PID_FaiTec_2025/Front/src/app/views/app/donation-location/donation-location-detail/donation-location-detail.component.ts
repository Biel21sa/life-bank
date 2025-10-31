import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DonationLocationUpdateService } from '../../../../services/donation-location/donation-location-update.service';
import { DonationLocation } from '../../../../domain/model/donation-location';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgxMaskPipe } from 'ngx-mask';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-donation-location-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    NgxMaskPipe
  ],
  templateUrl: './donation-location-detail.component.html',
  styleUrl: './donation-location-detail.component.css'
})
export class DonationLocationDetailComponent implements OnInit, OnDestroy {

  donationLocation: DonationLocation | null = null;
  isLoading = true;
  hasError = false;
  locationId: string | null = null;

  // Observables e subscriptions
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private donationLocationService: DonationLocationUpdateService,
    private toastrService: ToastrService
  ) { }

  ngOnInit(): void {
    this.locationId = this.route.snapshot.paramMap.get('id');
    if (this.locationId) {
      this.loadDonationLocation(this.locationId);
    } else {
      this.handleError('ID do local não encontrado');
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ===== CARREGAMENTO DE DADOS =====
  loadDonationLocation(id: string): void {
    this.isLoading = true;
    this.hasError = false;

    this.donationLocationService.findById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (location) => {
          this.donationLocation = location;
          this.isLoading = false;
          this.hasError = false;
        },
        error: (error) => {
          console.error('Erro ao carregar local de doação:', error);
          this.handleError('Erro ao carregar informações do local');
          this.isLoading = false;
        }
      });
  }

  retryLoad(): void {
    if (this.locationId) {
      this.loadDonationLocation(this.locationId);
    }
  }

  private handleError(message: string): void {
    this.hasError = true;
    this.toastrService.error(message);
  }

  // ===== NAVEGAÇÃO =====
  goBack(): void {
    this.router.navigate(['/donation-location/list']);
  }

  navigateToEdit(): void {
    if (this.donationLocation?.id) {
      this.router.navigate(['/donation-location/edit', this.donationLocation.id]);
    }
  }

  // ===== AÇÕES DE LOCALIZAÇÃO =====
  viewOnMap(): void {
    if (!this.donationLocation) {
      this.toastrService.warning('Informações do local não disponíveis');
      return;
    }

    const address = this.getFullAddress();
    const encodedAddress = encodeURIComponent(address);
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;

    window.open(mapsUrl, '_blank');
    this.toastrService.info('Abrindo localização no mapa');
  }

  getDirections(): void {
    if (!this.donationLocation) {
      this.toastrService.warning('Informações do local não disponíveis');
      return;
    }

    const address = this.getFullAddress();
    const encodedAddress = encodeURIComponent(address);
    const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;

    window.open(directionsUrl, '_blank');
    this.toastrService.info('Abrindo direções no Google Maps');
  }

  shareLocation(): void {
    if (!this.donationLocation) {
      this.toastrService.warning('Informações do local não disponíveis');
      return;
    }

    const shareData = {
      title: `Local de Doação: ${this.donationLocation.name}`,
      text: `Confira as informações deste local de doação de sangue: ${this.donationLocation.name}`,
      url: window.location.href
    };

    if (navigator.share) {
      navigator.share(shareData)
        .then(() => {
          this.toastrService.success('Local compartilhado com sucesso!');
        })
        .catch((error) => {
          console.error('Erro ao compartilhar:', error);
          this.fallbackShare();
        });
    } else {
      this.fallbackShare();
    }
  }

  private fallbackShare(): void {
    const url = window.location.href;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(url)
        .then(() => {
          this.toastrService.success('Link copiado para a área de transferência!');
        })
        .catch(() => {
          this.toastrService.info('Copie o link da barra de endereços para compartilhar');
        });
    } else {
      this.toastrService.info('Copie o link da barra de endereços para compartilhar');
    }
  }

  printDetails(): void {
    if (!this.donationLocation) {
      this.toastrService.warning('Informações do local não disponíveis');
      return;
    }

    // Criar uma versão para impressão
    const printContent = this.generatePrintContent();
    const printWindow = window.open('', '_blank');

    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();

      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);

      this.toastrService.info('Preparando impressão...');
    } else {
      this.toastrService.error('Não foi possível abrir a janela de impressão');
    }
  }

  private generatePrintContent(): string {
    if (!this.donationLocation) return '';

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Detalhes do Local de Doação - ${this.donationLocation.name}</title>
        <style>
          body { 
            font-family: 'Inter', Arial, sans-serif; 
            margin: 20px; 
            color: #333;
            line-height: 1.6;
          }
          .header {
            text-align: center;
            border-bottom: 3px solid #1976d2;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          h1 { 
            color: #1976d2; 
            font-size: 2.5rem;
            margin: 0 0 10px 0;
            font-weight: 300;
          }
          .subtitle {
            color: #666;
            font-size: 1.1rem;
            margin: 0;
          }
          .section {
            margin: 30px 0;
            padding: 20px;
            background: #f8faff;
            border-radius: 8px;
            border-left: 4px solid #1976d2;
          }
          h2 { 
            color: #1976d2; 
            margin-top: 0;
            font-size: 1.5rem;
            font-weight: 500;
          }
          .detail { 
            margin: 15px 0; 
            display: flex;
            align-items: center;
          }
          .label { 
            font-weight: 600; 
            color: #333;
            min-width: 150px;
            margin-right: 15px;
          }
          .value { 
            color: #666;
            flex: 1;
          }
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            text-align: center;
            font-size: 0.9rem;
            color: #999;
          }
          @media print { 
            body { margin: 0; }
            .section { break-inside: avoid; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Detalhes do Local de Doação</h1>
          <p class="subtitle">Informações completas do estabelecimento</p>
        </div>
        
        <div class="section">
          <h2>Informações Básicas</h2>
          <div class="detail">
            <span class="label">Nome:</span>
            <span class="value">${this.donationLocation.name}</span>
          </div>
          <div class="detail">
            <span class="label">Tipo:</span>
            <span class="value">Local de Doação de Sangue</span>
          </div>
          <div class="detail">
            <span class="label">Status:</span>
            <span class="value">Ativo</span>
          </div>
        </div>
        
        <div class="section">
          <h2>Endereço Completo</h2>
          <div class="detail">
            <span class="label">Logradouro:</span>
            <span class="value">${this.donationLocation.street}, ${this.donationLocation.number}</span>
          </div>
          <div class="detail">
            <span class="label">Bairro:</span>
            <span class="value">${this.donationLocation.neighborhood}</span>
          </div>
          <div class="detail">
            <span class="label">CEP:</span>
            <span class="value">${this.formatCep(this.donationLocation.postalCode)}</span>
          </div>
          <div class="detail">
            <span class="label">Município:</span>
            <span class="value">${this.donationLocation.municipality.name}</span>
          </div>
          <div class="detail">
            <span class="label">Estado:</span>
            <span class="value">${this.donationLocation.municipality.state}</span>
          </div>
        </div>
        
        <div class="section">
          <h2>Serviços Disponíveis</h2>
          <div class="detail">
            <span class="label">Doação de Sangue:</span>
            <span class="value">Disponível</span>
          </div>
          <div class="detail">
            <span class="label">Triagem Médica:</span>
            <span class="value">Disponível</span>
          </div>
          <div class="detail">
            <span class="label">Cadastro de Doadores:</span>
            <span class="value">Disponível</span>
          </div>
          <div class="detail">
            <span class="label">Orientações:</span>
            <span class="value">Disponível</span>
          </div>
        </div>
        
        <div class="footer">
          <p>Documento gerado em: ${new Date().toLocaleString('pt-BR')}</p>
          <p>Sistema de Gerenciamento de Doação de Sangue</p>
        </div>
      </body>
      </html>
    `;
  }

  // ===== MÉTODOS AUXILIARES =====
  getFullAddress(): string {
    if (!this.donationLocation) return '';

    const parts = [
      this.donationLocation.street,
      this.donationLocation.number,
      this.donationLocation.neighborhood,
      this.donationLocation.municipality.name,
      this.donationLocation.municipality.state
    ].filter(part => part && part.toString().trim() !== '');

    return parts.join(', ');
  }

  formatCep(cep: string): string {
    if (!cep) return '';
    const cleanCep = cep.replace(/\D/g, '');
    return cleanCep.replace(/(\d{5})(\d{3})/, '$1-$2');
  }

  getCurrentDate(): string {
    return new Date().toLocaleDateString('pt-BR');
  }

  getLocationStatus(): string {
    // Implementar lógica de status baseada nos dados reais
    // Por enquanto, assumindo que todos estão ativos
    return 'Ativo';
  }

  getLocationServices(): string[] {
    // Implementar lógica de serviços baseada nos dados reais
    // Por enquanto, retornando serviços padrão
    return [
      'Doação de Sangue',
      'Triagem Médica',
      'Cadastro de Doadores',
      'Orientações'
    ];
  }

  // ===== MÉTODOS DE FORMATAÇÃO =====
  formatAddress(): string {
    if (!this.donationLocation) return '';
    return `${this.donationLocation.street}, ${this.donationLocation.number}`;
  }

  formatMunicipality(): string {
    if (!this.donationLocation) return '';
    return `${this.donationLocation.municipality.name}, ${this.donationLocation.municipality.state}`;
  }

  // ===== MÉTODOS DE VALIDAÇÃO =====
  hasValidLocation(): boolean {
    return !!(this.donationLocation &&
      this.donationLocation.name &&
      this.donationLocation.street &&
      this.donationLocation.municipality);
  }

  canEdit(): boolean {
    // Implementar lógica de permissões se necessário
    return this.hasValidLocation();
  }

  canShare(): boolean {
    return this.hasValidLocation();
  }

  // ===== GETTERS PARA O TEMPLATE =====
  get isDataLoaded(): boolean {
    return !this.isLoading && !this.hasError && !!this.donationLocation;
  }

  get pageTitle(): string {
    return this.donationLocation?.name || 'Local de Doação';
  }

  get locationDisplayName(): string {
    return this.donationLocation?.name || 'Nome não disponível';
  }

  get locationStatusClass(): string {
    // Implementar lógica de classes baseada no status real
    return 'active';
  }

  get locationStatusText(): string {
    return 'Ativo';
  }

  get locationStatusIcon(): string {
    return 'check_circle';
  }

  // ===== MÉTODOS DE INTERAÇÃO =====
  copyToClipboard(text: string, label: string): void {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text)
        .then(() => {
          this.toastrService.success(`${label} copiado para a área de transferência!`);
        })
        .catch(() => {
          this.toastrService.error('Erro ao copiar para a área de transferência');
        });
    } else {
      // Fallback para navegadores mais antigos
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();

      try {
        document.execCommand('copy');
        this.toastrService.success(`${label} copiado para a área de transferência!`);
      } catch (err) {
        this.toastrService.error('Erro ao copiar para a área de transferência');
      }

      document.body.removeChild(textArea);
    }
  }

  // ===== MÉTODOS DE ACESSIBILIDADE =====
  getAriaLabel(section: string): string {
    if (!this.donationLocation) return section;

    switch (section) {
      case 'header':
        return `Cabeçalho do local ${this.donationLocation.name}`;
      case 'basic-info':
        return `Informações básicas do local ${this.donationLocation.name}`;
      case 'address':
        return `Endereço do local ${this.donationLocation.name}`;
      case 'services':
        return `Serviços disponíveis no local ${this.donationLocation.name}`;
      case 'actions':
        return `Ações disponíveis para o local ${this.donationLocation.name}`;
      default:
        return section;
    }
  }

  // ===== MÉTODOS DE PERFORMANCE =====
  trackByFn(index: number, item: any): any {
    return item.id || index;
  }

  // ===== MÉTODOS DE ESTATÍSTICAS =====
  getLocationStats(): any {
    // Implementar lógica de estatísticas baseada nos dados reais
    // Por enquanto, retornando dados simulados
    return {
      totalDonations: 1250,
      monthlyAverage: 104,
      activeHours: '24h',
      dailyCapacity: 150
    };
  }

  getOperatingHours(): string {
    // Implementar lógica de horários baseada nos dados reais
    // Por enquanto, assumindo funcionamento 24h
    return '24 horas';
  }

  getDailyCapacity(): number {
    // Implementar lógica de capacidade baseada nos dados reais
    // Por enquanto, retornando valor simulado
    return 150;
  }

  // ===== MÉTODOS DE UTILIDADE =====
  isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  sanitizeText(text: string): string {
    return text.replace(/[<>]/g, '');
  }

  formatPhoneNumber(phone: string): string {
    if (!phone) return '';
    const cleanPhone = phone.replace(/\D/g, '');

    if (cleanPhone.length === 11) {
      return cleanPhone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (cleanPhone.length === 10) {
      return cleanPhone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }

    return phone;
  }

  // ===== MÉTODOS DE ANÁLISE =====
  getLocationScore(): number {
    // Implementar lógica de pontuação baseada nos dados reais
    // Por enquanto, retornando valor simulado
    return 4.8;
  }

  getLocationRating(): string {
    const score = this.getLocationScore();
    if (score >= 4.5) return 'Excelente';
    if (score >= 4.0) return 'Muito Bom';
    if (score >= 3.5) return 'Bom';
    if (score >= 3.0) return 'Regular';
    return 'Precisa Melhorar';
  }

  // ===== MÉTODOS DE CONFIGURAÇÃO =====
  getMapZoomLevel(): number {
    return 15; // Zoom padrão para visualização de local específico
  }

  getMapType(): string {
    return 'roadmap'; // Tipo de mapa padrão
  }

  // ===== MÉTODOS DE HISTÓRICO =====
  getLastUpdateDate(): string {
    // Implementar lógica de última atualização baseada nos dados reais
    // Por enquanto, retornando data atual
    return new Date().toLocaleDateString('pt-BR');
  }

  getCreationDate(): string {
    // Implementar lógica de data de criação baseada nos dados reais
    // Por enquanto, retornando data simulada
    const creationDate = new Date();
    creationDate.setMonth(creationDate.getMonth() - 6);
    return creationDate.toLocaleDateString('pt-BR');
  }
}
