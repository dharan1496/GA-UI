import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FibreOpenStockComponent } from './fibre-open-stock.component';

describe('FibreOpenStockComponent', () => {
  let component: FibreOpenStockComponent;
  let fixture: ComponentFixture<FibreOpenStockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FibreOpenStockComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FibreOpenStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
