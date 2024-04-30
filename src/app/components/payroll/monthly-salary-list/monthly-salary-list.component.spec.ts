import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlySalaryListComponent } from './monthly-salary-list.component';

describe('MonthlySalaryListComponent', () => {
  let component: MonthlySalaryListComponent;
  let fixture: ComponentFixture<MonthlySalaryListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MonthlySalaryListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MonthlySalaryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
