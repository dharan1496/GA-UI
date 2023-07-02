import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FibreStockComponent } from './fibre-stock.component';

describe('FibreStockComponent', () => {
  let component: FibreStockComponent;
  let fixture: ComponentFixture<FibreStockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FibreStockComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FibreStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
