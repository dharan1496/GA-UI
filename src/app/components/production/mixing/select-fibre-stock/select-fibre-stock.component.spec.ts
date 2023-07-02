import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectFibreStockComponent } from './select-fibre-stock.component';

describe('FibreStockComponent', () => {
  let component: SelectFibreStockComponent;
  let fixture: ComponentFixture<SelectFibreStockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SelectFibreStockComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectFibreStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
