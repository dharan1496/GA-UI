import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProductionEntryComponent } from './add-production-entry.component';

describe('AddProductionEntryComponent', () => {
  let component: AddProductionEntryComponent;
  let fixture: ComponentFixture<AddProductionEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddProductionEntryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AddProductionEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
