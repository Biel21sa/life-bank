import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Donation } from '../../domain/model/donation';

@Injectable({
  providedIn: 'root'
})
export class DonationReadService {

  constructor(private http: HttpClient) { }

  findAll(): Observable<Donation[]> {
    return this.http.get<Donation[]>(`${environment.api_endpoint}/donations`);
  }

  findById(id: string): Observable<Donation> {
    return this.http.get<Donation>(`${environment.api_endpoint}/donations/${id}`);
  }

  findByDonationLocationId(donationLocationId: string): Observable<Donation[]> {
    return this.http.get<Donation[]>(`${environment.api_endpoint}/donations/location/${donationLocationId}`);
  }
}