import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FibrePurchaseOrderComponent } from './fibre-purchase-order.component';

describe('FibrePurchaseOrderComponent', () => {
  let component: FibrePurchaseOrderComponent;
  let fixture: ComponentFixture<FibrePurchaseOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FibrePurchaseOrderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FibrePurchaseOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
