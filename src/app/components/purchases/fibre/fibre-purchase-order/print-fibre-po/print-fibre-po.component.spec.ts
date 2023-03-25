import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintFibrePOComponent } from './print-fibre-po.component';

describe('PrintFibrePOComponent', () => {
  let component: PrintFibrePOComponent;
  let fixture: ComponentFixture<PrintFibrePOComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintFibrePOComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrintFibrePOComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
