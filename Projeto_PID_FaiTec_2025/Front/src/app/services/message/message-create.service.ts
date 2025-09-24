import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Message } from '../../domain/model/message';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class MessagesCreateService {

    constructor(private http: HttpClient) { }

    sendMessage(message: Message): Observable<Message> {
        return this.http.post<Message>(`${environment.api_endpoint}/messages`, message);
    }
}
