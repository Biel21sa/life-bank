import { Component } from '@angular/core';

@Component({
  selector: 'app-user-home',
  template: `
    <div class="container">
      <h1>Bem-vindo, Usuário!</h1>
      <p>Esta é sua área pessoal.</p>
    </div>
  `,
  styles: [`
    .container {
      padding: 20px;
      text-align: center;
    }
  `]
})
export class UserHomeComponent {
}