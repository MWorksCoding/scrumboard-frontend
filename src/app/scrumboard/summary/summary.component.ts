import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {
  RouterOutlet,
  RouterLink,
  RouterLinkActive,
  Router,
} from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../../environments/environments';
import moment from 'moment';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [
    MatIconModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatCardModule,
  ],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.scss',
})
export class SummaryComponent {
  tasks: any[] = [];
  error: string = '';
  todoCount: number = 0;
  inProgressCount: number = 0;
  awaitFeedbackCount: number = 0;
  doneCount: number = 0;
  nearestDueDate: string | null = null;
  nearestDueDatePriority: string | null = null;
  highestPriorityCount: number = 0;
  greeting: string = 'Hello';

  constructor(private router: Router, private http: HttpClient) {}

  /**
   * Initialization
   */
  ngOnInit() {
    this.getTasks();
    this.setGreeting();
  }

  /**
   * Get all tasks from backend
   */
  async getTasks() {
    try {
      const url = environment.baseUrl + '/tasks/';
      const response = await lastValueFrom(this.http.get(url));
      this.tasks = response as any[];
      this.countStatus();
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }

  /**
   * Sort tasks by status
   */
  countStatus() {
    if (this.tasks) {
      this.todoCount = this.tasks.filter(
        (task) => task.status === 'todo'
      ).length;
      this.inProgressCount = this.tasks.filter(
        (task) => task.status === 'in-progress'
      ).length;
      this.awaitFeedbackCount = this.tasks.filter(
        (task) => task.status === 'await-feedback'
      ).length;
      this.doneCount = this.tasks.filter(
        (task) => task.status === 'done'
      ).length;
      this.findNearestdate();
    }
  }

  /**
   * Finds the task with the nearest due date and sets the nearest due date and its priority.
   * Iterates over the list of tasks, comparing their due dates to find the nearest one
   * that is still in the future. It also counts the number of tasks with each priority
   * for the nearest due date.
   */
  findNearestdate() {
    let nearestDate: any = null;
    let priorityCounts: { [key: string]: number } = {
      high: 0,
      medium: 0,
      low: 0,
    };
    this.tasks.forEach((task) => {
      const dueDate = new Date(task.due_date);
      const today = new Date();
      if (!nearestDate || (dueDate > today && dueDate < nearestDate)) {
        nearestDate = dueDate;
        this.nearestDueDate = task.due_date;
        priorityCounts = { high: 0, medium: 0, low: 0 };
      }
      if (nearestDate && task.due_date === this.nearestDueDate) {
        priorityCounts[task.priority] =
          (priorityCounts[task.priority] || 0) + 1;
      }
    });
    if (priorityCounts['high'] > 0) {
      this.nearestDueDatePriority = 'high';
      this.highestPriorityCount = priorityCounts['high'];
    } else if (priorityCounts['medium'] > 0) {
      this.nearestDueDatePriority = 'medium';
      this.highestPriorityCount = priorityCounts['medium'];
    } else if (priorityCounts['low'] > 0) {
      this.nearestDueDatePriority = 'low';
      this.highestPriorityCount = priorityCounts['low'];
    }
    this.nearestDueDate = moment(this.nearestDueDate).format('DD.MM.YYYY');
  }

  /**
   * Redirects the user to the dashboard page.
   * Uses Angular's Router to navigate to the '/scrumboard/board' URL.
   */
  redirectToDashboard() {
    this.router.navigateByUrl('/scrumboard/board');
  }

  /**
   * Sets the greeting message based on the current time of day.
   * Determines the current hour and sets the greeting message to
   * 'Good morning', 'Good afternoon', or 'Good evening' accordingly.
   */
  setGreeting() {
    const now = new Date();
    const hour = now.getHours();

    if (hour >= 5 && hour < 12) {
      this.greeting = 'Good morning';
    } else if (hour >= 12 && hour < 18) {
      this.greeting = 'Good afternoon';
    } else {
      this.greeting = 'Good evening';
    }
  }

  /**
   * Retrieves the username from local storage.
   * Fetches the username stored in the local storage under the key 'username'.
   */
  getUsername() {
    return localStorage.getItem('username');
  }
}
