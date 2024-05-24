import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import {MatDialogModule, MatDialog,} from '@angular/material/dialog';
import { FormControl, FormGroupDirective, NgForm, FormsModule, ReactiveFormsModule, } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DialogComponent } from '../dialog/dialog.component';
import { environment } from '../../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import {MatChipsModule} from '@angular/material/chips';
import moment from 'moment';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [MatIconModule, MatCardModule, MatDialogModule, MatButtonModule, RouterOutlet, RouterLink, RouterLinkActive, MatTableModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatChipsModule],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss'
})
export class BoardComponent {
  dataSource = ''
  tasks: any[] = [];
  todoTasks: any[] = [];
  inProgressTasks: any[] = [];
  awaitingFeedbackTasks: any[] = [];
  doneTasks: any[] = [];
  categories: { id: number, name: string, color: string, email: any, phone:any }[] = [];
  users: { id: number, first_name: string, last_name: string, username: string, color: string , email: string , phone: string }[] = [];
  draggedTask: any;

  constructor(public dialog: MatDialog, private router: Router, private http: HttpClient) {}


  /**
   * Initialization
   */
    ngOnInit() {
      this.getTasks();
      this.fetchUsers();
      this.fetchCategories();
    }

      /**
   * Get all tasks from backend
   */
  async getTasks() {
    try {
      const url = environment.baseUrl + '/tasks/';
      const response = await lastValueFrom(this.http.get(url));
      this.tasks = response as any[];
      console.log('tasks in Board:', this.tasks);
      this.sortTasks();
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    // this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  openDialog() {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: 'fit-content',
      height: 'fit-content',
      disableClose: true,
      autoFocus: false,
      data: {
        task: 'Task1'
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  sortTasks() {
    this.todoTasks = this.tasks.filter(task => task.status === 'todo');
    this.inProgressTasks = this.tasks.filter(task => task.status === 'in-progress');
    this.awaitingFeedbackTasks = this.tasks.filter(task => task.status === 'await-feedback');
    this.doneTasks = this.tasks.filter(task => task.status === 'done');
    console.log('this.todoTasks', this.todoTasks)
    console.log('this.inProgressTasks', this.inProgressTasks)
    console.log('this.awaitingFeedbackTasks', this.awaitingFeedbackTasks)
    console.log('this.doneTasks', this.doneTasks)
  }


  formatDate(date: string): string {
    return moment(date).format('DD.MM.YYYY');
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
  

    categoryLookup: { [key: number]: string } = {};
    userLookup: { [key: number]: string } = {};
  
    /**
     * Get all categories from backend
     */
    async fetchCategories() {
      try {
        const url = environment.baseUrl + '/categories/';
        const response = await lastValueFrom(this.http.get(url));
        this.categories = response as any[];
        console.log('this.categories in board:' , this.categories)
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
          console.log('this.users in board:' , this.users)
        } catch (error) {
          console.error('Error fetching users:', error);
        }
      }


  getCategoryName(categoryId: number): string {
    const category = this.categories.find(cat => cat.id === categoryId);
    return category ? category.name : '';
  }

  getUserName(userId: any): any {
    const user = this.users.find(u => u.id === userId[0]);
    return user ? user.username : '';
  }

  getCategoryColor(categoryId: number): string {
    const category = this.categories.find(cat => cat.id === categoryId);
    return category ? category.color : ''; // Return the color or an empty string if category is not found
  }

  getUserColor(userId: number | number[]): string {
    const id = Array.isArray(userId) ? userId[0] : userId;
    const user = this.users.find(u => u.id === id);
    return user ? user.color : '';
  }

  onTaskDragStart(event: DragEvent, task: any) {
    this.draggedTask = task;
  }

  onTaskDragOver(event: DragEvent) {
    event.preventDefault();
  }

  async onTaskDrop(event: DragEvent, status: string) {
    event.preventDefault();
    if (this.draggedTask) {
      this.draggedTask.status = status;
      await this.updateTaskStatus(this.draggedTask);
      this.sortTasks();
      this.draggedTask = null;
    }
  }

  async updateTaskStatus(task: any) {
    try {
      const url = `${environment.baseUrl}/tasks/${task.id}/`;
      await lastValueFrom(this.http.put(url, task));
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  }
}
