import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
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
    FormsModule
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
  wrongEmail: boolean = true;
  wrongEntries: boolean = true;
  rememberMe: boolean = true;

  /**
   * Communication to backend
   * saving token to local storage
   */
  async login() {
    this.failedLogin = false;
    this.loading = true;
    // try {
    //   let resp: any = await this.auth.loginWithUsernameAndPassword(
    //     this.username,
    //     this.password
    //   );
    //   this.loading = false;
    //   localStorage.setItem('token', resp['token']);
    //   this.router.navigateByUrl('/todos');
    // } catch (e) {
    //   this.loading = false;
    //   this.failedLogin = true;
    //   console.error(e);
    // }
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

  showSignupCard() {
    this.loginCard = false;
    this.forgotPasswordCard = false;
    setTimeout(() => {
      this.signupCard = true;
    }, 500);
  }

  showLoginCard() {
    this.signupCard = false;
    this.forgotPasswordCard = false;
    setTimeout(() => {
      this.loginCard = true;
    }, 500);
  }

  showForgotPasswordCard() {
    this.signupCard = false;
    this.loginCard = false;
    setTimeout(() => {
      this.forgotPasswordCard = true;
    }, 500);
  }
}
