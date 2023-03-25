import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MaterialModule } from 'src/app/material.module';
import { PrintFibrePOService } from './print.fibre-po.service';

@Component({
  selector: 'app-print-fibre-po',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './print-fibre-po.component.html',
  styleUrls: ['./print-fibre-po.component.scss']
})
export class PrintFibrePOComponent {
  constructor(public printFibreService: PrintFibrePOService) {}

}
