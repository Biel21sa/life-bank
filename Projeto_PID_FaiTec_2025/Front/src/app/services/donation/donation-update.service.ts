import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Donation } from '../../domain/model/donation';

@Injectable({
  providedIn: 'root'
})
export class DonationUpdateService {

  constructor(private http: HttpClient) { }

  update(donation: Donation): Observable<Donation> {

    return this.http.put<Donation>(`${environment.api_endpoint}/donations/${donation.id}`, donation);
  }
}