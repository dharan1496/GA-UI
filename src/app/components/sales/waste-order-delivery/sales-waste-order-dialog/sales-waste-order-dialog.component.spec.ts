import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesWasteOrderDialogComponent } from './sales-waste-order-dialog.component';

describe('SalesWasteOrderDialogComponent', () => {
  let component: SalesWasteOrderDialogComponent;
  let fixture: ComponentFixture<SalesWasteOrderDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SalesWasteOrderDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SalesWasteOrderDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
