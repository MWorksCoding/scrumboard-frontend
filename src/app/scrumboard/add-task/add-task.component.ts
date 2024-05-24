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
  date = new FormControl();
  categories: { id: number, name: string, color: string, email: any, phone:any }[] = [];
  // users: { id: number, first_name: string, last_name: string, username: string, color: string }[] = [];
  users: { id: number, first_name: string, last_name: string, username: string, color: string , email: string , phone: string }[] = [];

  title = '';
  description = '';
  category: any = '';
  priority = '';
  user: any = '';

  constructor(private http: HttpClient) {}

  /**
   * Initialization
   */
  ngOnInit() {
    this.fetchCategories();
    this.fetchUsers();
    this.fetchTasks()
  }


  /**
   * Get all tasks from backend
   */
  async fetchTasks() {
    try {
      const url = environment.baseUrl + '/tasks/';
      const response = await lastValueFrom(this.http.get(url));
      let tasks = response as any[];
      console.log('tasks' , tasks)
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }


  /**
   * Get all categories from backend
   */
  async fetchCategories() {
    try {
      const url = environment.baseUrl + '/categories/';
      const response = await lastValueFrom(this.http.get(url));
      this.categories = response as any[];
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }
  

  /**
   * Get all available users from backend
   */
  async fetchUsers() {
    try {
      const url = environment.baseUrl + '/users/';
      const response = await lastValueFrom(this.http.get(url));
      this.users = response as any[];
      console.log('this.users', this.users)
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }


  /**
   * Post a new Task to backend
   */
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
      this.user,
      'due_date',
      moment(this.date.value).format('YYYY-MM-DD')
    );
    try {
      const url = environment.baseUrl + '/tasks/';
      const body = {
        title: this.title,
        description: this.description,
        due_date: moment(this.date.value).format('YYYY-MM-DD'),
        category: this.category,
        priority: this.priority,
        assigned_to: [this.user.id] 
      };
      console.log('body', body);
      const response = await lastValueFrom(this.http.post(url, body));
      this.clearInputFields();
    } catch (error) {
      console.error('Error creating a new task:', error);
    }
  }

  clearInputFields() {
    this.title = '';
    this.description = '';
    this.category = '';
    this.priority = '';
    this.user = '';
    this.date.reset();
  }
}
