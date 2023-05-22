import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YarnRecoveryComponent } from './yarn-recovery.component';

describe('YarnRecoveryComponent', () => {
  let component: YarnRecoveryComponent;
  let fixture: ComponentFixture<YarnRecoveryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [YarnRecoveryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(YarnRecoveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
