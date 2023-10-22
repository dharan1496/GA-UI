import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WasteMasterComponent } from './waste-master.component';

describe('WasteMasterComponent', () => {
  let component: WasteMasterComponent;
  let fixture: ComponentFixture<WasteMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WasteMasterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WasteMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
