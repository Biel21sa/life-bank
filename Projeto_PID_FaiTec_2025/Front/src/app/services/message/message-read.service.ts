import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { Message } from "../../domain/model/message";

@Injectable({
    providedIn: 'root'
})
export class MessagesReadService {

    constructor(private http: HttpClient) { }

    getConversation(userId1: number, userId2: number): Observable<Message[]> {
        return this.http.get<Message[]>(`${environment.api_endpoint}/messages/${userId1}/${userId2}`);
    }
}