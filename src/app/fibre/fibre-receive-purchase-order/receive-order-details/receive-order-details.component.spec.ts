import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiveOrderDetailsComponent } from './receive-order-details.component';

describe('ReceiveOrderDetailsComponent', () => {
  let component: ReceiveOrderDetailsComponent;
  let fixture: ComponentFixture<ReceiveOrderDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceiveOrderDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReceiveOrderDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
