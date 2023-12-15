import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { TranslateModule } from '@ngx-translate/core';

import { ExtraPackagesPopUpComponent } from './extra-packages-pop-up.component';

describe('ExtraPackagesPopUpComponent', () => {
  let component: ExtraPackagesPopUpComponent;
  let fixture: ComponentFixture<ExtraPackagesPopUpComponent>;
  const fakeMatDialogRef = jasmine.createSpyObj(['close']);

  beforeEach(waitForAsync(() => {
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
