import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectDcComponent } from './select-dc.component';

describe('SelectDcComponent', () => {
  let component: SelectDcComponent;
  let fixture: ComponentFixture<SelectDcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SelectDcComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectDcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
