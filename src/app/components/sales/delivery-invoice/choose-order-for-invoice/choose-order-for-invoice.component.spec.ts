import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseOrderForInvoiceComponent } from './choose-order-for-invoice.component';

describe('ChooseOrderForInvoiceComponent', () => {
  let component: ChooseOrderForInvoiceComponent;
  let fixture: ComponentFixture<ChooseOrderForInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChooseOrderForInvoiceComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ChooseOrderForInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
