import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TerminalComponent } from './app/modules/terminal/terminal.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TerminalComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'virtual-serial-app';
}
