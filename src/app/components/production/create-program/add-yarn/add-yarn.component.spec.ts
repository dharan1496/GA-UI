import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddYarnComponent } from './add-yarn.component';

describe('AddYarnComponent', () => {
  let component: AddYarnComponent;
  let fixture: ComponentFixture<AddYarnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddYarnComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AddYarnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
