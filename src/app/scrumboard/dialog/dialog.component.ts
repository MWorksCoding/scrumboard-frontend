import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
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
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environments';
import { lastValueFrom } from 'rxjs';

const moment = _rollupMoment || _moment;

@Component({
  selector: 'app-dialog',
  standalone: true,
  providers: [provideMomentDateAdapter()],
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatMomentDateModule,
    MatIconModule,
    FormsModule,
    MatSelectModule,
    MatDatepickerModule,
    ReactiveFormsModule,
  ],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss',
})
export class DialogComponent {
  date = new FormControl();
  categories: {
    id: number;
    name: string;
    color: string;
    email: any;
    phone: any;
  }[] = [];
  users: {
    id: number;
    first_name: string;
    last_name: string;
    username: string;
    color: string;
    email: string;
    phone: string;
  }[] = [];
  title = '';
  description = '';
  category: any = '';
  priority = '';
  user: any = '';
  id: number = 0;

  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { task: any; purpose: string },
    private http: HttpClient
  ) {}

  /**
   * Initialization
   */
  async ngOnInit() {
    if (this.data.purpose !== 'deletion') {
      await this.getCategories();
      await this.getUsers();
      await this.getTasks();
    }
    if (this.data.purpose == 'new-task') {
      this.title = this.data?.task?.title 
      this.description = this.data?.task?.description
      this.category = this.getCategoryName(this.data?.task?.category)
      this.priority = this.data?.task?.priority 
      this.user = this.getUserName(this.data?.task?.assigned_to)
      this.id = this.data?.task?.id
      this.date.setValue(moment(this.data?.task?.due_date));
    }
    if (this.data.purpose == 'edit-task') {
      this.title = this.data?.task?.title 
      this.description = this.data?.task?.description
      this.category = this.getCategoryName(this.data?.task?.category)
      this.priority = this.data?.task?.priority 
      this.user = this.getUserName(this.data?.task?.assigned_to)
      this.id = this.data?.task?.id
      this.date.setValue(moment(this.data?.task?.due_date));
    }
  }

  /**
   * Get all tasks from backend
   */
  async getTasks() {
    try {
      const url = environment.baseUrl + '/tasks/';
      const response = await lastValueFrom(this.http.get(url));
      let tasks = response as any[];
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }

  /**
   * Get all categories from backend
   */
  async getCategories() {
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
  async getUsers() {
    try {
      const url = environment.baseUrl + '/users/';
      const response = await lastValueFrom(this.http.get(url));
      this.users = response as any[];
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

  confirmDeletion() {
    this.dialogRef.close('confirmed');
  }

  updateTask() {
    let updatedTask = {
      id: this.id,
      title: this.title,
      description: this.description,
      due_date: moment(this.date.value).format('YYYY-MM-DD'),
      category: this.category.id,
      priority: this.priority,
      assigned_to: [this.user.id],
    };
    this.dialogRef.close(updatedTask);
  }


  /**
   * Post a new Task to backend
   */
  async addTask() {
    try {
      const url = environment.baseUrl + '/tasks/';
      const body = {
        title: this.title,
        description: this.description,
        due_date: moment(this.date.value).format('YYYY-MM-DD'),
        category: this.category.id,
        priority: this.priority,
        assigned_to: [this.user.id] 
      };
      console.log('bodydata:', body);
      const response = await lastValueFrom(this.http.post(url, body));
      this.clearInputFields();
      this.dialogRef.close('task-added')
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

  getCategoryName(categoryId: number): any {
    const category = this.categories.find(cat => cat.id === categoryId);
    return category ? category : '';
  }

  getUserName(userId: any): any {
    const user = this.users.find(u => u.id === userId[0]);
    return user ? user : '';
  }
}
