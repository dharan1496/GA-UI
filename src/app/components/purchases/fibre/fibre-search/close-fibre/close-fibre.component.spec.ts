import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CloseFibreComponent } from './close-fibre.component';

describe('CloseFibreComponent', () => {
  let component: CloseFibreComponent;
  let fixture: ComponentFixture<CloseFibreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CloseFibreComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CloseFibreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
