import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WasteOrderDeliveryComponent } from './waste-order-delivery.component';

describe('WasteOrderDeliveryComponent', () => {
  let component: WasteOrderDeliveryComponent;
  let fixture: ComponentFixture<WasteOrderDeliveryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WasteOrderDeliveryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WasteOrderDeliveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
