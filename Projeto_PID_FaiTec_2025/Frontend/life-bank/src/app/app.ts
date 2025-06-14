import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Index } from './components/index';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Index],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'life-bank';
}
