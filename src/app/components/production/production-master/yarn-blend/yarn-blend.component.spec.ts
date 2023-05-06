import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YarnBlendComponent } from './yarn-blend.component';

describe('YarnBlendComponent', () => {
  let component: YarnBlendComponent;
  let fixture: ComponentFixture<YarnBlendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [YarnBlendComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(YarnBlendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
