import { Component } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatFormFieldModule, MatInputModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  loading: boolean = false;
  failedLogin: boolean = false;
  username: string = '';
  password: string = '';


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
}
