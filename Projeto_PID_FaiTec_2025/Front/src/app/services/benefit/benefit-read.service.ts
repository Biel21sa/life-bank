import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Benefit } from '../../domain/model/benefit';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BenefitReadService {

  constructor(private http: HttpClient) { }

  getBenefitsByUserId(userId: string): Observable<Benefit[]> {
    return this.http.get<Benefit[]>(`${environment.api_endpoint}/benefit/user/${userId}`);
  }

  getBenefitsByDonorCpf(cpf: string): Observable<Benefit[]> {
    return this.http.get<Benefit[]>(`${environment.api_endpoint}/benefit/donor/${cpf}`);
  }
}