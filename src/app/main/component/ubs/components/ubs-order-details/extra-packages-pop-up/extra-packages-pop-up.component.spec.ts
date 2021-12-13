import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';

import { ExtraPackagesPopUpComponent } from './extra-packages-pop-up.component';

describe('ExtraPackagesPopUpComponent', () => {
  let component: ExtraPackagesPopUpComponent;
  let fixture: ComponentFixture<ExtraPackagesPopUpComponent>;
  const fakeMatDialogRef = jasmine.createSpyObj(['close']);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [ExtraPackagesPopUpComponent],
      providers: [{ provide: MatDialogRef, useValue: fakeMatDialogRef }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtraPackagesPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('method closeModal should invoke destroyRef.close()', () => {
    component.closeModal();
    expect(fakeMatDialogRef.close).toHaveBeenCalled();
  });
});
