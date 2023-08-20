import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintRecoveryDetailsComponent } from './print-recovery-details.component';

describe('PrintRecoveryDetailsComponent', () => {
  let component: PrintRecoveryDetailsComponent;
  let fixture: ComponentFixture<PrintRecoveryDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PrintRecoveryDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PrintRecoveryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
