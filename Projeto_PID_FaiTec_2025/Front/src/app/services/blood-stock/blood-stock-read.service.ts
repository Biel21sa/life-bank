import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BloodStock } from '../../domain/model/blood-stock';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BloodStockReadService {

  constructor(private http: HttpClient) { }

  getStockByLocationId(donationLocationId: string): Observable<BloodStock[]> {
    return this.http.get<BloodStock[]>(`${environment.api_endpoint}/blood-stock/location/${donationLocationId}`);
  }
}