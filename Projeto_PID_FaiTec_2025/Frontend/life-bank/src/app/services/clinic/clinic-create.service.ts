import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Clinic } from '../../domain/model/clinic';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClinicCreateService {

  constructor(private http: HttpClient) { }

  create(clinic: Clinic) {
    return this.http.post(`${environment.api_endpoint}/clinic`, clinic);
  }
}
