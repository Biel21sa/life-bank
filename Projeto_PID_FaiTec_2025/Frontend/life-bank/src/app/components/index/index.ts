import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import * as fontawesome from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-index',
  imports: [
    RouterModule,
    FontAwesomeModule,
  ],
  templateUrl: './index.html',
  styleUrl: './index.css'
})
export class Index {
  readonly FontAwesome = fontawesome


}
