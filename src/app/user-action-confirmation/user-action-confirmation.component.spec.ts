import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserActionConfirmationComponent } from './user-action-confirmation.component';

describe('UserActionConfirmationComponent', () => {
  let component: UserActionConfirmationComponent;
  let fixture: ComponentFixture<UserActionConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserActionConfirmationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserActionConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
