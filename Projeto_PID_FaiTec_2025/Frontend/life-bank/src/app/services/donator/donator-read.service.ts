import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { firstValueFrom } from 'rxjs';
import { Donator } from '../../domain/model/donator';

@Injectable({
  providedIn: 'root'
})
export class DonatorReadService {

  constructor(private http: HttpClient) { }

  findAll(): Promise<any> {
    return firstValueFrom(this.http.get<any>(`${environment.api_endpoint}/donator`));;
  }

  findById(id: string): Promise<Donator>{
    return firstValueFrom(this.http.get<any>(`${environment.api_endpoint}/donator/${id}`));
  }

  findByEmail(email: string): Promise<Donator>{
    return firstValueFrom(this.http.get<any>(`${environment.api_endpoint}/donator?email=${email}`));;
  }
}
