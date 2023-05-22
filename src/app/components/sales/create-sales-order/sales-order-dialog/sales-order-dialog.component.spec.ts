import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesOrderDialogComponent } from './sales-order-dialog.component';

describe('SalesOrderDialogComponent', () => {
  let component: SalesOrderDialogComponent;
  let fixture: ComponentFixture<SalesOrderDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SalesOrderDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SalesOrderDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
