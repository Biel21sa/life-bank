import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthenticationService } from '../../../services/security/authentication.service';
import { Message } from '../../../domain/model/message';
import { User } from '../../../domain/model/user';
import { UserReadService } from '../../../services/user/user-read.service';
import { ToastrService } from 'ngx-toastr';
import { UserRole } from '../../../domain/model/user-role';
import { MessagesReadService } from '../../../services/message/message-read.service';
import { MessagesCreateService } from '../../../services/message/message-create.service';

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
    private messagesReadService: MessagesReadService,
    private messagesCreateService: MessagesCreateService,
    private authService: AuthenticationService,
    private userReadService: UserReadService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.currentUser = this.authService.getAuthenticatedUser();
    this.loadClinics();
  }

  async loadClinics() {
    try {
      let clinicList = await this.userReadService.findByRole(UserRole.CLINIC);
      if (clinicList) {
        this.clinics = clinicList;
      }
    } catch (error) {
      this.toastr.error('Erro ao carregar clinicas');
      console.error(error);
    }
  }

  selectClinic(clinic: User) {
    this.selectedClinic = clinic;
    this.loadConversation();
  }

  loadConversation() {
    if (this.selectedClinic && this.currentUser) {
      this.messagesReadService.getConversation(
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

      this.messagesCreateService.sendMessage(message).subscribe(sentMessage => {
        this.messages.push(sentMessage);
        this.newMessage = '';
      });
    }
  }
}