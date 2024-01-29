import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FibreReceivedOrderSearchComponent } from './fibre-received-order-search.component';

describe('FibreReceivedOrderSearchComponent', () => {
  let component: FibreReceivedOrderSearchComponent;
  let fixture: ComponentFixture<FibreReceivedOrderSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FibreReceivedOrderSearchComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FibreReceivedOrderSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
