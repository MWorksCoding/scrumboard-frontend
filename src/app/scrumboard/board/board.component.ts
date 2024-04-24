import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import {MatDialogModule, MatDialog,} from '@angular/material/dialog';
import { FormControl, FormGroupDirective, NgForm, FormsModule, ReactiveFormsModule, } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [MatIconModule, MatCardModule, MatDialogModule, MatButtonModule, RouterOutlet, RouterLink, RouterLinkActive, MatTableModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss'
})
export class BoardComponent {
  dataSource = ''

  constructor(public dialog: MatDialog) {}


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
}
