import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CloseProgramComponent } from './close-program.component';

describe('CloseProgramComponent', () => {
  let component: CloseProgramComponent;
  let fixture: ComponentFixture<CloseProgramComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CloseProgramComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CloseProgramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
