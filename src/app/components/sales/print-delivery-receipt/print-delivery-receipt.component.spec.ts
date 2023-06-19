import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintDeliveryReceiptComponent } from './print-delivery-receipt.component';

describe('PrintDeliveryReceiptComponent', () => {
  let component: PrintDeliveryReceiptComponent;
  let fixture: ComponentFixture<PrintDeliveryReceiptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PrintDeliveryReceiptComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PrintDeliveryReceiptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
