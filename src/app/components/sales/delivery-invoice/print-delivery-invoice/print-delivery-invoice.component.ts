import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component } from '@angular/core';
import { MaterialModule } from 'src/app/material.module';
import { InvoiceDts } from 'src/app/models/invoiceDts';
import { PrintService } from 'src/app/services/print.service';
import { ToWords } from 'to-words';

@Component({
  selector: 'app-print-delivery-invoice',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './print-delivery-invoice.component.html',
  styleUrls: ['./print-delivery-invoice.component.scss'],
})
export class PrintDeliveryInvoiceComponent {
  now = new Date();
  words!: ToWords;

  constructor(
    public printService: PrintService,
    private currencyPipe: CurrencyPipe
  ) {
    this.words = new ToWords();
  }

  getTotalQty() {
    return this.printService.yarnInvoice.invoiceDts.reduce(
      (prev, curr) => prev + curr.invoiceQty,
      0
    );
  }

  getAmount() {
    return this.printService.yarnInvoice.invoiceDts.reduce(
      (prev, curr) => prev + curr.invoiceQty * curr.rate,
      0
    );
  }

  getTotalAmount() {
    return this.printService.yarnInvoice.invoiceDts.reduce(
      (prev, curr) =>
        prev +
        (curr.invoiceQty * curr.rate +
          (curr.invoiceQty * curr.rate * curr.gstPercent) / 100),
      0
    );
  }

  getTotalWords() {
    return this.words.convert(this.getTotalAmount(), { currency: true });
  }

  getTaxWords() {
    return this.words.convert(this.getTaxAmount(), { currency: true });
  }

  getTaxAmount() {
    return this.printService.yarnInvoice?.invoiceDts
      .map(
        (data: InvoiceDts) =>
          (data?.rate * data?.invoiceQty * data?.gstPercent) / 100
      )
      .reduce((acc: number, value: number) => acc + value, 0);
  }

  getRoundTotal() {
    return Math.round(this.getTotalAmount());
  }

  getRoundOffAmount() {
    const roundOff = this.getRoundTotal() - this.getTotalAmount();
    if (roundOff < 0) {
      return `- ${this.currencyPipe.transform(Math.abs(roundOff), 'INR')}`;
    }
    if (roundOff > 0) {
      return `+ ${this.currencyPipe.transform(roundOff, 'INR')}`;
    }
    return this.currencyPipe.transform(roundOff, 'INR');
  }
}
