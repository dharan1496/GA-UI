import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionMasterComponent } from './production-master.component';

describe('ProductionMasterComponent', () => {
  let component: ProductionMasterComponent;
  let fixture: ComponentFixture<ProductionMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductionMasterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductionMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
