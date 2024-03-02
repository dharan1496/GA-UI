import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CloseReopenFibreComponent } from './close-reopen-fibre.component';

describe('CloseReopenFibreComponent', () => {
  let component: CloseReopenFibreComponent;
  let fixture: ComponentFixture<CloseReopenFibreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CloseReopenFibreComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CloseReopenFibreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
