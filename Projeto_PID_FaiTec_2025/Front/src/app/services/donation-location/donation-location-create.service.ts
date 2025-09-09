import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DonationLocation } from '../../domain/model/donation-location';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DonationLocationCreateService {

  constructor(private http: HttpClient) { }

  create(donationLocation: DonationLocation): Observable<DonationLocation> {
    return this.http.post<DonationLocation>(`${environment.api_endpoint}/donation-location`, donationLocation);
  }
}