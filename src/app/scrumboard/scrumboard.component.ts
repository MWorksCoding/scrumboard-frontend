import { Component } from '@angular/core';
import { MenuComponent } from './menu/menu.component';
import { HeaderComponent } from './header/header.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-scrumboard',
  standalone: true,
  imports: [RouterOutlet, MenuComponent, HeaderComponent],
  templateUrl: './scrumboard.component.html',
  styleUrl: './scrumboard.component.scss'
})
export class ScrumboardComponent {

}
