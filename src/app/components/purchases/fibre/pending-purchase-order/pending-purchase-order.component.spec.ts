import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingPurchaseOrderComponent } from './pending-purchase-order.component';

describe('PendingPurchaseOrderComponent', () => {
  let component: PendingPurchaseOrderComponent;
  let fixture: ComponentFixture<PendingPurchaseOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PendingPurchaseOrderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PendingPurchaseOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
