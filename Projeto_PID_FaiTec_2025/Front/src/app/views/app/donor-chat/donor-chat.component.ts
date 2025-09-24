import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageService } from '../../../services/message/message.service';
import { AuthenticationService } from '../../../services/security/authentication.service';
import { Message } from '../../../domain/model/message';
import { User } from '../../../domain/model/user';

@Component({
  selector: 'app-donor-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './donor-chat.component.html',
  styleUrls: ['./donor-chat.component.css']
})
export class DonorChatComponent implements OnInit {
  clinics: User[] = [];
  selectedClinic: User | null = null;
  messages: Message[] = [];
  newMessage: string = '';
  currentUser: User | null = null;

  constructor(
    private messageService: MessageService,
    private authService: AuthenticationService
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getAuthenticatedUser();
    this.loadClinics();
  }

  loadClinics() {
    this.messageService.getClinicsList().subscribe(clinics => {
      this.clinics = clinics;
    });
  }

  selectClinic(clinic: User) {
    this.selectedClinic = clinic;
    this.loadConversation();
  }

  loadConversation() {
    if (this.selectedClinic && this.currentUser) {
      this.messageService.getConversation(
        Number(this.currentUser.id), 
        Number(this.selectedClinic.id)
      ).subscribe(messages => {
        this.messages = messages;
      });
    }
  }

  sendMessage() {
    if (this.newMessage.trim() && this.selectedClinic && this.currentUser) {
      const message: Message = {
        senderId: Number(this.currentUser.id),
        receiverId: Number(this.selectedClinic.id),
        message: this.newMessage
      };

      this.messageService.sendMessage(message).subscribe(sentMessage => {
        this.messages.push(sentMessage);
        this.newMessage = '';
      });
    }
  }
}