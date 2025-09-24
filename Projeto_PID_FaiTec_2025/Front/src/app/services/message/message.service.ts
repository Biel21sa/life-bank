import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Message } from '../../domain/model/message';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private apiUrl = 'http://localhost:8080/api/messages';

  constructor(private http: HttpClient) { }

  getConversation(userId1: number, userId2: number): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.apiUrl}/conversation/${userId1}/${userId2}`);
  }

  sendMessage(message: Message): Observable<Message> {
    return this.http.post<Message>(this.apiUrl, message);
  }

  getDonorsList(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:8080/api/users/donors');
  }

  getClinicsList(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:8080/api/users/clinics');
  }
}