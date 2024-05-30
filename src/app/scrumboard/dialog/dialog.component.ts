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
import { CommonModule } from '@angular/common';

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
    CommonModule,
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
  status: string = '';

  firstName: string = '';
  lastName: string = '';
  email: string = '';
  phone: number = 0;
  color = '#2ae2bd';

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
      this.status = this.data.task;
    }
    if (this.data.purpose == 'edit-task') {
      this.title = this.data?.task?.title;
      this.description = this.data?.task?.description;
      this.category = this.getCategoryName(this.data?.task?.category);
      this.priority = this.data?.task?.priority;
      this.user = this.getUserName(this.data?.task?.assigned_to);
      this.id = this.data?.task?.id;
      this.date.setValue(moment(this.data?.task?.due_date));
    }
    if (this.data.purpose == 'edit-contact') {
      this.firstName = this.data?.task?.firstName;
      this.lastName = this.data?.task?.lastName;
      this.email = this.data?.task?.email;
      this.phone = this.data?.task?.phone;
      this.color = this.data?.task?.color;
      this.id = this.data?.task?.id;
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

  /**
   * Closes the currently open dialog without returning any data.
   */
  closeDialog() {
    this.dialogRef.close();
  }

  /**
   * Closes the currently open dialog and returns the string 'confirmed' to indicate that the deletion has been confirmed.
   */
  confirmDeletion() {
    this.dialogRef.close('confirmed');
  }

  /**
   * Updates the task with the current form data and closes the dialog.
   * Constructs an updated task object with the current form data, then closes the dialog and returns the updated task object.
   */
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
   * Logs an error message if the request fails.
   */
  async addTask() {
    try {
      const url = environment.baseUrl + '/tasks/';
      let body;
      if (this.status == 'blank') {
        body = {
          title: this.title,
          description: this.description,
          due_date: moment(this.date.value).format('YYYY-MM-DD'),
          category: this.category.id,
          priority: this.priority,
          assigned_to: [this.user.id],
        };
      } else {
        body = {
          title: this.title,
          description: this.description,
          due_date: moment(this.date.value).format('YYYY-MM-DD'),
          category: this.category.id,
          priority: this.priority,
          assigned_to: [this.user.id],
          status: this.status,
        };
      }
      const response = await lastValueFrom(this.http.post(url, body));
      this.clearInputFields();
      this.dialogRef.close('task-added');
    } catch (error) {
      console.error('Error creating a new task:', error);
    }
  }

  /**
   * Clears the task input fields.
   * Resets the task form fields to their initial values.
   */
  clearInputFields() {
    this.title = '';
    this.description = '';
    this.category = '';
    this.priority = '';
    this.user = '';
    this.date.reset();
  }

  /**
   * Gets the category name by category ID.
   * Finds the category with the specified ID from the list of categories and returns it.
   * @param {number} categoryId - The ID of the category.
   * @returns {any} - The category object if found, otherwise an empty string.
   */
  getCategoryName(categoryId: number): any {
    const category = this.categories.find((cat) => cat.id === categoryId);
    return category ? category : '';
  }

  /**
   * Gets the user by user ID.
   * Finds the user with the specified ID from the list of users and returns it.
   * @param {any} userId - The ID of the user.
   * @returns {any} - The user object if found, otherwise an empty string.
   */
  getUserName(userId: any): any {
    const user = this.users.find((u) => u.id === userId[0]);
    return user ? user : '';
  }

  /**
   * Posts a new contact to the backend.
   * Sends a POST request to the backend to create a new contact with the current form data.
   * After successfully creating the contact, it clears the contact input fields and closes the dialog with the string 'contact-added'.
   * Logs an error message if the request fails.
   */
  async addContact() {
    try {
      const url = environment.baseUrl + '/contacts/';
      let body = {
        first_name: this.firstName,
        last_name: this.lastName,
        email: this.email,
        color: this.color,
        phone: this.phone,
      };
      const response = await lastValueFrom(this.http.post(url, body));
      this.clearContactFields();
      this.dialogRef.close('contact-added');
    } catch (error) {
      console.error('Error creating a new task:', error);
    }
  }

  /**
   * Clears the contact input fields.
   * Resets the contact form fields to their initial values.
   */
  clearContactFields() {
    this.firstName = '';
    this.lastName = '';
    this.email = '';
    this.color = '';
    this.phone = 0;
    this.id = 0;
  }

  /**
   * Updates the contact with the current form data and closes the dialog.
   * Constructs an updated contact object with the current form data, then closes the dialog and returns the updated contact object.
   */
  updateContact() {
    const updatedContact = {
      id: this.id,
      first_name: this.firstName,
      last_name: this.lastName,
      email: this.email,
      phone: this.phone,
      color: this.color,
    };
    this.dialogRef.close(updatedContact);
  }
}
