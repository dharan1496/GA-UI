import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBlendComponent } from './add-blend.component';

describe('AddBlendComponent', () => {
  let component: AddBlendComponent;
  let fixture: ComponentFixture<AddBlendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddBlendComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AddBlendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
