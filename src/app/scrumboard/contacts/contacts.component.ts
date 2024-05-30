import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatListModule } from '@angular/material/list';
import { DialogComponent } from '../dialog/dialog.component';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import {
  FormControl,
  FormGroupDirective,
  NgForm,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { environment } from '../../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    MatCardModule,
    MatDialogModule,
    MatInputModule,
    MatIconModule,
    FormsModule,
    CommonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatListModule,
    ReactiveFormsModule,
  ],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss',
})
export class ContactsComponent {
  contacts: any[] = [];
  detailView: boolean = false;
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  phone: number = 0;
  color: string = '';
  id: number = 0;

  constructor(private http: HttpClient, public dialog: MatDialog) {}

  /**
   * Initialization
   */
  ngOnInit() {
    this.getContacts();
  }

  /**
   * Fetches the list of contacts from the backend and sorts them.
   * Sends a GET request to the backend to retrieve contacts, then sorts the contacts alphabetically by last name.
   * Logs an error message if the request fails.
   */
  async getContacts() {
    try {
      const url = `${environment.baseUrl}/contacts/`;
      const response = await lastValueFrom(this.http.get<any[]>(url));
      this.contacts = this.sortContacts(response);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }

  /**
   * Sorts an array of contacts alphabetically by last name.
   * Compares the last names of contacts in a case-insensitive manner and sorts them in ascending order.
   * @param {any[]} contacts - The array of contacts to sort.
   */
  sortContacts(contacts: any[]): any[] {
    return contacts.sort((a, b) => {
      const nameA = a.last_name.toLowerCase();
      const nameB = b.last_name.toLowerCase();
      if (nameA < nameB) return -1;
      if (nameA > nameB) return 1;
      return 0;
    });
  }

  /**
   * Opens a dialog to add a new contact.
   * Opens a dialog for creating a new contact. After the dialog is closed, it checks
   * if a new contact was added and fetches the updated contact list.
   */
  addContact() {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: 'fit-content',
      height: 'fit-content',
      disableClose: true,
      autoFocus: false,
      data: {
        task: '',
        purpose: 'new-contact',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result == 'contact-added') {
        this.getContacts();
      }
    });
  }

  /**
   * Displays the details of a selected contact.
   * Sets the detail view to true and populates the contact details fields with the selected contact's information.
   * @param {any} contact - The contact whose information is to be displayed.
   */
  showContactInfo(contact: any) {
    this.detailView = true;
    this.firstName = contact.first_name;
    this.lastName = contact.last_name;
    this.email = contact.email;
    this.phone = contact.phone;
    this.color = contact.color;
    this.id = contact.id;
  }

  /**
   * Opens a dialog to confirm the deletion of a contact.
   * If the deletion is confirmed, it calls `confirmDeletion` to delete the contact.
   * @param {Event} event - The click event.
   * @param {any} contactId - The ID of the contact to delete.
   */
  deleteContact(event: Event, contactId: any) {
    event.stopPropagation();
    const dialogRef = this.dialog.open(DialogComponent, {
      width: 'fit-content',
      height: 'fit-content',
      disableClose: true,
      autoFocus: false,
      data: {
        task: contactId,
        purpose: 'delete-contact',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'confirmed') {
        this.confirmDeletion(contactId);
      }
    });
  }

  /**
   * Opens a dialog to edit a contact.
   * it checks if the contact was updated and calls `updateContact` with the updated data.
   *
   * @param {string} firstName - The first name of the contact.
   * @param {string} lastName - The last name of the contact.
   * @param {string} email - The email address of the contact.
   * @param {number} phone - The phone number of the contact.
   * @param {string} color - The color associated with the contact.
   * @param {number} id - The ID of the contact.
   */
  editContact(
    firstName: string,
    lastName: string,
    email: string,
    phone: number,
    color: string,
    id: number
  ) {
    const contact = { firstName, lastName, email, phone, color, id };
    const dialogRef = this.dialog.open(DialogComponent, {
      width: 'fit-content',
      height: 'fit-content',
      disableClose: true,
      autoFocus: false,
      data: {
        task: contact,
        purpose: 'edit-contact',
      },
    });
    dialogRef.afterClosed().subscribe((updatedData) => {
      if (updatedData) {
        this.updateContact(updatedData);
      }
    });
  }

  /**
   * Updates a contact on the backend.
   * Sends a PUT request to update the contact and fetches the updated contact list.
   * Logs an error message if the request fails.
   *
   * @param {any} contact - The contact to update.
   */
  async updateContact(contact: any) {
    try {
      const url = `${environment.baseUrl}/contacts/${contact.id}/`;
      await lastValueFrom(this.http.put(url, contact));
      this.getContacts();
      if (this.detailView) {
        this.showContactInfo(contact);
      }
    } catch (error) {
      console.error('Error updating contact:', error);
    }
  }

  /**
   * deleting a task by sending a delete request with the id
   */
  async confirmDeletion(contactId: any) {
    try {
      const url = `${environment.baseUrl}/contacts/${contactId}/`;
      await lastValueFrom(this.http.delete(url));
      this.getContacts();
      debugger;
      this.detailView = false;
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  }
}
