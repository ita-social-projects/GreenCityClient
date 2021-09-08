import { FormsModule } from '@angular/forms';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { SocialNetworksComponent } from './social-networks.component';
import { WarningPopUpComponent } from '@shared/components';
import { of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

class MatDialogMock {
  open() {
    return {
      afterClosed: () => of(true)
    };
  }
}

describe('SocialNetworksComponent', () => {
  let component: SocialNetworksComponent;
  let fixture: ComponentFixture<SocialNetworksComponent>;
  let dialog: MatDialogMock;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SocialNetworksComponent, WarningPopUpComponent],
      imports: [TranslateModule.forRoot(), FormsModule],
      providers: [{ provide: MatDialog, useClass: MatDialogMock }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SocialNetworksComponent);
    component = fixture.componentInstance;
    dialog = TestBed.get(MatDialog);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('tests of main functions', () => {
    beforeEach(() => {
      component.socialNetworks = [
        {
          url: 'https://www.facebook.com/',
          socialNetworkImage: ''
        }
      ];
    });

    it('should replace https/http from string', () => {
      expect(component.replaceHttp('https://www.facebook.com/')).toBe('www.facebook.com/');
      expect(component.replaceHttp('http://www.facebook.com/')).toBe('www.facebook.com/');
    });

    it('check if string is url', () => {
      // @ts-ignore
      expect(component.checkIsUrl('https://www.facebook.com/')).toBeTruthy();
      // @ts-ignore
      expect(component.checkIsUrl('www.facebook.com')).toBeFalsy();
    });

    it('Check for existing url', () => {
      // @ts-ignore
      expect(component.onCheckForExisting('https://www.facebook.com/')).toBeTruthy();
      // @ts-ignore
      expect(component.onCheckForExisting('https://www.pinterest.com/')).toBeFalsy();
    });

    it('Should add link to arr', () => {
      component.onAddLink('https://www.pinterest.com/');
      // @ts-ignore
      expect(component.socialNetworks.length).toBe(2);
    });

    it('Should add link to arr', () => {
      component.inputTextValue = 'https://www.pinterest.com/';
      component.onAddLink();
      // @ts-ignore
      expect(component.socialNetworks.length).toBe(2);
    });

    it('Should delete link', () => {
      component.onDeleteLink({ url: 'https://www.facebook.com/' });
      spyOn(dialog, 'open').and.callThrough();
      // @ts-ignore

      expect(component.socialNetworks.length).toBe(0);
    });

    it('Should delete link on edit and add it to input', () => {
      component.onEditLink({ url: 'https://www.facebook.com/' });
      // @ts-ignore
      expect(component.inputTextValue).toBe('https://www.facebook.com/');
    });

    it('Should change input visibility state', () => {
      component.showInput = true;
      component.onToggleInput();
      // @ts-ignore
      expect(component.showInput).toBeFalsy();
    });

    it('Should return default image', () => {
      expect(
        component.getSocialImage({
          url: 'https://www.facebook.com/',
          socialNetworkImage: {
            imagePath: ''
          }
        })
      ).toBeTruthy();
    });

    it('Should onCloseForm', () => {
      component.editedSocialLink = true;
      spyOn(component, 'onAddLink').and.returnValue();
      component.onCloseForm();
      expect(component.editedSocialLink).toBeFalsy();
    });

    it('Should return error message', () => {
      const mockError = { pattern: { test: 1 } };
      expect(component.getErrorMessage(mockError)).toMatch('pattern');
    });
  });
});
