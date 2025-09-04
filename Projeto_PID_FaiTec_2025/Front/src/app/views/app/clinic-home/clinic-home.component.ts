import { Component } from '@angular/core';

@Component({
  selector: 'app-clinic-home',
  template: `
    <div class="container">
      <h1>Bem-vindo, Clínica!</h1>
      <p>Gerencie suas atividades clínicas aqui.</p>
    </div>
  `,
  styles: [`
    .container {
      padding: 20px;
      text-align: center;
    }
  `]
})
export class ClinicHomeComponent {
}