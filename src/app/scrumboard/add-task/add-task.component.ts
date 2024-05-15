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
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';
import { MatCardModule } from '@angular/material/card';
import { environment } from '../../../environments/environments';
import { lastValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';

const moment = _rollupMoment || _moment;

@Component({
  selector: 'app-add-task',
  standalone: true,
  // providers: [provideMomentDateAdapter()],
  // providers: [{provide: MAT_DATE_LOCALE, useValue: 'en-GB'}],
  providers: [provideNativeDateAdapter()],
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    MatCardModule,
    MatInputModule,
    MatMomentDateModule,
    MatIconModule,
    FormsModule,
    MatSelectModule,
    MatDatepickerModule,
    ReactiveFormsModule,
  ],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss',
})
export class AddTaskComponent {
  // date = new FormControl(moment(new Date()).format('DD.MM.YYYY'));
  date = new FormControl(new Date());
  categories: { id: number, name: string, color: string }[] = [];
  users: { id: number, first_name: string, last_name: string, username: string, color: string }[] = [];

  title = '';
  description = '';
  category = '';
  priority = '';
  user = '';

  constructor(private http: HttpClient) {}

  /**
   * Initialization
   */
  ngOnInit() {
    this.fetchCategories();
    this.fetchUsers();
  }

  async fetchCategories() {
    try {
      const url = environment.baseUrl + '/categories/';
      const response = await lastValueFrom(this.http.get(url));
      this.categories = response as any[];
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }
  
  async fetchUsers() {
    try {
      const url = environment.baseUrl + '/users/';
      const response = await lastValueFrom(this.http.get(url));
      this.users = response as any[];
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }

  async addTask() {
    console.log(
      'this.title:',
      this.title,
      'this.description:',
      this.description,
      'this.category:',
      this.category,
      'priority:',
      this.priority,
      'assigned_to:',
      this.user
    );
    try {
      const url = environment.baseUrl + '/add-task/';
      const body = {
        title: this.title,
        description: this.description,
        due_date: this.date.value,
        category: this.category,
        priority: this.priority,
        assigned_to: this.user,
      };
      console.log('body', body);
      const response = await lastValueFrom(this.http.post(url, body));
      this.clearInputFields();
    } catch (error) {
      console.error('Error creating todo:', error);
    }
  }

  clearInputFields() {
    this.title = '';
    this.description = '';
  }
}
