import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { StockLimitsUpdate } from '../../domain/dto/update-stock-limits-dto';

@Injectable({
  providedIn: 'root'
})
export class BloodStockUpdateService {

  constructor(private http: HttpClient) { }

  updateStockLimits(request: StockLimitsUpdate): Observable<any> {
    return this.http.put(`${environment.api_endpoint}/blood-stock/${request.id}/limits`, request);
  }
}