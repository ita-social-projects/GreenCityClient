import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UbsAdminEditHomepageComponent } from './ubs-admin-edit-homepage.component';
import { of, Subject } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { THomepageContent } from '@ubs/ubs-admin/models/homepage-settings.interface';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SpinnerComponent } from '../../../../../shared/components/spinner/spinner.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AdminHomepageSettingsService } from '@ubs/ubs-admin/services/admin-homepage-settings/admin-homepage-settings.service';
import { TranslateModule } from '@ngx-translate/core';
import { QuillModule } from 'ngx-quill';

describe('UbsAdminEditHomepageComponent', () => {
  let component: UbsAdminEditHomepageComponent;
  let fixture: ComponentFixture<UbsAdminEditHomepageComponent>;
  let adminHomepageSettingsServiceMock: any;
  let dialogMock: any;
  let afterClosed$: Subject<boolean>;

  const mockHomepageContent: THomepageContent = {
    uk: {
      how_works: {
        working_hours_caption: 'x',
        route_caption: 'x',
        working_hours: 'x',
        route: 'x'
      },
      header: {
        caption: 'x',
        content: 'x'
      },
      preparing: {
        caption: 'x',
        step_01: 'x'
      },
      rules: {
        caption: 'x',
        content: 'x'
      },
      bonuses: {
        caption: 'x',
        content: 'x'
      },
      price: {
        caption_steps: 'x'
      }
    },
    en: {
      how_works: {
        working_hours_caption: 'x',
        route_caption: 'x',
        working_hours: 'x',
        route: 'x'
      },
      header: {
        caption: 'x',
        content: 'x'
      },
      preparing: {
        caption: 'x',
        step_01: 'x'
      },
      rules: {
        caption: 'x',
        content: 'x'
      },
      bonuses: {
        caption: 'x',
        content: 'x'
      },
      price: {
        caption_steps: 'x'
      }
    },
    section: ['HOW_WORKS']
  };

  beforeEach(async () => {
    afterClosed$ = new Subject<boolean>();
    adminHomepageSettingsServiceMock = {
      getHomepageContent: jasmine.createSpy('getHomepageContent').and.returnValue(of(mockHomepageContent)),
      updateHomepageContent: jasmine.createSpy('updateHomepageContent').and.returnValue(of({}))
    };
    dialogMock = {
      open: jasmine.createSpy('open').and.returnValue({
        afterClosed: () => afterClosed$.asObservable()
      })
    };

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatDialogModule,
        HttpClientTestingModule,
        MatProgressSpinnerModule,
        TranslateModule.forRoot(),
        QuillModule.forRoot()
      ],
      declarations: [UbsAdminEditHomepageComponent, SpinnerComponent],
      providers: [
        { provide: AdminHomepageSettingsService, useValue: adminHomepageSettingsServiceMock },
        { provide: MatDialog, useValue: dialogMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UbsAdminEditHomepageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should load homepage content on init', () => {
    expect(adminHomepageSettingsServiceMock.getHomepageContent).toHaveBeenCalled();
    expect(component.isLoading).toBeFalse();
    expect(component.homepageContent).toEqual(mockHomepageContent);
  });

  it('should initialize form with homepage content', () => {
    component.initForm();
    const control = component.getFormControl('Uk', 'how_works', 'working_hours_caption');
    expect(control?.value).toBeFalsy();
  });

  it('should toggle collapse view', () => {
    const initial = component.isCollapsed;
    component.collapseView();
    expect(component.isCollapsed).toBe(!initial);
  });

  it('should detect content changes correctly', () => {
    component.homepageContent = mockHomepageContent;
    const newContent = structuredClone(mockHomepageContent);
    newContent.uk.how_works.working_hours_caption = 'changed';
    const changes = component.getContentChanges(newContent);
    expect(changes['how_works'][0].field).toBe('working_hours_caption');
  });

  it('should open dialog and publish changes on confirm', () => {
    spyOn(component, 'publishChanges');
    component.onSave();
    afterClosed$.next(true);
    afterClosed$.complete();
    expect(dialogMock.open).toHaveBeenCalled();
    expect(component.publishChanges).toHaveBeenCalled();
  });

  it('should call updateHomepageContent for each changed section', () => {
    component.homepageContent = mockHomepageContent;
    const newContent = structuredClone(mockHomepageContent);
    newContent.uk.rules.caption = 'changed';
    component.publishChanges(newContent);
    expect(adminHomepageSettingsServiceMock.updateHomepageContent).toHaveBeenCalled();
  });
});
