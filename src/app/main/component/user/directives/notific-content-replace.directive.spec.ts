import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificContentReplaceDirective } from './notific-content-replace.directive';

@Component({
  template: `<p appNotificContentReplace [replacements]="notification"></p>`
})
class TestComponent {
  notification = null;
}

describe('NotificContentReplaceDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let paragrEl: HTMLElement;
  let component: TestComponent;

  const notification = {
    actionUserId: null,
    actionUserText: 'testUser',
    bodyText: 'test texts',
    message: 'test message',
    notificationId: 5,
    notificationType: 'Eco_NEWS',
    projectName: 'GreeCity',
    secondMessage: 'secondMessageTest',
    secondMessageId: 'secondMessageId',
    targetId: null,
    time: '',
    titleText: 'test title',
    viewed: false
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent, NotificContentReplaceDirective]
    });

    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    component = fixture.componentInstance;
    paragrEl = fixture.nativeElement.querySelector('p');
  });

  it('should use body text when there are no property to set', () => {
    component.notification = notification;
    fixture.detectChanges();
    expect(paragrEl.textContent).toBe('test texts');
  });

  it('should change text content', () => {
    component.notification = { ...notification, ...{ bodyText: 'commented event {message}' } };
    fixture.detectChanges();
    expect(paragrEl.textContent).toBe('commented event test message');
    expect(paragrEl.innerHTML).toBe('commented event test message');
  });

  it('should add property value to the content and ancor tag', () => {
    component.notification = { ...notification, ...{ bodyText: '{user} commented event {message}', actionUserId: 2 } };
    fixture.detectChanges();
    expect(paragrEl.textContent).toBe('testUser commented event test message');
    expect(paragrEl.innerHTML).toBe(`<a data-userid="2">testUser</a> commented event test message`);
  });
});
