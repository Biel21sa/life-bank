import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { firstValueFrom, Observable } from 'rxjs';
import { User } from '../../domain/model/user';

@Injectable({
  providedIn: 'root'
})
export class UserReadService {

  constructor(private http: HttpClient) { }

  findAll(): Promise<any> {

    // para consumir este metodo, basta utilizar a palavra chave: await
    // exemplo:
    // let variavel = await userReadService.findAll();
    return firstValueFrom(this.http.get<any>(`${environment.api_endpoint}/user`));
  }


  findById(id: string): Promise<User> {
    return firstValueFrom(this.http.get<any>(`${environment.api_endpoint}/user/${id}`));
  }

  findByEmail(email: string): Promise<User> {
    return firstValueFrom(this.http.get<any>(`${environment.api_endpoint}/user/email/${email}`));
  }

}
