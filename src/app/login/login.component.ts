import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AuthService } from '../auth.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { environment } from '../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatIconModule,
    MatCheckboxModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
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
export class LoginComponent {
  loading: boolean = false;
  failedLogin: boolean = false;
  loginCard: boolean = true;
  signupCard: boolean = false;
  forgotPasswordCard: boolean = false;
  wrongEmail: boolean = false;
  wrongEntries: boolean = false;
  rememberMe: boolean = false;
  wrongPasswordEntries: boolean = false;
  resetPasswordCard: boolean = false;
  resetPasswordSuccess: boolean = false;
  signUpSuccess: boolean = false;
  wrongPassword: boolean = false;
  wrongEmailValidation: boolean = false;

  firstName: string = '';
  lastName: string = '';
  email: string = '';
  phone: number = +49;
  color: string = 'Choose a color';
  confirmPassword: string = '';
  username: string = '';
  password: string = '';

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

  constructor(
    private router: Router,
    private auth: AuthService,
    private http: HttpClient
  ) {}

  /**
   * Communication to backend
   * saving token to local storage
   */
  async login() {
    this.failedLogin = false;
    this.loading = true;
    try {
      let resp: any = await this.auth.loginWithUsernameAndPassword(
        this.username,
        this.password
      );
      this.loading = false;
      localStorage.setItem('token', resp.token);
      localStorage.setItem('username', resp.username);
      this.router.navigateByUrl('/scrumboard/summary');
    } catch (e) {
      this.loading = false;
      this.failedLogin = true;
      console.error(e);
    }
  }

  /**
   * shows the loading screen
   */
  showLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
      loadingScreen.style.display = 'block';
    }
  }

  /**
   * hides the loading screen
   */
  closeLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
      loadingScreen.style.display = 'none';
    }
  }

  /**
   * shows sign up card, hides all other cards
   */
  showSignupCard() {
    this.loginCard = false;
    this.forgotPasswordCard = false;
    setTimeout(() => {
      this.signupCard = true;
    }, 500);
  }

  /**
   * shows login card, hides all other cards
   */
  showLoginCard() {
    this.signupCard = false;
    this.forgotPasswordCard = false;
    this.resetPasswordCard = false;
    this.signUpSuccess = false;
    this.wrongEmailValidation = false;
    this.deleteAllSignUpEntries();

    setTimeout(() => {
      this.loginCard = true;
    }, 500);
  }

  /**
   * shows forgot password card, hides all other cards
   */
  showForgotPasswordCard() {
    this.signupCard = false;
    this.loginCard = false;
    setTimeout(() => {
      this.forgotPasswordCard = true;
    }, 500);
  }

  /**
   * Validates the entries and runs the sign up
   */
  async signUp() {
    this.wrongPasswordEntries = false;
    this.wrongEntries = false;
    this.wrongEmailValidation = false;
    this.signUpSuccess = false;
  
    // Regular expression for basic email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
    if (this.password !== this.confirmPassword) {
      this.wrongPasswordEntries = true;
    } else if (!emailPattern.test(this.email)) {
      this.wrongEmailValidation = true;
    } else {
      const body = {
        first_name: this.firstName,
        last_name: this.lastName,
        username: this.username,
        email: this.email,
        phone: this.phone,
        color: this.color,
        password: this.password,
      };
      try {
        const url = `${environment.baseUrl}/create-user/`;
        const response = await lastValueFrom(this.http.post<any>(url, body));
        this.signUpSuccess = true;
        setTimeout(() => {
          this.showLoginCard();
        }, 3000);
      } catch (error) {
        console.error('Error creating user:', error);
        this.wrongEntries = true;
      }
    }
  }

  /**
   * Delete all entries
   */
  deleteAllSignUpEntries() {
    this.firstName = '';
    this.lastName = '';
    this.email = '';
    this.phone = +49;
    this.color = 'Choose a color';
    this.confirmPassword = '';
    this.password = '';
    this.username = '';
  }

  /**
   * Checks, if the email address exists
   */
  async showResetPassword(email: string) {
    try {
      const url = `${environment.baseUrl}/reset-password/${email}/`;
      console.log('Request URL:', url);
      const response = await lastValueFrom(this.http.get<any>(url));
      if (response) {
        this.forgotPasswordCard = false;
        setTimeout(() => {
          this.resetPasswordCard = true;
        }, 500);
      }
    } catch (error) {
      this.wrongEmail = true;
      console.error('Error fetching user information:', error);
    }
  }

  /**
   * Guest Login for demonstration
   * saving token to local storage
   */
  async guestLogin() {
    this.failedLogin = false;
    this.loading = true;
    try {
      let resp: any = await this.auth.loginWithUsernameAndPassword(
        'Guestuser',
        '12345'
      );
      this.loading = false;
      localStorage.setItem('token', resp.token);
      localStorage.setItem('username', resp.username);
      this.router.navigateByUrl('/scrumboard/summary');
    } catch (e) {
      this.loading = false;
      this.failedLogin = true;
      console.error(e);
    }
  }

  /**
   * Changes the user login password 
   */
  async resetPassword(email: string) {
    this.wrongPasswordEntries = false;
    this.resetPasswordSuccess = false;
    this.wrongEmail = false;
    if (this.password === this.confirmPassword) {
      try {
        const url = `${environment.baseUrl}/reset-password/${email}/`;
        const body = {
          password: this.password,
        };
        const response = await lastValueFrom(this.http.put<any>(url, body));
        this.resetPasswordSuccess = true;
        setTimeout(() => {
          this.showLoginCard();
        }, 5000);
      } catch (error) {
        this.wrongPasswordEntries = true;
        console.error('Error fetching user information:', error);
      }
    } else {
      this.wrongPasswordEntries = true;
    }
  }
}
