import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlacesListComponent } from './places-list.component';

describe('PlacesListComponent', () => {
  let component: PlacesListComponent;
  let fixture: ComponentFixture<PlacesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PlacesListComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlacesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
