import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Municipality } from '../../domain/model/municipality';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MunicipalityReadService {

  constructor(private http: HttpClient) { }

  findAll(): Observable<Municipality[]> {
    return this.http.get<Municipality[]>(`${environment.api_endpoint}/municipality`);
  }
}