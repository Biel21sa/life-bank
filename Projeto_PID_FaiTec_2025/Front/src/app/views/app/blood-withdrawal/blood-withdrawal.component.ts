import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { SelectionModel } from '@angular/cdk/collections';

import { Blood } from '../../../domain/model/blood';
import { BloodReadService } from '../../../services/blood/blood-read.service';
import { BloodUpdateService } from '../../../services/blood/blood-update.service';

@Component({
  selector: 'app-blood-withdrawal',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,

  ],
  templateUrl: './blood-withdrawal.component.html',
  styleUrls: ['./blood-withdrawal.component.css']
})
export class BloodWithdrawalComponent implements OnInit {
  bloodList: Blood[] = [];
  withdrawalForm: FormGroup;
  selection = new SelectionModel<Blood>(true, []);
  displayedColumns: string[] = ['select', 'bloodType', 'quantity', 'expirationDate'];
  locationId: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private bloodReadService: BloodReadService,
    private bloodUpdateService: BloodUpdateService,
    private toastr: ToastrService
  ) {
    this.withdrawalForm = this.fb.group({
      reason: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit() {
    this.locationId = this.route.snapshot.paramMap.get('locationId') || '';
    this.loadBloodList();
  }

  loadBloodList() {
    this.bloodReadService.getBloodByLocationId(this.locationId).subscribe({
      next: (data) => this.bloodList = data,
      error: () => this.toastr.error('Erro ao carregar bolsas de sangue')
    });
  }

  isAllSelected() {
    return this.selection.selected.length === this.bloodList.length;
  }

  masterToggle() {
    this.isAllSelected() ? this.selection.clear() : this.bloodList.forEach(row => this.selection.select(row));
  }

  onSubmit() {
    if (this.withdrawalForm.valid && this.selection.selected.length > 0) {
      const request = {
        bloodIds: this.selection.selected.map(blood => blood.id!),
        reason: this.withdrawalForm.value.reason
      };

      this.bloodUpdateService.withdrawBlood(request).subscribe({
        next: () => {
          this.toastr.success('Retirada realizada com sucesso');
          this.router.navigate(['/admin/blood-stock']);
        },
        error: () => this.toastr.error('Erro ao realizar retirada')
      });
    }
  }

  goBack() {
    this.router.navigate(['/admin']);
  }
}