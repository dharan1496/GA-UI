import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectYarnStockComponent } from './select-yarn-stock.component';

describe('SelectYarnStockComponent', () => {
  let component: SelectYarnStockComponent;
  let fixture: ComponentFixture<SelectYarnStockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SelectYarnStockComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectYarnStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
