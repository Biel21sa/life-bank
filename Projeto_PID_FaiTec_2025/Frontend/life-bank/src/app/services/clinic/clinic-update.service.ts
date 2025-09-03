import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ClinicReadService } from './clinic-read.service';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Clinic } from '../../domain/model/clinic';

@Injectable({
  providedIn: 'root'
})
export class ClinicUpdateService {

  constructor(private http: HttpClient, private clinicReadService: ClinicReadService) { }

  async update(id: string, fullname: string): Promise<any> {
    let clinicToUpdate: Clinic =  await this.clinicReadService.findById(id);
    if (clinicToUpdate == null){
      throw new Error("Usuário não encontrado.");
    }

    clinicToUpdate.fullname = fullname;

    return firstValueFrom(this.http.put<any>(`${environment.api_endpoint}/clinic/${id}`, clinicToUpdate));
  }

  async updatePassword(id: string, oldPassword: string, newPassword: string): Promise<any>{
    let clinicToUpdate: Clinic = await this.clinicReadService.findById(id);
    if (clinicToUpdate == null){
      throw new Error("Usuário não encontrado");
    }

    if (oldPassword !== newPassword){
      throw new Error("Senha antiga inválida");
    }

    let data = {
      password: newPassword
    }

    return firstValueFrom(this.http.put<any>(`${environment.api_endpoint}/clinic/password/${id}`, data));

  }
}
