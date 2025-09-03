import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DonatorReadService } from './donator-read.service';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Donator } from '../../domain/model/donator';

@Injectable({
  providedIn: 'root'
})
export class DonatorUpdateService {

  constructor(private http: HttpClient, private donatorReadService: DonatorReadService) { }

  async update(id: string, fullname: string): Promise<any> {
    let donatorToUpdate: Donator =  await this.donatorReadService.findById(id);
    if (donatorToUpdate == null){
      throw new Error("Usuário não encontrado.");
    }

    donatorToUpdate.fullname = fullname;

    return firstValueFrom(this.http.put<any>(`${environment.api_endpoint}/donator/${id}`, donatorToUpdate));
  }

  async updatePassword(id: string, oldPassword: string, newPassword: string): Promise<any>{
    let donatorToUpdate: Donator = await this.donatorReadService.findById(id);
    if (donatorToUpdate == null){
      throw new Error("Usuário não encontrado");
    }

    if (oldPassword !== newPassword){
      throw new Error("Senha antiga inválida");
    }

    let data = {
      password: newPassword
    }

    return firstValueFrom(this.http.put<any>(`${environment.api_endpoint}/donator/password/${id}`, data));

  }
}
