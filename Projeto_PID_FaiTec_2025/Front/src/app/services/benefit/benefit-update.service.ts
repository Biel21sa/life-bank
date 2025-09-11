import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Benefit } from '../../domain/model/benefit';

@Injectable({
    providedIn: 'root'
})
export class BenefitUpdateService {

    constructor(private http: HttpClient) { }

    update(id: string): Observable<Benefit> {
        return this.http.put<Benefit>(`${environment.api_endpoint}/benefit/${id}`, id);
    }
}