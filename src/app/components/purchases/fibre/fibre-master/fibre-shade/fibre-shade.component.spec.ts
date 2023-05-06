import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FibreShadeComponent } from './fibre-shade.component';

describe('FibreShadeComponent', () => {
  let component: FibreShadeComponent;
  let fixture: ComponentFixture<FibreShadeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FibreShadeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FibreShadeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
