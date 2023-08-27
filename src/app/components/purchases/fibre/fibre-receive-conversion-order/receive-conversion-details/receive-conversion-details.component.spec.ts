import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiveConversionDetailsComponent } from './receive-conversion-details.component';

describe('ReceiveConversionDetailsComponent', () => {
  let component: ReceiveConversionDetailsComponent;
  let fixture: ComponentFixture<ReceiveConversionDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReceiveConversionDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ReceiveConversionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
