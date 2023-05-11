import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DiscardEventChangesComponent } from './discard-event-changes.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { compileComponentFromMetadata } from '@angular/compiler';

describe('DiscardEventChangesComponent', () => {
  let component: DiscardEventChangesComponent;
  let fixture: ComponentFixture<DiscardEventChangesComponent>;
  let MatDialogMock: MatDialogRef<DiscardEventChangesComponent>;

  MatDialogMock = jasmine.createSpyObj('MatDialogRef', ['close']);
  MatDialogMock.close = () => true;

  const matDialogData = {
    parameter: false
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DiscardEventChangesComponent],
      providers: [
        { provide: MatDialogRef, useValue: { MatDialogMock } },
        { provide: MAT_DIALOG_DATA, useValue: { matDialogData } }
      ],
      imports: [],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscardEventChangesComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close popup', () => {
    const spy = spyOn(component, 'continueEditing');
    component.continueEditing(true);
    expect(spy).toHaveBeenCalled;
  });
});
