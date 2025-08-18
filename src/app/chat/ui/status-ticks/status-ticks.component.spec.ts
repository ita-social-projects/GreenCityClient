import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StatusTicksComponent } from './status-ticks.component';

describe('StatusTicksComponent', () => {
  let fixture: ComponentFixture<StatusTicksComponent>;
  let component: StatusTicksComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatusTicksComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(StatusTicksComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('renders nothing when status is undefined', () => {
    component.status = undefined;
    fixture.detectChanges();

    const span = fixture.nativeElement.querySelector('.status-ticks');
    expect(span).toBeNull();
  });

  it('UNREAD: shows single-tick icon and no ".read" class', () => {
    component.status = 'UNREAD';
    fixture.detectChanges();

    const span: HTMLElement = fixture.nativeElement.querySelector('.status-ticks');
    expect(span).withContext('container should exist').toBeTruthy();
    expect(span.classList.contains('read')).toBeFalse();

    const unreadImg = fixture.nativeElement.querySelector('img.tick-icon[alt="unread"]');
    expect(unreadImg).toBeTruthy();

    const viewedImg = fixture.nativeElement.querySelector('img.read-tick-icon[alt="viewed"]');
    expect(viewedImg).toBeNull();
  });

  it('VIEWED: shows double-tick icon and applies ".read" class', () => {
    component.status = 'VIEWED';
    fixture.detectChanges();

    const span: HTMLElement = fixture.nativeElement.querySelector('.status-ticks');
    expect(span).withContext('container should exist').toBeTruthy();
    expect(span.classList.contains('read')).toBeTrue();

    const viewedImg = fixture.nativeElement.querySelector('img.read-tick-icon[alt="viewed"]');
    expect(viewedImg).toBeTruthy();

    const unreadImg = fixture.nativeElement.querySelector('img.tick-icon[alt="unread"]');
    expect(unreadImg).toBeNull();
  });

  it('toggles correctly from UNREAD → VIEWED', () => {
    component.status = 'UNREAD';
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('img.tick-icon')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('img.read-tick-icon')).toBeNull();

    component.status = 'VIEWED';
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('img.tick-icon')).toBeNull();
    expect(fixture.nativeElement.querySelector('img.read-tick-icon')).toBeTruthy();
  });
});
