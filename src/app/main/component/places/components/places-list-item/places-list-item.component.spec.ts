import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlacesListItemComponent } from './places-list-item.component';

describe('PlacesListItemComponent', () => {
  let component: PlacesListItemComponent;
  let fixture: ComponentFixture<PlacesListItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PlacesListItemComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlacesListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
