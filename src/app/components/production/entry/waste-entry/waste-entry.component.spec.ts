import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WasteEntryComponent } from './waste-entry.component';

describe('WasteEntryComponent', () => {
  let component: WasteEntryComponent;
  let fixture: ComponentFixture<WasteEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WasteEntryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WasteEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
