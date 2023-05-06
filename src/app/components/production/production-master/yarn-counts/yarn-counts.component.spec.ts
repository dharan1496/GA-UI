import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YarnCountsComponent } from './yarn-counts.component';

describe('YarnCountsComponent', () => {
  let component: YarnCountsComponent;
  let fixture: ComponentFixture<YarnCountsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [YarnCountsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(YarnCountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
