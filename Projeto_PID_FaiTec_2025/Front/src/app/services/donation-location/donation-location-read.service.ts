import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DonationLocation } from '../../domain/model/donation-location';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DonationLocationReadService {

  constructor(private http: HttpClient) { }

  findAll(): Observable<DonationLocation[]> {
    return this.http.get<DonationLocation[]>(`${environment.api_endpoint}/donation-location`);
  }
}