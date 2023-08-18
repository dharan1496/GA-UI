import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWasteComponent } from './add-waste.component';

describe('AddWasteComponent', () => {
  let component: AddWasteComponent;
  let fixture: ComponentFixture<AddWasteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddWasteComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AddWasteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
