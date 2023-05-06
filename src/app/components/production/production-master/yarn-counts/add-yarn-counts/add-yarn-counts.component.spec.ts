import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddYarnCountsComponent } from './add-yarn-counts.component';

describe('AddYarnCountsComponent', () => {
  let component: AddYarnCountsComponent;
  let fixture: ComponentFixture<AddYarnCountsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddYarnCountsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AddYarnCountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
