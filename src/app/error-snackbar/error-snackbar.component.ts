import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { MaterialModule } from '../material.module';

@Component({
  selector: 'app-error-snackbar',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './error-snackbar.component.html',
  styleUrls: ['./error-snackbar.component.scss']
})
export class ErrorSnackbarComponent {

  constructor(@Inject(MAT_SNACK_BAR_DATA) public message: any) {}

}
