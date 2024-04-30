import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintSalarySummaryComponent } from './print-salary-summary.component';

describe('PrintSalarySummaryComponent', () => {
  let component: PrintSalarySummaryComponent;
  let fixture: ComponentFixture<PrintSalarySummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PrintSalarySummaryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PrintSalarySummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
