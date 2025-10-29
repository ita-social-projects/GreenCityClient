import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { of } from 'rxjs';

import { ConfirmationDialogComponent } from '@ubs/ubs-admin/components/shared/components/confirmation-dialog/confirmation-dialog.component';
import { TTelegramBotMessage, TTransformedBotData } from '@ubs/ubs-admin/models/telegram-bot-responses.interface';
import { AdminTelegramBotResponseService } from '@ubs/ubs-admin/services/admin-edit-telegram-bot/admin-edit-telegram-bot.service';
import { SpinnerComponent } from 'src/app/shared/components/spinner/spinner.component';
import { UbsAdminEditTelegramBotComponent } from './ubs-admin-edit-telegram-bot.component';
import { TranslateModule } from '@ngx-translate/core';

xdescribe('UbsAdminEditTelegramBotComponent', () => {
  const mockApiMessages: TTelegramBotMessage[] = [
    { id: 1, lang: 'en', messageType: 'ADMISSION_RULES_TEXT', text: 'English Welcome' },
    { id: 2, lang: 'en', messageType: 'FAREWELL', text: 'English Farewell' },
    { id: 3, lang: 'uk', messageType: 'ADMISSION_RULES_TEXT', text: 'Ukrainian Welcome' },
    { id: 4, lang: 'uk', messageType: 'FAREWELL', text: 'Ukrainian Farewell' }
  ];

  const mockApiResponse = { currentPage: 0, totalElements: 15, totalPages: 15, page: mockApiMessages };

  const mockTransformedData: TTransformedBotData = {
    en: {
      ADMISSION_RULES_TEXT: {
        message: { text: 'English Welcome', id: 1 }
      },
      FAREWELL: {
        message: { text: 'English Farewell', id: 2 }
      }
    },
    uk: {
      ADMISSION_RULES_TEXT: {
        message: { text: 'Ukrainian Welcome', id: 3 }
      },
      FAREWELL: {
        message: { text: 'Ukrainian Farewell', id: 4 }
      }
    }
  };

  let component: UbsAdminEditTelegramBotComponent;
  let fixture: ComponentFixture<UbsAdminEditTelegramBotComponent>;
  let mockTelegramBotService: jasmine.SpyObj<AdminTelegramBotResponseService>;
  let mockMatDialog: jasmine.SpyObj<MatDialog>;

  beforeEach(() => {
    mockTelegramBotService = jasmine.createSpyObj<AdminTelegramBotResponseService>('AdminTelegramBotResponseService', [
      'getTelegramBotResponses',
      'updateTelegramBotResponses'
    ]);
    mockTelegramBotService.getTelegramBotResponses.and.returnValue(of(mockApiResponse));
    mockTelegramBotService.updateTelegramBotResponses.and.returnValue(of());

    mockMatDialog = jasmine.createSpyObj('MatDialog', ['open']);
    mockMatDialog.open.and.returnValue({ afterClosed: () => of(true) } as any);

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, TranslateModule.forRoot()],
      declarations: [UbsAdminEditTelegramBotComponent, SpinnerComponent, ConfirmationDialogComponent, MatProgressSpinner],
      providers: [
        { provide: AdminTelegramBotResponseService, useValue: mockTelegramBotService },
        { provide: MatDialog, useValue: mockMatDialog }
      ]
    });

    fixture = TestBed.createComponent(UbsAdminEditTelegramBotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    mockTelegramBotService.getTelegramBotResponses.calls.reset();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load, transform, and set up the form on init', () => {
    expect(component.isLoading).toBe(false);
    expect(component.telegramResponsesContent).toEqual(mockTransformedData);
    expect(component.telegramResponsesContentForm.get('ENWELCOMEmessage')).toBeTruthy();
    expect(component.getFormControl('EN', 'WELCOME', 'message').value).toBe('English Welcome');
    expect(component.getFormControl('UK', 'FAREWELL', 'message').value).toBe('Ukrainian Farewell');
  });

  describe('getTelegramContent', () => {
    it('should fetch data, build form, and stop loading', () => {
      component.isLoading = true;
      mockTelegramBotService.getTelegramBotResponses.and.returnValue(of(mockApiResponse));

      component.getTelegramContent();

      expect(mockTelegramBotService.getTelegramBotResponses).toHaveBeenCalled();
      expect(component.isLoading).toBe(false);
      expect(component.getFormControl('EN', 'WELCOME', 'message').value).toBe('English Welcome');
    });

    it('should handle empty API response', () => {
      component.isLoading = true;
      mockTelegramBotService.getTelegramBotResponses.and.returnValue(of({ currentPage: 0, totalElements: 0, totalPages: 0, page: [] }));

      component.getTelegramContent();

      expect(mockTelegramBotService.getTelegramBotResponses).toHaveBeenCalled();
      expect(component.isLoading).toBe(false);
      expect(component.telegramResponsesContent).toEqual({ en: {}, uk: {} });
      expect(Object.keys(component.telegramResponsesContentForm.controls).length).toBe(0);
    });

    it('should handle null API response', () => {
      component.isLoading = true;
      mockTelegramBotService.getTelegramBotResponses.and.returnValue(of(null as any));

      component.getTelegramContent();

      expect(component.isLoading).toBe(false);
      expect(component.telegramResponsesContent).toEqual({ en: {}, uk: {} });
    });
  });

  describe('responseToForm', () => {
    it('should correctly transform API messages to form data structure', () => {
      const messages = mockApiMessages;

      const result = component['responseToForm'](messages);

      expect(result).toEqual(mockTransformedData);
    });

    it('should handle empty messages array', () => {
      const messages: TTelegramBotMessage[] = [];
      const result = component['responseToForm'](messages);
      expect(result).toEqual({ en: {}, uk: {} });
    });

    it('should skip invalid message data', () => {
      const invalidMessages = [
        { id: 1, lang: 'EN', messageType: 'WELCOME', text: 'Valid' },
        { id: 2, lang: 'UK', messageType: 'GREETING' }
      ] as any;
      spyOn(console, 'error');

      const result = component['responseToForm'](invalidMessages);

      expect(result.en.WELCOME.message.text).toBe('Valid');
      expect(result.uk.GREETING).toBeUndefined();
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('onSave', () => {
    it('should mark form as touched and return if invalid', () => {
      component.getFormControl('EN', 'WELCOME', 'message').setValue(''); // Makes form invalid
      const markAllAsTouchedSpy = spyOn(component.telegramResponsesContentForm, 'markAllAsTouched');

      component.onSave();

      expect(markAllAsTouchedSpy).toHaveBeenCalled();
      expect(mockMatDialog.open).not.toHaveBeenCalled();
    });

    it('should open confirmation dialog if form is valid', () => {
      component.onSave();

      expect(mockMatDialog.open).toHaveBeenCalledWith(ConfirmationDialogComponent, component['confirmSaveData']);
    });

    it('should not call publishChanges if dialog is cancelled', () => {
      mockMatDialog.open.and.returnValue({ afterClosed: () => of(false) } as any);
      const publishSpy = spyOn(component, 'publishChanges');

      component.onSave();

      expect(mockMatDialog.open).toHaveBeenCalled();
      expect(publishSpy).not.toHaveBeenCalled();
    });

    it('should call publishChanges with updated data if dialog is confirmed', () => {
      mockMatDialog.open.and.returnValue({ afterClosed: () => of(true) } as any);
      const publishSpy = spyOn(component, 'publishChanges').and.callThrough();

      const newText = 'New English Welcome';
      component.getFormControl('EN', 'WELCOME', 'message').setValue(newText);

      component.onSave();

      expect(mockMatDialog.open).toHaveBeenCalled();
      expect(publishSpy).toHaveBeenCalled();

      const expectedData = structuredClone(mockTransformedData);
      expectedData.en.WELCOME.message.text = newText;
      expect(publishSpy).toHaveBeenCalledWith(expectedData);
    });
  });

  describe('publishChanges', () => {
    it('should only call update for changed fields and refetch on success', () => {
      const newContent = structuredClone(mockTransformedData);
      newContent.en.WELCOME.message.text = 'A new value';
      newContent.uk.FAREWELL.message.text = 'A different new value';

      component.publishChanges(newContent);

      expect(component.isLoading).toBe(false);
      expect(mockTelegramBotService.updateTelegramBotResponses).toHaveBeenCalledTimes(2);
      expect(mockTelegramBotService.updateTelegramBotResponses).toHaveBeenCalledWith(1, 'A new value');
      expect(mockTelegramBotService.updateTelegramBotResponses).toHaveBeenCalledWith(4, 'A different new value');

      expect(mockTelegramBotService.getTelegramBotResponses).toHaveBeenCalledTimes(1);
    });

    it('should not call update or refetch if no changes are made', () => {
      const sameContent = structuredClone(mockTransformedData);
      mockTelegramBotService.updateTelegramBotResponses.calls.reset();

      component.publishChanges(sameContent);

      expect(component.isLoading).toBe(false);
      expect(mockTelegramBotService.updateTelegramBotResponses).not.toHaveBeenCalled();
      expect(mockTelegramBotService.getTelegramBotResponses).not.toHaveBeenCalled();
    });

    it('should handle errors during update', () => {
      const newContent = structuredClone(mockTransformedData);
      newContent.en.WELCOME.message.text = 'A new value';
      mockTelegramBotService.updateTelegramBotResponses.and.returnValue(of(new Error('Update failed') as any));
      spyOn(console, 'error');

      component.publishChanges(newContent);

      expect(mockTelegramBotService.updateTelegramBotResponses).toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledWith('Error during updates:', jasmine.any(Error));

      expect(mockTelegramBotService.getTelegramBotResponses).not.toHaveBeenCalled();
    });
  });

  describe('collapseView', () => {
    it('should toggle isCollapsed property', () => {
      component.isCollapsed = true;
      component.collapseView();
      expect(component.isCollapsed).toBe(false);
      component.collapseView();
      expect(component.isCollapsed).toBe(true);
    });
  });
});
