import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatRadioModule } from '@angular/material/radio';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Benefit } from '../../../../domain/model/benefit';
import { BenefitReadService } from '../../../../services/benefit/benefit-read.service';
import { BenefitUpdateService } from '../../../../services/benefit/benefit-update.service';
import { NgxMaskDirective } from 'ngx-mask';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-benefit-verification',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatCardModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatTableModule,
        FormsModule,
        NgxMaskDirective,
        MatIconModule,
        MatRadioModule
    ],
    templateUrl: './benefit-verification.component.html',
    styleUrls: ['./benefit-verification.component.css']
})
export class BenefitVerificationComponent implements OnInit {
    cpfForm: FormGroup;
    benefits: Benefit[] = [];
    displayedColumns: string[] = ['select', 'description', 'amount', 'expirationDate', 'used'];
    selectedBenefitControl: FormControl<Benefit | null>;

    searchPerformed = false;
    isSearching = false;
    isConfirming = false;

    constructor(
        private fb: FormBuilder,
        private benefitUpdateService: BenefitUpdateService,
        private benefitReadService: BenefitReadService,
        private toastr: ToastrService,
        private router: Router
    ) {
        this.cpfForm = this.fb.group({
            cpf: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]]
        });
        this.selectedBenefitControl = new FormControl<Benefit | null>(null);
    }

    ngOnInit(): void { }

    /** 🔎 Buscar benefícios pelo CPF */
    searchBenefits() {
        if (this.cpfForm.invalid) {
            this.toastr.warning('Informe um CPF válido com 11 dígitos');
            return;
        }

        this.isSearching = true;
        this.searchPerformed = true;

        const cpf = this.cpfForm.value.cpf;
        this.benefitReadService.getBenefitsByDonorCpf(cpf).subscribe({
            next: (data) => {
                this.benefits = data;
                this.selectedBenefitControl.setValue(null);
                this.isSearching = false;
                if (data.length === 0) {
                    this.toastr.info('Nenhum benefício encontrado para este CPF');
                }
            },
            error: () => {
                this.toastr.error('Erro ao buscar benefícios');
                this.isSearching = false;
            }
        });
    }

    /** 🔄 Limpar busca e resetar estado */
    clearSearch() {
        this.benefits = [];
        this.selectedBenefitControl.setValue(null);
        this.searchPerformed = false;
        this.cpfForm.reset();
    }

    /** ✅ Confirmar benefício selecionado */
    onConfirm() {
        const selected = this.selectedBenefitControl.value;
        if (!selected) {
            this.toastr.warning('Selecione um benefício antes de confirmar');
            return;
        }

        this.isConfirming = true;
        this.benefitUpdateService.update(selected.id!).subscribe({
            next: () => {
                this.toastr.success(`Benefício "${selected.description}" confirmado com sucesso!`);
                this.isConfirming = false;
                this.router.navigate(['/clinic-home']);
            },
            error: () => {
                this.toastr.error('Erro ao utilizar o benefício. Tente novamente.');
                this.isConfirming = false;
            }
        });
    }

    /** ⬅️ Voltar para tela inicial */
    goBack() {
        this.router.navigate(['/clinic-home']);
    }

    /** 📊 Contagem de benefícios disponíveis */
    getAvailableCount(): number {
        return this.benefits.filter(b => !b.used && !this.isExpired(b)).length;
    }

    /** 📊 Contagem de benefícios já usados */
    getUsedCount(): number {
        return this.benefits.filter(b => b.used).length;
    }

    /** ⏳ Verificar se benefício está expirado */
    isExpired(benefit: Benefit): boolean {
        return new Date(benefit.expirationDate) < new Date();
    }

    /** 🗓️ Dias restantes até expirar */
    getDaysUntilExpiration(expirationDate: Date | string): number {
        const exp = new Date(expirationDate).getTime();
        const today = new Date().getTime();
        return Math.max(Math.ceil((exp - today) / (1000 * 60 * 60 * 24)), 0);
    }

    /** 🎨 Classes para status do benefício */
    getBenefitStatusClass(benefit: Benefit): string {
        if (benefit.used) return 'status-used';
        if (this.isExpired(benefit)) return 'status-expired';
        return 'status-available';
    }

    getBenefitStatusIcon(benefit: Benefit): string {
        if (benefit.used) return 'done';
        if (this.isExpired(benefit)) return 'cancel';
        return 'check_circle';
    }

    getBenefitStatusText(benefit: Benefit): string {
        if (benefit.used) return 'Utilizado';
        if (this.isExpired(benefit)) return 'Expirado';
        return 'Disponível';
    }

    /** 🎨 Classe de expiração */
    getExpirationClass(expirationDate: Date | string): string {
        return this.isExpired({ expirationDate } as Benefit) ? 'expired' : 'valid';
    }

    /** 📌 Exibir detalhes do benefício */
    showBenefitDetails(benefit: Benefit) {
        this.toastr.info(
            `${benefit.description} - ${benefit.amount}% até ${new Date(benefit.expirationDate).toLocaleDateString()}`
        );
    }
}
