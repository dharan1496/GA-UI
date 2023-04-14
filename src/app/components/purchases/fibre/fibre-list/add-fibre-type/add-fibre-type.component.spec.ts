import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFibreTypeComponent } from './add-fibre-type.component';

describe('AddFibreTypeComponent', () => {
  let component: AddFibreTypeComponent;
  let fixture: ComponentFixture<AddFibreTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddFibreTypeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AddFibreTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
