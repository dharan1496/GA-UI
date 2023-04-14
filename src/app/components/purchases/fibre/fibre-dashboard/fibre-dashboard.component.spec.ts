import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FibreDashboardComponent } from './fibre-dashboard.component';

describe('FibreDashboardComponent', () => {
  let component: FibreDashboardComponent;
  let fixture: ComponentFixture<FibreDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FibreDashboardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FibreDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
