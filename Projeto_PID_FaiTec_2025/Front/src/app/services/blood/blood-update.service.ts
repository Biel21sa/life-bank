import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { BloodWithdrawalRequest } from '../../domain/dto/blood-withdraw-dto';

@Injectable({
  providedIn: 'root'
})
export class BloodUpdateService {

  constructor(private http: HttpClient) { }

  withdrawBlood(request: BloodWithdrawalRequest): Observable<any> {
    return this.http.put(`${environment.api_endpoint}/blood/withdraw`, request);
  }
}