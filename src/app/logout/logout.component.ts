import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { FormsModule, ReactiveFormsModule, } from '@angular/forms';
import { environment } from '../../environments/environments';
import { Router } from '@angular/router';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatCheckboxModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.scss',
  animations: [
    trigger('fadeInOut', [
      state(
        'void',
        style({
          opacity: 0,
        })
      ),
      transition('void <=> *', animate('0.5s ease-in-out')),
    ]),
  ],
})
export class LogoutComponent {
  error: string = '';
  constructor(
    private router: Router,
    private http: HttpClient,
  ) { }

  /**
   * Initialization / activate dark mode
   */
  ngOnInit(): void {
    this.logout()
  }

    /**
   * Logout and delete users token
   */
    async logout() {
      try {
        const url = environment.baseUrl + '/logout/';
        let headers = new HttpHeaders();
        headers = headers.set(
          'Authorization',
          'Token' + localStorage.getItem('token')
        ); 
        console.log('headers ', headers)
        await lastValueFrom(this.http.post(url, {}, { headers }));

        localStorage.removeItem('token');
      } catch (e) {
        this.error = 'Error while logging out';
      }
    }

  showLogin() {
    this.router.navigateByUrl('/login');
  }

}
