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
  categoryLookup: { [key: number]: string } = {};
  userLookup: { [key: number]: string } = {};

  constructor(public dialog: MatDialog, private router: Router, private http: HttpClient) {}


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
      this.sortTasks();
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    // this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  addNewTask(status: string) {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: 'fit-content',
      height: 'fit-content',
      disableClose: true,
      autoFocus: false,
      data: {
        task: status,
        purpose: 'new-task'
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result == 'task-added') {
        this.getTasks();
      }
    });
  }

  sortTasks() {
    this.todoTasks = this.tasks.filter(task => task.status === 'todo');
    this.inProgressTasks = this.tasks.filter(task => task.status === 'in-progress');
    this.awaitingFeedbackTasks = this.tasks.filter(task => task.status === 'await-feedback');
    this.doneTasks = this.tasks.filter(task => task.status === 'done');
  }


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
      await this.updateTask(this.draggedTask);
      this.sortTasks();
      this.draggedTask = null;
    }
  }

  async updateTask(task: any) {
    console.log('updateTask:' , task)
    try {
      const url = `${environment.baseUrl}/tasks/${task.id}/`;
      await lastValueFrom(this.http.put(url, task));
      this.getTasks();
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  }

  deleteTask(event: Event, task: any) {
    event.stopPropagation();
    const dialogRef = this.dialog.open(DialogComponent, {
      width: 'fit-content',
      height: 'fit-content',
      disableClose: true,
      autoFocus: false,
      data: {
        task: '',
        purpose: 'deletion'
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result = 'confirmed') {
        this.confirmDeletion(task);
      }
    });
  }

    /**
   * deleting a task by sending a delete request with the id
   */
    async confirmDeletion(task: any) {
      try {
        const url = `${environment.baseUrl}/tasks/${task.id}/`;
        const response = await lastValueFrom(this.http.delete(url));
        this.sortTasks();
        this.getTasks();
      } catch (error) {
        console.error('Error updating todo:', error);
      }
    }


    openTask(task: any) {
      const dialogRef = this.dialog.open(DialogComponent, {
        width: 'fit-content',
        height: 'fit-content',
        disableClose: true,
        autoFocus: false,
        data: {
          task: task,
          purpose: 'edit-task'
        },
      });
  
      dialogRef.afterClosed().subscribe((updatedData) => {
        if (updatedData) {
          this.updateTask(updatedData);
        }
      });
    }

}
