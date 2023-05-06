import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFibreShadeComponent } from './add-fibre-shade.component';

describe('AddFibreShadeComponent', () => {
  let component: AddFibreShadeComponent;
  let fixture: ComponentFixture<AddFibreShadeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddFibreShadeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AddFibreShadeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
