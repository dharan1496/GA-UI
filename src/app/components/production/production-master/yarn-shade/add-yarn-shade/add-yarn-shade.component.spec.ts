import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddYarnShadeComponent } from './add-yarn-shade.component';

describe('AddYarnShadeComponent', () => {
  let component: AddYarnShadeComponent;
  let fixture: ComponentFixture<AddYarnShadeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddYarnShadeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AddYarnShadeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
