import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlendMismatchComponent } from './blend-mismatch.component';

describe('BlendMismatchComponent', () => {
  let component: BlendMismatchComponent;
  let fixture: ComponentFixture<BlendMismatchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BlendMismatchComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BlendMismatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
