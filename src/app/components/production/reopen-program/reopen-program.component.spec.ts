import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReopenProgramComponent } from './reopen-program.component';

describe('ReopenProgramComponent', () => {
  let component: ReopenProgramComponent;
  let fixture: ComponentFixture<ReopenProgramComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReopenProgramComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ReopenProgramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
