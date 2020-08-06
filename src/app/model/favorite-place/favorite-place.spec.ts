import { FavoritePlace } from './favorite-place';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';


describe('UserComponent', () => {
  let component: FavoritePlace;
  let fixture: ComponentFixture<FavoritePlace>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FavoritePlace ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FavoritePlace);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
