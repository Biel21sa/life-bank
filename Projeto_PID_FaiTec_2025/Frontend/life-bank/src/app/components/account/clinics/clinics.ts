import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import * as fontawesome from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-clinics',
  imports: [
    FontAwesomeModule
  ],
  templateUrl: './clinics.html',
  styleUrl: './clinics.css'
})
export class Clinics {
  FontAwesome = fontawesome
}
