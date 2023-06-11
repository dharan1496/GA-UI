import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseOrderForDeliveryComponent } from './choose-order-for-delivery.component';

describe('ChooseOrderForDeliveryComponent', () => {
  let component: ChooseOrderForDeliveryComponent;
  let fixture: ComponentFixture<ChooseOrderForDeliveryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChooseOrderForDeliveryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ChooseOrderForDeliveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
