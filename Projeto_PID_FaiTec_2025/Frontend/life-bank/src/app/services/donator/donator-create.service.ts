import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Donator } from '../../domain/model/donator';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DonatorCreateService {

  constructor(private http: HttpClient) { }

  create(donator: Donator) {
    console.log(donator);
    return this.http.post(`${environment.api_endpoint}/donator`, donator);
  }
}
