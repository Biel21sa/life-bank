import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DonationDeleteService {

  constructor(private http: HttpClient) { }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.api_endpoint}/donations/${id}`);
  }
}