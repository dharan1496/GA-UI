import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseDeliveryForReturnComponent } from './choose-delivery-for-return.component';

describe('ChooseDeliveryForReturnComponent', () => {
  let component: ChooseDeliveryForReturnComponent;
  let fixture: ComponentFixture<ChooseDeliveryForReturnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChooseDeliveryForReturnComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ChooseDeliveryForReturnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
