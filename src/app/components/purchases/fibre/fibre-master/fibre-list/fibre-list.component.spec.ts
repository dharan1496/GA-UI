import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FibreListComponent } from './fibre-list.component';

describe('FibreListComponent', () => {
  let component: FibreListComponent;
  let fixture: ComponentFixture<FibreListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FibreListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FibreListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
