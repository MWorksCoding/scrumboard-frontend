import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import {DateAdapter, MAT_DATE_LOCALE} from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {provideNativeDateAdapter} from '@angular/material/core';
import {MatListModule} from '@angular/material/list';
import { FormControl, FormGroupDirective, NgForm, Validators, FormsModule, ReactiveFormsModule, } from '@angular/forms';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [MatButtonModule,
    MatFormFieldModule,
    MatCardModule,
    MatInputModule,
    MatIconModule,
    FormsModule,
    MatSelectModule,
    MatDatepickerModule,
    MatListModule,
    ReactiveFormsModule],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss'
})
export class ContactsComponent {

  editMode:boolean = false;
  detailView:boolean = false
  addContact:boolean = true;
  users= [
    {
      name: 'Person 1'
    },
    {
      name: 'Person 2'
    },
    {
      name: 'Person 3'
    },
  ];


user = {
  name: ''
}

  showUser(user: { name: string; }){
    this.user = user 
    this.detailView = true;
  }

  editUser() {
    this.editMode = true;
  }

  saveChanges() {
    console.log('this.editMode1', this.editMode);
    this.editMode = !this.editMode; // Assign the negated value back to editMode
    this.detailView = !this.detailView; // Similarly for detailView
    console.log('this.editMode2', this.editMode);
  }

  addNewContact() {
    this.addContact = false
    this.editMode = true;
  }
}
