import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintDeliveryInvoiceComponent } from './print-delivery-invoice.component';

describe('PrintDeliveryInvoiceComponent', () => {
  let component: PrintDeliveryInvoiceComponent;
  let fixture: ComponentFixture<PrintDeliveryInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PrintDeliveryInvoiceComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PrintDeliveryInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
