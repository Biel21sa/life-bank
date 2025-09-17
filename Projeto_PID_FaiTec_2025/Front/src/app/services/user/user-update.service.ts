import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserReadService } from './user-read.service';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../../domain/model/user';

@Injectable({
  providedIn: 'root'
})
export class UserUpdateService {

  constructor(private http: HttpClient,
    private userReadService: UserReadService
  ) { }

  async update(id: string, user: User): Promise<any> {
    return firstValueFrom(this.http.put<any>(
      `${environment.api_endpoint}/user/${id}`, user));
  }

  async updatePassword(id: string,
    oldPassword: string,
    newPassword: string): Promise<any> {

    let data = {
      id: id,
      oldPassword: oldPassword,
      newPassword: newPassword
    };

    return await firstValueFrom(this.http.put<any>(
      `${environment.api_endpoint}/user/update-password`, data));
  }
}
