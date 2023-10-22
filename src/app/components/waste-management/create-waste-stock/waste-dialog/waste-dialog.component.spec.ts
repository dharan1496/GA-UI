import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WasteDialogComponent } from './waste-dialog.component';

describe('WasteDialogComponent', () => {
  let component: WasteDialogComponent;
  let fixture: ComponentFixture<WasteDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WasteDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WasteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
