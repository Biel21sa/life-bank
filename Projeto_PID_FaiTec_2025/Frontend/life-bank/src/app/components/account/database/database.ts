import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import * as fontawesome from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-dashboard',
  imports: [
    FontAwesomeModule,
  ],
  templateUrl: './database.html',
  styleUrl: './database.css'
})
export class Database {
  FontAwesome = fontawesome
}
