import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchProductionComponent } from './search-production.component';

describe('SearchProductionComponent', () => {
  let component: SearchProductionComponent;
  let fixture: ComponentFixture<SearchProductionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SearchProductionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchProductionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
