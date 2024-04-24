import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [MatIconModule, RouterOutlet, RouterLink, RouterLinkActive, MatCardModule],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.scss'
})
export class SummaryComponent {

  constructor(
    // private local: LocalStorageService,
    private router: Router,
  ) {
  }
  redirectToDashboard() {
    this.router.navigateByUrl('/scrumboard/board');
  }
}
