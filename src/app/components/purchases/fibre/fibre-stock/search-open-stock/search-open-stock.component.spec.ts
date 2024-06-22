import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchOpenStockComponent } from './search-open-stock.component';

describe('SearchOpenStockComponent', () => {
  let component: SearchOpenStockComponent;
  let fixture: ComponentFixture<SearchOpenStockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SearchOpenStockComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchOpenStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
