import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule, FormControl } from '@angular/forms';
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
    ngOnInit(): void {
        // No initialization needed for now
    }

    searchBenefits() {
        if (this.cpfForm.invalid) {
            this.toastr.warning('Informe um CPF válido com 11 dígitos');
            return;
        }

        const cpf = this.cpfForm.value.cpf;
        this.benefitReadService.getBenefitsByDonorCpf(cpf).subscribe({
            next: (data) => {
                this.benefits = data;
                this.selectedBenefitControl.setValue(null);
                if (data.length === 0) {
                    this.toastr.info('Nenhum benefício encontrado para este CPF');
                }
            },
            error: () => this.toastr.error('Nenhum benefício encontrado para este CPF')
        });
    }

    onConfirm() {
        const selected = this.selectedBenefitControl.value;
        if (!selected) {
            this.toastr.warning('Selecione um benefício antes de confirmar');
            return;
        }

        this.benefitUpdateService.update(selected.id!).subscribe({
            next: () => {
                this.toastr.success(`Benefício "${selected.description}" selecionado com sucesso!`);
            },
            error: () => {
                this.toastr.error('Erro ao utilizar o benefício. Tente novamente.')
            }
        });

        this.router.navigate(['/clinic-home']);
    }

    goBack() {
        this.router.navigate(['/clinic-home']);
    }
}
