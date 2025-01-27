import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SavedSectionComponent } from './saved-section.component';
import { Router, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

describe('SavedSectionComponent', () => {
  let component: SavedSectionComponent;
  let fixture: ComponentFixture<SavedSectionComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockActivatedRoute: any;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockActivatedRoute = {
      queryParams: of({
        isBookmark: 'true',
        section: 'events'
      })
    };

    await TestBed.configureTestingModule({
      declarations: [SavedSectionComponent],
      imports: [TranslateModule.forRoot()],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SavedSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set isBookmark$ and currentTab based on query params', () => {
      expect(component.currentTab).toBe('events');
      expect(component.isSavedVisible).toBeTrue();
    });
  });

  describe('ngOnDestroy', () => {
    it('should complete destroy$ subject', () => {
      const destroySpy = spyOn(component['destroy$'], 'next').and.callThrough();
      const completeSpy = spyOn(component['destroy$'], 'complete').and.callThrough();

      component.ngOnDestroy();

      expect(destroySpy).toHaveBeenCalled();
      expect(completeSpy).toHaveBeenCalled();
    });
  });

  describe('navigateToSaved', () => {
    it('should navigate to the correct section and emit tabChange', () => {
      const tabChangeSpy = spyOn(component.tabChange, 'emit');

      component.navigateToSaved('places');

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/places'], {
        queryParams: { isBookmark: true, section: 'places' }
      });
      expect(component.currentTab).toBe('places');
      expect(tabChangeSpy).toHaveBeenCalledWith('places');
    });
  });

  describe('default inputs and outputs', () => {
    it('should have default tabs and defaultTab values', () => {
      expect(component.tabs).toEqual([
        { key: 'news', label: 'homepage.saved.eco-news' },
        { key: 'events', label: 'homepage.saved.events' },
        { key: 'places', label: 'homepage.saved.places' }
      ]);
      expect(component.defaultTab).toBe('news');
    });

    it('should emit tabChange when navigateToSaved is called', () => {
      const spy = spyOn(component.tabChange, 'emit');
      component.navigateToSaved('events');
      expect(spy).toHaveBeenCalledWith('events');
    });
  });
});
