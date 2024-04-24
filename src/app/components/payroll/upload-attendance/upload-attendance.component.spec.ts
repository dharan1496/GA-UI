import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadAttendanceComponent } from './upload-attendance.component';

describe('UploadAttendanceComponent', () => {
  let component: UploadAttendanceComponent;
  let fixture: ComponentFixture<UploadAttendanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UploadAttendanceComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UploadAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
