import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateWasteStockComponent } from './create-waste-stock.component';

describe('CreateWasteStockComponent', () => {
  let component: CreateWasteStockComponent;
  let fixture: ComponentFixture<CreateWasteStockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateWasteStockComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateWasteStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
