import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FibreSearchComponent } from './fibre-search.component';

describe('FibreSearchComponent', () => {
  let component: FibreSearchComponent;
  let fixture: ComponentFixture<FibreSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FibreSearchComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FibreSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
