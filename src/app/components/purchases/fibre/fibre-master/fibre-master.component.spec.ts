import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FibreMasterComponent } from './fibre-master.component';

describe('FibreMasterComponent', () => {
  let component: FibreMasterComponent;
  let fixture: ComponentFixture<FibreMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FibreMasterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FibreMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
