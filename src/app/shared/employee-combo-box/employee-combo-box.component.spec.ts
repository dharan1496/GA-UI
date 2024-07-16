import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeComboBoxComponent } from './employee-combo-box.component';

describe('EmployeeComboBoxComponent', () => {
  let component: EmployeeComboBoxComponent;
  let fixture: ComponentFixture<EmployeeComboBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmployeeComboBoxComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeComboBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
