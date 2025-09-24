import { Injectable } from '@angular/core';
import { UserCredentialDto } from '../../domain/dto/user-credential-dto';
import { AuthenticatedUserDto } from '../../domain/dto/authenticated-user-dto';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { User } from '../../domain/model/user';
import { UserRole } from '../../domain/model/user-role';

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

  addDataToLocalStorage(user: AuthenticatedUserDto) {
    console.log('adicionando dados no cache...');
    localStorage.setItem('email', user.email);
    localStorage.setItem('password', user.password);
    localStorage.setItem('role', user.role);
    localStorage.setItem('id', user.id);
    if (user.role === 'ADMINISTRATOR' && user.donationLocationId) {
      localStorage.setItem('donationLocationId', user.donationLocationId.toString());
    }
    if (user.role === 'USER' && user.donorId) {
      localStorage.setItem('donorId', user.donorId.toString());
    }
  }

  logout() {
    localStorage.clear();
  }

  getAuthenticatedUser(): User {
    let email = localStorage.getItem('email');
    let password = localStorage.getItem('password');
    let role = localStorage.getItem('role');
    let id = localStorage.getItem('id');
    let donationLocationId = localStorage.getItem('donationLocationId');
    let donorId = localStorage.getItem('donorId');

    if (email == null || password == null || role == null || id == null) {
      throw new Error('Dados inválidos');
    }

    return {
      email: email,
      password: password,
      role: role as UserRole,
      id: id,
      donationLocationId: donationLocationId ?? undefined,
      donorId: donorId ?? undefined,
      name: '',
      cpf: '',
      phone: '',
      street: '',
      number: '',
      neighborhood: '',
      postalCode: ''
    };
  }

  getAuhenticatedUserEmail() {
    let email = localStorage.getItem('email');
    if (email == null) {
      throw new Error('Dados inválidos');
    }
    return email;
  }

  getAuthenticatedUserRole() {
    let role = localStorage.getItem('role');
    if (role == null) {
      throw new Error('Role não encontrado');
    }
    return role;
  }

  getAuthenticatedUserId(): string {
    let id = localStorage.getItem('id');
    if (id == null) {
      throw new Error('Id não encontrado');
    }
    return id;
  }

  getAuthenticatedUserDonorId(): string {
    let donorId = localStorage.getItem('donorId');
    if (donorId == null) {
      throw new Error('DonorId não encontrado');
    }
    return donorId;
  }

  getUserId(): string | null {
    return localStorage.getItem('id');
  }

  isSystemAdmin(): boolean {
    try {
      return this.getAuthenticatedUserRole() === 'SYSTEM';
    } catch {
      return false;
    }
  }

  isAdministrator(): boolean {
    try {
      return this.getAuthenticatedUserRole() === 'ADMINISTRATOR';
    } catch {
      return false;
    }
  }

  isUser(): boolean {
    try {
      return this.getAuthenticatedUserRole() === 'USER';
    } catch {
      return false;
    }
  }

  isClinic(): boolean {
    try {
      return this.getAuthenticatedUserRole() === 'CLINIC';
    } catch {
      return false;
    }
  }

  getDonationLocationId(): string | null {
    return localStorage.getItem('donationLocationId');
  }
}
