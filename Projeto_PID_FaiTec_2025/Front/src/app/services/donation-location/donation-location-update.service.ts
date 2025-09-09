import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DonationLocation } from '../../domain/model/donation-location';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DonationLocationUpdateService {

  constructor(private http: HttpClient) { }

  update(id: string, donationLocation: DonationLocation): Observable<DonationLocation> {
    return this.http.put<DonationLocation>(`${environment.api_endpoint}/donation-location/${id}`, donationLocation);
  }

  findById(id: string): Observable<DonationLocation> {
    return this.http.get<DonationLocation>(`${environment.api_endpoint}/donation-location/${id}`);
  }
}