import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WasteStockDialogComponent } from './waste-stock-dialog.component';

describe('WasteStockDialogComponent', () => {
  let component: WasteStockDialogComponent;
  let fixture: ComponentFixture<WasteStockDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WasteStockDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WasteStockDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
