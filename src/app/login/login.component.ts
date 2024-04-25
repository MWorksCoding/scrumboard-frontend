import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { AuthService } from '../auth.service';
import { FormsModule, ReactiveFormsModule, } from '@angular/forms';
import { Router } from '@angular/router';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';


@Component({
  selector: 'app-login',
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
  username: string = '';
  password: string = '';
  loginCard: boolean = true;
  signupCard: boolean = false;
  forgotPasswordCard: boolean = false;
  wrongEmail: boolean = false;
  wrongEntries: boolean = false;
  rememberMe: boolean = false;
  // emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  // passwordFormControl = new FormControl('', [Validators.required]);


  constructor(
    private router: Router,
    private auth: AuthService,
  ) {
  }


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
      localStorage.setItem('token', resp['token']);
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
}
