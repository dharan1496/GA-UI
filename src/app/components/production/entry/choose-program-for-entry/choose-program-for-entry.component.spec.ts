import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseProgramForEntryComponent } from './choose-program-for-entry.component';

describe('ChooseProgramForEntryComponent', () => {
  let component: ChooseProgramForEntryComponent;
  let fixture: ComponentFixture<ChooseProgramForEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChooseProgramForEntryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ChooseProgramForEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
