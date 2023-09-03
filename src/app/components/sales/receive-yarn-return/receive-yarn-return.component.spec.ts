import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiveYarnReturnComponent } from './receive-yarn-return.component';

describe('ReceiveYarnReturnComponent', () => {
  let component: ReceiveYarnReturnComponent;
  let fixture: ComponentFixture<ReceiveYarnReturnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReceiveYarnReturnComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ReceiveYarnReturnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
