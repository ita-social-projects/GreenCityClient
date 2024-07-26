/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DeletingProfileReasonPopUpComponent } from './deleting-profile-reason-pop-up.component';

describe('DeletingProfileReasonPopUpComponent', () => {
  let component: DeletingProfileReasonPopUpComponent;
  let fixture: ComponentFixture<DeletingProfileReasonPopUpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DeletingProfileReasonPopUpComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeletingProfileReasonPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
