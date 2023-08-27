import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FibreReceiveConversionOrderComponent } from './fibre-receive-conversion-order.component';

describe('FibreReceiveConversionOrderComponent', () => {
  let component: FibreReceiveConversionOrderComponent;
  let fixture: ComponentFixture<FibreReceiveConversionOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FibreReceiveConversionOrderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FibreReceiveConversionOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
