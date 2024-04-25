import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../../environments/environments';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [MatIconModule, RouterOutlet, RouterLink, RouterLinkActive, MatCardModule],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.scss'
})
export class SummaryComponent {
  todos: any = [];
  error: string = '';
  constructor(
    private router: Router,
    private http: HttpClient,
  ) {
  }

  /**
   * Initialization / activate dark mode
   */
  ngOnInit() {
    this.getDataFromBackend();
  }


    /**
   * updating material design tabledata with loaded data, activate paginatior and sort function
   */
    async getDataFromBackend() {
      try {
        this.todos = await this.loadTodos();
        console.log('todos:' , this.todos)
      } catch (e) {
        this.error = 'Error while loading';
      }
    }

      /**
   * load data with an get request, sending a token coming from the local storage
   */
  loadTodos() {
    const url = environment.baseUrl + '/scrumboard/summary/';
    let headers = new HttpHeaders();
    headers = headers.set(
      'Authorization',
      'Token' + localStorage.getItem('token')
    ); // get token from local storage
    return lastValueFrom(this.http.get(url));
  }


  redirectToDashboard() {
    this.router.navigateByUrl('/scrumboard/board');
  }
}
