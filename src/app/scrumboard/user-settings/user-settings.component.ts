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
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-user-settings',
  standalone: true,
  imports: [MatButtonModule,
    MatFormFieldModule,
    MatCardModule,
    MatInputModule,
    MatIconModule,
    FormsModule,
    MatSelectModule,
    MatDatepickerModule,
    ReactiveFormsModule],
  templateUrl: './user-settings.component.html',
  styleUrl: './user-settings.component.scss'
})
export class UserSettingsComponent {

}
