import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { firstValueFrom } from 'rxjs';
import { Clinic } from '../../domain/model/clinic';

@Injectable({
  providedIn: 'root'
})
export class ClinicReadService {

  constructor(private http: HttpClient) { }

  findAll(): Promise<any> {

    // para consumir este método, basta utilizar a palavra chave: await
    // exemplo:
    // let variavel = await userReadService.findAll();
    return firstValueFrom(this.http.get<any>(`${environment.api_endpoint}/clinic`));;
  }

  findById(id: string): Promise<Clinic>{
    return firstValueFrom(this.http.get<any>(`${environment.api_endpoint}/clinic/${id}`));
  }

  findByEmail(email: string): Promise<Clinic>{
    return firstValueFrom(this.http.get<any>(`${environment.api_endpoint}/clinic?email=${email}`));;
  }
}
