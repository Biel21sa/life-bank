import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Donation } from '../../domain/model/donation';
import { DonationEvolutionData } from '../../domain/dto/donation-evolution-dto';
import { DonationByBloodTypeData } from '../../domain/dto/donation-by-blood-type-dto';
import { DonationEvolutionByTypeData } from '../../domain/dto/donation-evolution-by-blood-type-dto';

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

  getDonationsByUserId(userId: string): Observable<Donation[]> {
    return this.http.get<Donation[]>(`${environment.api_endpoint}/donations/user/${userId}`);
  }

  getDonationEvolution(donationLocationId: string, year: number): Observable<DonationEvolutionData[]> {
    return this.http.get<DonationEvolutionData[]>(`${environment.api_endpoint}/donations/evolution/${donationLocationId}/${year}`);
  }

  getDonationsByBloodType(donationLocationId: string, year: number): Observable<DonationByBloodTypeData[]> {
    return this.http.get<DonationByBloodTypeData[]>(`${environment.api_endpoint}/donations/donations-by-blood-type/${donationLocationId}/${year}`);
  }

  getDonationEvolutionByType(donationLocationId: string, year: number): Observable<DonationEvolutionByTypeData[]> {
    return this.http.get<DonationEvolutionByTypeData[]>(`${environment.api_endpoint}/donations/donation-evolution-by-type/${donationLocationId}/${year}`);
  }
}