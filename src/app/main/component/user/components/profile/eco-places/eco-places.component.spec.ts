import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { EcoPlacesComponent } from './eco-places.component';
import { BehaviorSubject, of, Subscription } from 'rxjs';
import { ProfileService } from '@global-user/components/profile/profile-service/profile.service';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { TranslateModule } from '@ngx-translate/core';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'correctUnit' })
export class MockCorrectUnitPipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    return value;
  }
}

describe('EcoPlacesComponent', () => {
  let component: EcoPlacesComponent;
  let fixture: ComponentFixture<EcoPlacesComponent>;
  let mockProfileService: jasmine.SpyObj<ProfileService>;
  let mockLocalStorageService: jasmine.SpyObj<LocalStorageService>;

  beforeEach(waitForAsync(() => {
    mockProfileService = jasmine.createSpyObj<ProfileService>(['getEcoPlaces']);
    mockLocalStorageService = jasmine.createSpyObj<LocalStorageService>(['languageBehaviourSubject']);

    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [EcoPlacesComponent, MockCorrectUnitPipe],
      providers: [
        { provide: ProfileService, useValue: mockProfileService },
        { provide: LocalStorageService, useValue: mockLocalStorageService }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EcoPlacesComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get eco places on init', () => {
    mockProfileService.getEcoPlaces.and.returnValue(of([]));
    mockLocalStorageService.languageBehaviourSubject = new BehaviorSubject('en');
    fixture.detectChanges();

    expect(component.ecoPlaces).toEqual([]);
    expect(component.currentLang).toEqual('en');
  });

  it('should unsubscribe on destroy', () => {
    component.subscription = new Subscription();
    const unsubscribeSpy = spyOn(component.subscription, 'unsubscribe');
    component.ngOnDestroy();
    expect(unsubscribeSpy).toHaveBeenCalled();
  });

  it('should unsubscribe from subscriptions on component destruction', () => {
    const mockSubscription = new Subscription();
    spyOn(mockSubscription, 'unsubscribe');
    component.subscription = mockSubscription;
    fixture.destroy();
    expect(mockSubscription.unsubscribe).toHaveBeenCalled();
  });
});
