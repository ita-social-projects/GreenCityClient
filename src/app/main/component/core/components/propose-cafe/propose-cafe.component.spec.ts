import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProposeCafeComponent } from './propose-cafe.component';
import { OpeningHours } from '../../../../model/openingHours.model';
import { PlaceAddDto } from '../../../../model/placeAddDto.model';
import { CategoryDto } from '../../../../model/category.model';
import { LocationDto } from '../../../../model/locationDto.model';
import { WeekDays } from '../../../../model/weekDays.model';
import { TranslateModule } from '@ngx-translate/core';
import { PlaceWithUserModel } from '../../../../model/placeWithUser.model';
import { ModalService } from './_modal/modal.service';
import { CategoryService } from '../../../../service/category.service';
import { UserService } from '../../../../service/user/user.service';
import { FormBuilder, NgForm } from '@angular/forms';
import { NgSelectComponent } from '@ng-select/ng-select';
import { MapsAPILoader, MouseEvent } from '@agm/core';
import { PlaceService } from '../../../../service/place/place.service';
import { BreakTimes } from '../../../../model/breakTimes.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { SpecificationService } from '../../../../service/specification.service';
import { DiscountDto } from '../../../../model/discount/DiscountDto';
import { SpecificationNameDto } from '../../../../model/specification/SpecificationNameDto';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { Photo } from '../../../../model/photo/photo';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';
import { routes } from 'src/app/app-routing.module';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HomepageComponent, TipsListComponent } from 'src/app/main/component/home/components';
// import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
// import { MapsAPILoader, MouseEvent } from '@agm/core';
import { MainComponent } from 'src/app/main/main.component';
import { SearchAllResultsComponent } from 'src/app/main/component/layout/components';
import { ConfirmRestorePasswordComponent } from '@global-auth/index';
// import { UbsAdminComponent } from 'src/app/ubs-admin/ubs-admin/ubs-admin.component';
import { FormArray, FormControl, FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ChangeDetectorRef } from '@angular/core';
import { UbsSidebarComponent } from 'src/app/ubs-admin/components/ubs-sidebar/ubs-sidebar.component';

describe('ProposeCafeComponent', () => {
  let component: ProposeCafeComponent;
  let fixture: ComponentFixture<ProposeCafeComponent>;
  let http: HttpTestingController;
  let PlaceServiceMock: PlaceService;
  let CategoryServiceMock: CategoryService;
  let SpecificationServiceMock: SpecificationService;
  let cdref: ChangeDetectorRef;
  CategoryServiceMock = jasmine.createSpyObj('CategoryService', ['findAllCategory']);

  let category = new CategoryDto();
  category.name = 'namecategory';

  CategoryServiceMock.findAllCategory = () => of(category);

  SpecificationServiceMock = jasmine.createSpyObj('SpecificationService', ['findAllSpecification']);

  const specification = new SpecificationNameDto();
  specification.name = 'nameOfSpecification';

  SpecificationServiceMock.findAllSpecification = () => of([specification]);

  PlaceServiceMock = jasmine.createSpyObj('PlaceService', [
    'getFilteredPlaces',
    'save',
    'getPlaceInfo',
    'getFavoritePlaceInfo',
    'getPlacesByStatus',
    'updatePlaceStatus',
    'bulkUpdatePlaceStatuses',
    'delete',
    'bulkDelete',
    'getStatuses',
    'filterByRegex',
    'getPlaceByID',
    'updatePlace'
  ]);

  const FirestoreStub = {
    collection: (name: string) => ({
      doc: (_id: string) => ({
        valueChanges: () => {},
        set: (_d: any) => new Promise((resolve, _reject) => true)
      })
    })
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ProposeCafeComponent,
        HomepageComponent,
        MainComponent,
        TipsListComponent,
        SearchAllResultsComponent,
        ConfirmRestorePasswordComponent,
        UbsSidebarComponent
      ],
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        RouterTestingModule.withRoutes(routes),
        FormsModule,
        ReactiveFormsModule,
        MatSnackBarModule
      ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} },
        { provide: PlaceService, useValue: PlaceServiceMock },
        { provide: CategoryService, useValue: CategoryServiceMock },
        {
          provide: MapsAPILoader,
          useValue: {
            load: jasmine.createSpy('load').and.returnValue(new Promise(() => true))
          }
        },
        MatSnackBarComponent,
        MatSnackBar,
        NgSelectComponent,
        FormBuilder,
        { provide: AngularFirestore, useValue: FirestoreStub },
        { provide: AngularFireStorage, useValue: {} }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProposeCafeComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProposeCafeComponent);
    fixture.detectChanges();
    component = fixture.componentInstance;
    fixture.detectChanges();
    http = TestBed.get(HttpTestingController);
  });

  fit('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  fit('should addDiscountAndSpecification', () => {
    const name: string = 'name of specification';
    const number: number = 3;
    component.addDiscountAndSpecification(name, number);
    expect(component.discountValues.length).toEqual(1);
    expect(component.discountValues[0].specification.name).toEqual(name);
    expect(component.discountValues[0].value).toEqual(number);
  });
});
