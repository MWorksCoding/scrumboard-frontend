import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import {
  FormControl,
  FormGroupDirective,
  NgForm,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environments';
import { lastValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-settings',
  standalone: true,
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    MatCardModule,
    MatInputModule,
    MatIconModule,
    FormsModule,
    MatSelectModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './user-settings.component.html',
  styleUrl: './user-settings.component.scss',
})
export class UserSettingsComponent {
  constructor(private http: HttpClient) {}

  firstName: string = '';
  lastName: string = '';
  email: string = '';
  phone: number = 0;
  color:string = '#2ae2bd';
  username: string = '';
  id: number = 0;
  colors = [
    { value: '#2ae2bd' },
    { value: '#e2612a' },
    { value: '#2a4fe2' },
    { value: '#e2bd2a' },
    { value: '#e22a4f' },
    { value: '#abe22a' },
    { value: '#e22aab' },
    { value: '#2ae261' },
    { value: '#93a2da' },
    { value: '#78919c' },
    { value: '#8b8b8b' },
    { value: '#25b0e6' },
    { value: '#1fbbce' },
  ];

  /**
   * Initialization
   */
  async ngOnInit() {
    await this.getUserInfos();
  }

  /**
   * Get all user infos from backend
   */
  async getUserInfos() {
    try {
      const username = localStorage.getItem('username');
      if (!username) {
        console.error('Username not found in local storage');
        return;
      }
      const url = `${environment.baseUrl}/user-settings/${username}`;
      const response = await lastValueFrom(this.http.get<any>(url));
      if (response && response.id) {
          this.id = response.id;
          this.firstName = response.first_name,
          this.lastName = response.last_name,
          this.username = response.username,
          this.color = response.color,
          this.email = response.email,
          this.phone = response.phone
        } else {
        console.error('Invalid user data received from the server');
      }
    } catch (error) {
      console.error('Error fetching user information:', error);
    }
  }


  async saveChanges() {
    try {
      const url = `${environment.baseUrl}/user-settings/${this.username}/`;  // Assuming username is unique
      const body = {
        first_name: this.firstName,
        last_name: this.lastName,
        email: this.email,
        phone: this.phone,
        color: this.color,
        username: this.username,
        id: this.id
      };
      const response = await lastValueFrom(this.http.put<any>(url, body));
      if (response && response.username) {
        localStorage.setItem('username', response.username);
      }
    } catch (error) {
      console.error('Error updating user information:', error);
    }
  }
}
