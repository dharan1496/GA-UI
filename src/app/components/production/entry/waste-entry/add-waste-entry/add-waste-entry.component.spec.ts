import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWasteEntryComponent } from './add-waste-entry.component';

describe('AddWasteEntryComponent', () => {
  let component: AddWasteEntryComponent;
  let fixture: ComponentFixture<AddWasteEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddWasteEntryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AddWasteEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
