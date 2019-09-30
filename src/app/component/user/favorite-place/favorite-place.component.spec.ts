import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoritePlaceComponent } from './favorite-place.component';

describe('FavoritePlaceComponent', () => {
  let component: FavoritePlaceComponent;
  let fixture: ComponentFixture<FavoritePlaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FavoritePlaceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FavoritePlaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
