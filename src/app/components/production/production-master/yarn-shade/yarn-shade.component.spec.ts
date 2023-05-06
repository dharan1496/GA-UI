import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YarnShadeComponent } from './yarn-shade.component';

describe('YarnShadeComponent', () => {
  let component: YarnShadeComponent;
  let fixture: ComponentFixture<YarnShadeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [YarnShadeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(YarnShadeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
