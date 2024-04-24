import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import {DateAdapter, MAT_DATE_LOCALE} from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {provideNativeDateAdapter} from '@angular/material/core';
import { FormControl, FormGroupDirective, NgForm, Validators, FormsModule, ReactiveFormsModule, } from '@angular/forms';
import {provideMomentDateAdapter} from '@angular/material-moment-adapter'
import { MatMomentDateModule } from "@angular/material-moment-adapter";
import * as _moment from 'moment';
import {default as _rollupMoment} from 'moment';
import { MatCardModule } from '@angular/material/card';

const moment = _rollupMoment || _moment;

@Component({
  selector: 'app-add-task',
  standalone: true,
  providers: [provideMomentDateAdapter()],
  imports: [MatButtonModule,
    MatFormFieldModule,
    MatCardModule,
    MatInputModule,
    MatMomentDateModule,
    MatIconModule,
    FormsModule,
    MatSelectModule,
    MatDatepickerModule,
    ReactiveFormsModule],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss'
})
export class AddTaskComponent {

  date = new FormControl(moment(new Date()).format('DD.MM.YYYY'));
  foods = [
    {value: 'sales', viewValue: 'Sales'},
    {value: 'design', viewValue: 'Design'},
    {value: 'backoffice', viewValue: 'Backoffice'},
    {value: 'marketing', viewValue: 'Marketing'},
    {value: 'it', viewValue: 'IT'},
    {value: 'media', viewValue: 'Media'},
  ];

  users = [
    {value: 'user-0', viewValue: 'User1'},
    {value: 'user-1', viewValue: 'User2'},
    {value: 'user-2', viewValue: 'User3'},
  ];

  constructor(
  ) {  }


}
