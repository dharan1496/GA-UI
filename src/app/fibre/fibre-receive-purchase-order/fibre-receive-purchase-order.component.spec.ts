import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FibreReceivePurchaseOrderComponent } from './fibre-receive-purchase-order.component';

describe('FibreReceivePurchaseOrderComponent', () => {
  let component: FibreReceivePurchaseOrderComponent;
  let fixture: ComponentFixture<FibreReceivePurchaseOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FibreReceivePurchaseOrderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FibreReceivePurchaseOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
