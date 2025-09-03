import { Injectable } from '@angular/core';
import { UserCredentialDto } from '../../domain/dto/user-credential-dto';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http: HttpClient) { }

  authenticate(credentials: UserCredentialDto): Observable<any> {
    console.log('autenticando o usuario');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const body = {
      email: credentials.email,
      password: credentials.password,
    }

    return this.http.post<any>(`${environment.authentication_api_endpoint}/authenticate`, body, { headers });
    // apenas descomente caso se utilizar o json-server
    // return this.http.get<any>(`${environment.authentication_api_endpoint}/user/1`);
  }

  isAuthenticated(): boolean {
    let email = localStorage.getItem('email');
    if (email != null) {
      console.log(`email encontrado: ${email}`);
      return true;
    }
    return false;
  }

  addDataToLocalStorage(user: UserCredentialDto) {
    console.log('adicionando dados no cache...');
    localStorage.setItem('email', user.email);
    localStorage.setItem('password', user.password);
  }

  logout() {
    localStorage.clear();
  }

  getAuhenticatedUserEmail() {
    let email = localStorage.getItem('email');
    if (email == null) {
      throw new Error('Dados inválidos');
    }
    return email;
  }
}
