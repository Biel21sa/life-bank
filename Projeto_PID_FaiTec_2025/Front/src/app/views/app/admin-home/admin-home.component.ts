import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-home',
  template: `
    <div class="container">
      <h1>Bem-vindo, Administrador!</h1>
      <p>Gerencie o sistema administrativo.</p>
    </div>
  `,
  styles: [`
    .container {
      padding: 20px;
      text-align: center;
    }
  `]
})
export class AdminHomeComponent {
}