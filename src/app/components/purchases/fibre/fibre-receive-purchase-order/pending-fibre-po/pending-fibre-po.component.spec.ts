import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingFibrePoComponent } from './pending-fibre-po.component';

describe('PendingFibrePoComponent', () => {
  let component: PendingFibrePoComponent;
  let fixture: ComponentFixture<PendingFibrePoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PendingFibrePoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PendingFibrePoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
