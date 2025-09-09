import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Blood } from '../../domain/model/blood';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BloodReadService {

  constructor(private http: HttpClient) { }

  getBloodByLocationId(donationLocationId: string): Observable<Blood[]> {
    return this.http.get<Blood[]>(`${environment.api_endpoint}/blood/location/${donationLocationId}`);
  }
}