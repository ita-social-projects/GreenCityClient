import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { HabitsGalleryViewComponent } from './habits-gallery-view.component';


describe('HabitsGalleryViewComponent', () => {
  let component: HabitsGalleryViewComponent;
  let fixture: ComponentFixture<HabitsGalleryViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HabitsGalleryViewComponent ],
      imports: [
        TranslateModule.forRoot()
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HabitsGalleryViewComponent);
    component = fixture.componentInstance;
    component.habit = {
      image: './',
      habitTranslation: {
        habitItem: 'test',
        name: 'test',
        description: 'test'
      }
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
