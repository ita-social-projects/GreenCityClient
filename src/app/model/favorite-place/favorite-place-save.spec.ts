import {FavoritePlaceSave} from './favorite-place-save';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';


describe('UserComponent', () => {
  let component: FavoritePlaceSave;
  let fixture: ComponentFixture<FavoritePlaceSave>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FavoritePlaceSave ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FavoritePlaceSave);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
