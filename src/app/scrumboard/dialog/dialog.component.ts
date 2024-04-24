import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import {DateAdapter, MAT_DATE_LOCALE} from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {MatSelectModule} from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {provideNativeDateAdapter} from '@angular/material/core';
import { FormControl, FormGroupDirective, NgForm, Validators, FormsModule, ReactiveFormsModule, } from '@angular/forms';
import {provideMomentDateAdapter} from '@angular/material-moment-adapter'
import { MatMomentDateModule } from "@angular/material-moment-adapter";
import * as _moment from 'moment';
import {default as _rollupMoment} from 'moment';

const moment = _rollupMoment || _moment;

@Component({
  selector: 'app-dialog',
  standalone: true,
  providers: [provideMomentDateAdapter()],
  imports: [MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatMomentDateModule,
    MatIconModule,
    FormsModule,
    MatSelectModule,
    MatDatepickerModule,
    ReactiveFormsModule],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss'
})
export class DialogComponent {

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
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { task: any }
  ) {  }


  closeDialog() {
    this.dialogRef.close();
  }

}
