import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartyComboBoxComponent } from './party-combo-box.component';

describe('PartyComboBoxComponent', () => {
  let component: PartyComboBoxComponent;
  let fixture: ComponentFixture<PartyComboBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PartyComboBoxComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PartyComboBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
