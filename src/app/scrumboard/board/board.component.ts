import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {
  RouterOutlet,
  RouterLink,
  RouterLinkActive,
  Router,
} from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import {
  FormControl,
  FormGroupDirective,
  NgForm,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DialogComponent } from '../dialog/dialog.component';
import { environment } from '../../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { MatChipsModule } from '@angular/material/chips';
import moment from 'moment';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [
    MatIconModule,
    MatCardModule,
    MatDialogModule,
    MatButtonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatTableModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
  ],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
})
export class BoardComponent {
  dataSource = '';

  originalTasks: any[] = [];
  originalTodoTasks: any[] = [];
  originalInProgressTasks: any[] = [];
  originalAwaitingFeedbackTasks: any[] = [];
  originalDoneTasks: any[] = [];

  tasks: any[] = [];
  todoTasks: any[] = [];
  inProgressTasks: any[] = [];
  awaitingFeedbackTasks: any[] = [];
  doneTasks: any[] = [];
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
  draggedTask: any;
  categoryLookup: { [key: number]: string } = {};
  userLookup: { [key: number]: string } = {};

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private http: HttpClient
  ) {}

  /**
   * Initialization
   */
  ngOnInit() {
    this.getTasks();
    this.getUsers();
    this.getCategories();
  }

  /**
   * Get all tasks from backend
   */
  async getTasks() {
    try {
      const url = environment.baseUrl + '/tasks/';
      const response = await lastValueFrom(this.http.get(url));
      this.tasks = response as any[];
      this.originalTasks = [...this.tasks]; // Store original tasks
      this.sortTasks();
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }

  /**
   * Filters tasks based on the user's input in a search field.
   * Compares the search input value against task titles and descriptions, updating
   * the displayed tasks accordingly. If the input is empty, it resets the task lists to their original state.
   * @param {Event} event - The input event from the search field.
   */
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();
    if (filterValue) {
      this.todoTasks = this.originalTodoTasks.filter(
        (task) =>
          task.title.toLowerCase().includes(filterValue) ||
          task.description.toLowerCase().includes(filterValue)
      );
      this.inProgressTasks = this.originalInProgressTasks.filter(
        (task) =>
          task.title.toLowerCase().includes(filterValue) ||
          task.description.toLowerCase().includes(filterValue)
      );
      this.awaitingFeedbackTasks = this.originalAwaitingFeedbackTasks.filter(
        (task) =>
          task.title.toLowerCase().includes(filterValue) ||
          task.description.toLowerCase().includes(filterValue)
      );
      this.doneTasks = this.originalDoneTasks.filter(
        (task) =>
          task.title.toLowerCase().includes(filterValue) ||
          task.description.toLowerCase().includes(filterValue)
      );
    } else {
      this.todoTasks = [...this.originalTodoTasks];
      this.inProgressTasks = [...this.originalInProgressTasks];
      this.awaitingFeedbackTasks = [...this.originalAwaitingFeedbackTasks];
      this.doneTasks = [...this.originalDoneTasks];
    }
  }

  /**
   * Opens a dialog to add a new task, then refreshes the task list if a new task was added.
   * check if a new task was added. If so, it fetches the updated task list.
   * @param {string} status - The status of the new task to be added.
   */
  addNewTask(status: string) {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: 'fit-content',
      height: 'fit-content',
      disableClose: true,
      autoFocus: false,
      data: {
        task: status,
        purpose: 'new-task',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result == 'task-added') {
        this.getTasks();
      }
    });
  }

  /**
   * Sorts tasks into their respective status categories and stores the original task lists.
   * Filters tasks into separate lists based on their status and preserves these lists
   * in their original state for reference during filtering operations.
   */
  sortTasks() {
    this.todoTasks = this.tasks.filter((task) => task.status === 'todo');
    this.inProgressTasks = this.tasks.filter(
      (task) => task.status === 'in-progress'
    );
    this.awaitingFeedbackTasks = this.tasks.filter(
      (task) => task.status === 'await-feedback'
    );
    this.doneTasks = this.tasks.filter((task) => task.status === 'done');

    this.originalTodoTasks = [...this.todoTasks];
    this.originalInProgressTasks = [...this.inProgressTasks];
    this.originalAwaitingFeedbackTasks = [...this.awaitingFeedbackTasks];
    this.originalDoneTasks = [...this.doneTasks];
  }

  /**
   * Formats a date string into 'DD.MM.YYYY' format.
   * Uses the moment.js library to format the provided date string.
   * @param {string} date - The date string to format.
   * @returns {string} - The formatted date string.
   */
  formatDate(date: string): string {
    return moment(date).format('DD.MM.YYYY');
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
   * Retrieves the name of a category by its ID.
   * Searches the `categories` list for a category with the specified ID and returns its name.
   * Returns an empty string if the category is not found.
   * @param {number} categoryId - The ID of the category.
   * @returns {string} - The name of the category or an empty string if not found.
   */
  getCategoryName(categoryId: number): string {
    const category = this.categories.find((cat) => cat.id === categoryId);
    return category ? category.name : '';
  }

  /**
   * Retrieves the username of a user by their ID.
   * Searches the `users` list for a user with the specified ID and returns their username.
   * Returns an empty string if the user is not found.
   * @param {any} userId - The ID of the user (or an array with the user's ID).
   * @returns {string} - The username of the user or an empty string if not found.
   */
  getUserName(userId: any): any {
    const user = this.users.find((u) => u.id === userId[0]);
    return user ? user.username : '';
  }

  /**
   * Retrieves the color associated with a category by its ID.
   * Searches the `categories` list for a category with the specified ID and returns its color.
   * Returns an empty string if the category is not found.
   * @param {number} categoryId - The ID of the category.
   * @returns {string} - The color of the category or an empty string if not found.
   */
  getCategoryColor(categoryId: number): string {
    const category = this.categories.find((cat) => cat.id === categoryId);
    return category ? category.color : ''; // Return the color or an empty string if category is not found
  }

  /**
   * Retrieves the color associated with a user by their ID.
   * Searches the `users` list for a user with the specified ID and returns their color.
   * If an array of IDs is provided, it uses the first ID in the array.
   * Returns an empty string if the user is not found.
   * @param {number | number[]} userId - The ID of the user or an array containing the user's ID.
   * @returns {string} - The color of the user or an empty string if not found.
   */
  getUserColor(userId: number | number[]): string {
    const id = Array.isArray(userId) ? userId[0] : userId;
    const user = this.users.find((u) => u.id === id);
    return user ? user.color : '';
  }

  /**
   * Handles the drag start event for a task.
   * Sets the dragged task to the task being dragged.
   * @param {DragEvent} event - The drag event.
   * @param {any} task - The task being dragged.
   */
  onTaskDragStart(event: DragEvent, task: any) {
    this.draggedTask = task;
  }

  /**
   * Handles the drag over event for a task.
   * Prevents the default behavior to allow dropping.
   * @param {DragEvent} event - The drag event.
   */
  onTaskDragOver(event: DragEvent) {
    event.preventDefault();
  }

  /**
   * Handles the drop event for a task.
   * Updates the status of the dragged task and refreshes the task list.
   * @param {DragEvent} event - The drop event.
   * @param {string} status - The new status of the task.
   */
  async onTaskDrop(event: DragEvent, status: string) {
    event.preventDefault();
    if (this.draggedTask) {
      this.draggedTask.status = status;
      await this.updateTask(this.draggedTask);
      this.sortTasks();
      this.draggedTask = null;
    }
  }

  /**
   * Updates a task on the backend.
   * Sends a PUT request to update the task and fetches the updated task list.
   * Logs an error message if the request fails.
   * @param {any} task - The task to update.
   */
  async updateTask(task: any) {
    try {
      const url = `${environment.baseUrl}/tasks/${task.id}/`;
      await lastValueFrom(this.http.put(url, task));
      this.getTasks();
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  }

  /**
   * Opens a dialog to confirm the deletion of a task.
   * If the deletion is confirmed, it calls `confirmDeletion` to delete the task.
   * @param {Event} event - The click event.
   * @param {any} task - The task to delete.
   */
  deleteTask(event: Event, task: any) {
    event.stopPropagation();
    const dialogRef = this.dialog.open(DialogComponent, {
      width: 'fit-content',
      height: 'fit-content',
      disableClose: true,
      autoFocus: false,
      data: {
        task: '',
        purpose: 'deletion',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result == 'confirmed') {
        this.confirmDeletion(task);
      }
    });
  }

  /**
   * deleting a task by sending a delete request with the id
   * Sends a DELETE request to remove the task and refreshes the task list.
   * Logs an error message if the request fails.
   */
  async confirmDeletion(task: any) {
    try {
      const url = `${environment.baseUrl}/tasks/${task.id}/`;
      const response = await lastValueFrom(this.http.delete(url));
      this.sortTasks();
      this.getTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  }

  /**
   * Opens a dialog to edit a task, then updates the task if changes were made.
   * update the task with any changes made.
   * @param {any} task - The task to edit.
   */
  openTask(task: any) {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: 'fit-content',
      height: 'fit-content',
      disableClose: true,
      autoFocus: false,
      data: {
        task: task,
        purpose: 'edit-task',
      },
    });

    dialogRef.afterClosed().subscribe((updatedData) => {
      if (updatedData) {
        this.updateTask(updatedData);
      }
    });
  }
}
