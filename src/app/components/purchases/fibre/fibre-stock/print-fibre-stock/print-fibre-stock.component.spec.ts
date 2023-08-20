import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintFibreStockComponent } from './print-fibre-stock.component';

describe('PrintFibreStockComponent', () => {
  let component: PrintFibreStockComponent;
  let fixture: ComponentFixture<PrintFibreStockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PrintFibreStockComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PrintFibreStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
