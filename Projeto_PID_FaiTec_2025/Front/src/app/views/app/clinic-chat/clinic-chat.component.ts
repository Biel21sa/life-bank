import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageService } from '../../../services/message/message.service';
import { AuthenticationService } from '../../../services/security/authentication.service';
import { Message } from '../../../domain/model/message';
import { User } from '../../../domain/model/user';

@Component({
  selector: 'app-clinic-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './clinic-chat.component.html',
  styleUrls: ['./clinic-chat.component.css']
})
export class ClinicChatComponent implements OnInit {
  donors: User[] = [];
  selectedDonor: User | null = null;
  messages: Message[] = [];
  newMessage: string = '';
  currentUser: User | null = null;

  constructor(
    private messageService: MessageService,
    private authService: AuthenticationService
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getAuthenticatedUser();
    this.loadDonors();
  }

  loadDonors() {
    this.messageService.getDonorsList().subscribe(donors => {
      this.donors = donors;
    });
  }

  selectDonor(donor: User) {
    this.selectedDonor = donor;
    this.loadConversation();
  }

  loadConversation() {
    if (this.selectedDonor && this.currentUser) {
      this.messageService.getConversation(
        Number(this.currentUser.id), 
        Number(this.selectedDonor.id)
      ).subscribe(messages => {
        this.messages = messages;
      });
    }
  }

  sendMessage() {
    if (this.newMessage.trim() && this.selectedDonor && this.currentUser) {
      const message: Message = {
        senderId: Number(this.currentUser.id),
        receiverId: Number(this.selectedDonor.id),
        message: this.newMessage
      };

      this.messageService.sendMessage(message).subscribe(sentMessage => {
        this.messages.push(sentMessage);
        this.newMessage = '';
      });
    }
  }
}