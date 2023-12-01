import { TranslateModule } from '@ngx-translate/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UBSOrderFormComponent } from './ubs-order-form.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChangeDetectorRef, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatStepperModule } from '@angular/material/stepper';
import { Store } from '@ngrx/store';
import { ubsOrderServiseMock } from 'src/app/ubs/mocks/order-data-mock';
import { of } from 'rxjs';

describe('UBSOrderFormComponent ', () => {
  let component: UBSOrderFormComponent;
  let fixture: ComponentFixture<UBSOrderFormComponent>;

  const storeMock = jasmine.createSpyObj('Store', ['select', 'dispatch']);
  storeMock.select.and.returnValue(of({ order: ubsOrderServiseMock }));

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, MatStepperModule, TranslateModule.forRoot(), BrowserAnimationsModule],
      declarations: [UBSOrderFormComponent],
      providers: [{ provide: Store, useValue: storeMock }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UBSOrderFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('function onClose should return false', () => {
    expect(component.onClose()).toBeTruthy();
  });

  it('ngDoCheck should correctly change completed property', () => {
    component.stepper.selected.state = 'finalStep';
    fixture.detectChanges();
    expect(component.completed).toBeTruthy();
  });

  it('detects changes', () => {
    const changeDetectorRef = fixture.debugElement.injector.get(ChangeDetectorRef);
    const detectChangesSpy = spyOn(changeDetectorRef.constructor.prototype, 'detectChanges');

    component.ngAfterViewInit();

    expect(detectChangesSpy).toHaveBeenCalled();
  });
});
