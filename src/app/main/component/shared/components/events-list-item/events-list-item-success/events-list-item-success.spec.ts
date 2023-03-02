import { EventsListItemSuccessComponent } from './events-list-item-success';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Injector, Injectable } from '@angular/core';
import { TestBed, async, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';

describe('EventsListItemSuccessComponent', () => {
  let component: EventsListItemSuccessComponent;
  let fixture: ComponentFixture<EventsListItemSuccessComponent>;

  const MockBsModalRef = jasmine.createSpyObj('bsModalRef', ['hide']);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EventsListItemSuccessComponent],
      providers: [{ provide: BsModalRef, useValue: MockBsModalRef }],
      imports: [MatDialogModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventsListItemSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('modalBtn', () => {
    it(`should be called on click`, fakeAsync(() => {
      spyOn(component, 'modalBtn');
      const button = fixture.debugElement.nativeElement.querySelector('button:nth-child(2)');
      button.click();
      tick();
      expect(component.modalBtn).toHaveBeenCalled();
    }));

    it(`should be clicked and closed modal`, fakeAsync(() => {
      const closeBtn = fixture.debugElement.nativeElement.querySelector('button:nth-child(1)');
      closeBtn.click();
      tick();
      expect(MockBsModalRef.hide).toHaveBeenCalled();
    }));

    it(`should be called on click and hide the previous modal`, () => {
      component.modalBtn();
      expect(MockBsModalRef.hide).toHaveBeenCalled();
    });

    it(`should be called on click and open the auth modal`, () => {
      component.isRegistered = false;
      spyOn(component, 'openAuthModalWindow').withArgs('sign-in');
      jasmine.clock().install();
      component.modalBtn();
      jasmine.clock().tick(500);
      expect(component.openAuthModalWindow).toHaveBeenCalled();
      jasmine.clock().uninstall();
    });
  });
});
