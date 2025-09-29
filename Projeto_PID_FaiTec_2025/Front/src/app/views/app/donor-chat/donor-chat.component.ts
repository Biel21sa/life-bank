import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthenticationService } from '../../../services/security/authentication.service';
import { Message } from '../../../domain/model/message';
import { User } from '../../../domain/model/user';
import { UserReadService } from '../../../services/user/user-read.service';
import { UserRole } from '../../../domain/model/user-role';
import { ToastrService } from 'ngx-toastr';
import { MessagesReadService } from '../../../services/message/message-read.service';
import { MessagesCreateService } from '../../../services/message/message-create.service';
import { Subject, takeUntil, interval, debounceTime, distinctUntilChanged } from 'rxjs';

interface ClinicWithMeta extends User {
  lastMessage?: Message;
}

@Component({
  selector: 'app-donor-chat',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule
  ],
  templateUrl: './donor-chat.component.html',
  styleUrls: ['./donor-chat.component.css'],
})
export class DonorChatComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;
  @ViewChild('messageInput') messageInput!: ElementRef;

  clinics: ClinicWithMeta[] = [];
  filteredClinics: ClinicWithMeta[] = [];
  selectedClinic: ClinicWithMeta | null = null;
  messages: Message[] = [];
  currentUser: User | null = null;

  newMessage: string = '';
  searchTerm: string = '';
  isLoadingClinics = false;
  isLoadingMessages = false;
  isSendingMessage = false;
  isTyping = false;
  showChatInfo = false;

  private typingTimeout: any;
  private lastMessageCount = 0;
  private shouldScrollToBottom = true;

  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();

  constructor(
    private messagesReadService: MessagesReadService,
    private messagesCreateService: MessagesCreateService,
    private authService: AuthenticationService,
    private userReadService: UserReadService,
    private toastr: ToastrService
  ) {
    this.setupSearchDebounce();
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getAuthenticatedUser();
    this.loadClinics();
    this.setupPeriodicUpdates();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();

    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
    }
  }

  ngAfterViewChecked(): void {
    if (this.shouldScrollToBottom && this.messages.length !== this.lastMessageCount) {
      this.scrollToBottom();
      this.lastMessageCount = this.messages.length;
      this.shouldScrollToBottom = false;
    }
  }

  private setupSearchDebounce(): void {
    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(searchTerm => {
        this.performSearch(searchTerm);
      });
  }

  private setupPeriodicUpdates(): void {
    interval(5000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        if (this.selectedClinic) {
          this.loadConversation(false);
        }
      });

    interval(30000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {

      });
  }

  async loadClinics(): Promise<void> {
    this.isLoadingClinics = true;

    try {
      const clinicList = await this.userReadService.findByRole(UserRole.CLINIC);
      if (clinicList) {
        this.clinics = clinicList.map(clinic => ({
          ...clinic,
          unreadCount: Math.floor(Math.random() * 5),
          lastSeen: new Date(Date.now() - Math.random() * 86400000)
        }));

        await this.loadLastMessages();
        this.filteredClinics = [...this.clinics];
        this.sortClinicsByActivity();
      }
    } catch (error) {
      this.toastr.error('Erro ao carregar clinicas');
      console.error('Error loading clinics:', error);
    } finally {
      this.isLoadingClinics = false;
    }
  }

  private async loadLastMessages(): Promise<void> {
    if (!this.currentUser) return;

    for (const clinic of this.clinics) {
      try {
        const messages = await this.messagesReadService.getConversation(
          Number(this.currentUser.id),
          Number(clinic.id)
        ).toPromise();

        if (messages && messages.length > 0) {
          clinic.lastMessage = messages[messages.length - 1];
        }
      } catch (error) {
        console.error(`Error loading last message for clinic ${clinic.id}:`, error);
      }
    }
  }

  loadConversation(showLoading = true): void {
    if (!this.selectedClinic || !this.currentUser) return;

    if (showLoading) {
      this.isLoadingMessages = true;
    }

    this.messagesReadService.getConversation(
      Number(this.currentUser.id),
      Number(this.selectedClinic.id)
    )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (messages) => {
          const previousLength = this.messages.length;
          this.messages = messages || [];

          if (this.messages.length > previousLength) {
            this.shouldScrollToBottom = true;
          }

          this.isLoadingMessages = false;
        },
        error: (error) => {
          console.error('Error loading conversation:', error);
          this.toastr.error('Erro ao carregar conversa');
          this.isLoadingMessages = false;
        }
      });
  }

  selectClinic(clinic: ClinicWithMeta): void {
    if (this.selectedClinic?.id === clinic.id) return;

    this.selectedClinic = clinic;
    this.messages = [];
    this.showChatInfo = false;
    this.loadConversation();

    this.toastr.info(`Conversa com ${clinic.name} selecionada`);
  }

  filterClinics(): void {
    this.searchSubject.next(this.searchTerm);
  }

  private performSearch(searchTerm: string): void {
    if (!searchTerm.trim()) {
      this.filteredClinics = [...this.clinics];
    } else {
      const term = searchTerm.toLowerCase();
      this.filteredClinics = this.clinics.filter(clinic =>
        clinic.name.toLowerCase().includes(term) ||
        clinic.email.toLowerCase().includes(term)
      );
    }
    this.sortClinicsByActivity();
  }

  private sortClinicsByActivity(): void {
    this.filteredClinics.sort((a, b) => {

      if (a.lastMessage && b.lastMessage) {
        return new Date(b.lastMessage.sentAt || 0).getTime() -
          new Date(a.lastMessage.sentAt || 0).getTime();
      }

      if (a.lastMessage && !b.lastMessage) return -1;
      if (!a.lastMessage && b.lastMessage) return 1;

      return a.name.localeCompare(b.name);
    });
  }

  sendMessage(): void {
    if (!this.canSendMessage()) return;

    const messageText = this.newMessage.trim();
    if (!messageText || !this.selectedClinic || !this.currentUser) return;

    this.isSendingMessage = true;

    const message: Message = {
      senderId: Number(this.currentUser.id),
      receiverId: Number(this.selectedClinic.id),
      message: messageText,
      sentAt: new Date()
    };

    this.messagesCreateService.sendMessage(message)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (sentMessage) => {
          this.messages.push(sentMessage);
          this.newMessage = '';
          this.shouldScrollToBottom = true;

          if (this.selectedClinic) {
            this.selectedClinic.lastMessage = sentMessage;
            this.sortClinicsByActivity();
          }

          this.isSendingMessage = false;
          this.toastr.success('Mensagem enviada!');
        },
        error: (error) => {
          console.error('Error sending message:', error);
          this.toastr.error('Erro ao enviar mensagem');
          this.isSendingMessage = false;
        }
      });
  }

  handleEnterKey(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  handleTyping(): void {
    this.isTyping = true;

    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
    }

    this.typingTimeout = setTimeout(() => {
      this.isTyping = false;
    }, 1000);
  }

  canSendMessage(): boolean {
    return !!(this.newMessage.trim() &&
      this.selectedClinic &&
      this.currentUser &&
      !this.isSendingMessage);
  }

  scrollToBottom(): void {
    if (this.messagesContainer) {
      try {
        const element = this.messagesContainer.nativeElement;
        element.scrollTop = element.scrollHeight;
      } catch (err) {
        console.error('Error scrolling to bottom:', err);
      }
    }
  }

  getClinicInitials(clinic: User): string {
    if (!clinic.name) return '??';

    const names = clinic.name.trim().split(' ');
    if (names.length === 1) {
      return names[0].substring(0, 2).toUpperCase();
    }

    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
  }

  getClinicAvatarColor(clinic: User): string {
    const colors = [
      'linear-gradient(135deg, #1976d2 0%, #0d47a1 100%)',
      'linear-gradient(135deg, #388e3c 0%, #2e7d32 100%)',
      'linear-gradient(135deg, #f57c00 0%, #ef6c00 100%)',
      'linear-gradient(135deg, #7b1fa2 0%, #6a1b9a 100%)',
      'linear-gradient(135deg, #d32f2f 0%, #c62828 100%)',
      'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
      'linear-gradient(135deg, #00796b 0%, #00695c 100%)',
      'linear-gradient(135deg, #5d4037 0%, #4e342e 100%)'
    ];

    const hash = clinic.name.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);

    return colors[Math.abs(hash) % colors.length];
  }

  getLastMessage(clinic: ClinicWithMeta): Message | undefined {
    return clinic.lastMessage;
  }

  getMessageStatus(message: Message): string {
    const now = new Date();
    const sentTime = new Date(message.sentAt || now);
    const diffMinutes = (now.getTime() - sentTime.getTime()) / (1000 * 60);

    if (diffMinutes < 1) return 'schedule';
    if (diffMinutes < 5) return 'done';
    return 'done_all';
  }

  getUniqueDates(): string[] {
    const dates = new Set<string>();
    this.messages.forEach(message => {
      if (message.sentAt) {
        const date = new Date(message.sentAt).toDateString();
        dates.add(date);
      }
    });
    return Array.from(dates).sort();
  }

  getConversationDays(): number {
    if (this.messages.length === 0) return 0;

    const firstMessage = this.messages[0];
    const lastMessage = this.messages[this.messages.length - 1];

    if (!firstMessage.sentAt || !lastMessage.sentAt) return 0;

    const diffTime = new Date(lastMessage.sentAt).getTime() - new Date(firstMessage.sentAt).getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return Math.max(1, diffDays);
  }

  trackByClinic(index: number, clinic: ClinicWithMeta): string {
    return clinic.id!;
  }

  trackByMessage(index: number, message: Message): string {
    return `${message.senderId}-${message.receiverId}-${message.sentAt}`;
  }

  trackByDate(index: number, date: string): string {
    return date;
  }

  getAriaLabel(section: string): string {
    switch (section) {
      case 'clinics-list':
        return `Lista de doadores com ${this.filteredClinics.length} contatos`;
      case 'chat-area':
        return this.selectedClinic ?
          `Área de chat com ${this.selectedClinic.name}` :
          'Área de chat';
      case 'messages':
        return `${this.messages.length} mensagens na conversa`;
      case 'message-input':
        return 'Campo para digitar nova mensagem';
      default:
        return section;
    }
  }

  shouldShowTypingIndicator(): boolean {
    return this.isTyping && !!this.selectedClinic;
  }

  getMessageInputPlaceholder(): string {
    if (this.selectedClinic) {
      return `Mensagem para ${this.selectedClinic.name}...`;
    }
    return 'Digite sua mensagem...';
  }

  handleError(error: any, context: string): void {
    console.error(`Error in ${context}:`, error);

    let message = 'Ocorreu um erro inesperado';

    if (error.status === 400) {
      message = 'Dados inválidos';
    } else if (error.status === 401) {
      message = 'Sessão expirada. Faça login novamente';
    } else if (error.status === 403) {
      message = 'Acesso negado';
    } else if (error.status === 404) {
      message = 'Recurso não encontrado';
    } else if (error.status === 500) {
      message = 'Erro interno do servidor';
    }

    this.toastr.error(message);
  }

  private cleanup(): void {
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
      this.typingTimeout = null;
    }

    this.messages = [];
    this.selectedClinic = null;
    this.newMessage = '';
    this.searchTerm = '';
    this.isTyping = false;
    this.showChatInfo = false;
  }
  onKeyboardShortcut(event: KeyboardEvent): void {
    if (event.ctrlKey || event.metaKey) {
      switch (event.key) {
        case 'f':
          event.preventDefault();
          break;
        case 'Enter':
          event.preventDefault();
          this.sendMessage();
          break;
        case 'Escape':
          event.preventDefault();
          this.showChatInfo = false;
          break;
      }
    }
  }
}
