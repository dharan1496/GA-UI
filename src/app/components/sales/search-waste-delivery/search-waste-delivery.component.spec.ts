import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchWasteDeliveryComponent } from './search-waste-delivery.component';

describe('SearchWasteDeliveryComponent', () => {
  let component: SearchWasteDeliveryComponent;
  let fixture: ComponentFixture<SearchWasteDeliveryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SearchWasteDeliveryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchWasteDeliveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
