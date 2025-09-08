import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Donor } from "../../domain/model/donor";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class DonorReadService {

    constructor(private http: HttpClient) { }

    findAll(): Observable<Donor[]> {
        return this.http.get<Donor[]>(`${environment.api_endpoint}/donor`);
    }

    findById(id: string): Observable<Donor> {
        return this.http.get<Donor>(`${environment.api_endpoint}/donation-location/${id}`);
    }
}