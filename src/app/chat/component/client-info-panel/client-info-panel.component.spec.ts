import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientInfoPanelComponent } from './client-info-panel.component';
import { By } from '@angular/platform-browser';
import { MockTranslatePipe } from './mock-translate';
import { DatePipe, NgForOf, NgIf } from '@angular/common';

describe('ClientInfoPanelComponent', () => {
  let component: ClientInfoPanelComponent;
  let fixture: ComponentFixture<ClientInfoPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientInfoPanelComponent, MockTranslatePipe]
    })
      .overrideComponent(ClientInfoPanelComponent, {
        set: {
          imports: [NgIf, NgForOf, DatePipe, MockTranslatePipe]
        }
      })
      .compileComponents();

    fixture = TestBed.createComponent(ClientInfoPanelComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should render loading template if clientData is null', () => {
    component.clientData = null;
    fixture.detectChanges();

    const loadingEl = fixture.debugElement.query(By.css('p'));
    expect(loadingEl).toBeTruthy();
    expect(loadingEl.nativeElement.textContent).toContain('client-panel.loading');
  });
});

describe('Helper methods', () => {
  let component: ClientInfoPanelComponent;
  let fixture: ComponentFixture<ClientInfoPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientInfoPanelComponent, MockTranslatePipe]
    })
      .overrideComponent(ClientInfoPanelComponent, {
        set: {
          imports: [NgIf, NgForOf, DatePipe, MockTranslatePipe]
        }
      })
      .compileComponents();

    fixture = TestBed.createComponent(ClientInfoPanelComponent);
    component = fixture.componentInstance;
  });
  it('isPrimitive should return true for primitives', () => {
    expect(component.isPrimitive(null)).toBeTrue();
    expect(component.isPrimitive(undefined)).toBeTrue();
    expect(component.isPrimitive('string')).toBeTrue();
    expect(component.isPrimitive(123)).toBeTrue();
    expect(component.isPrimitive(true)).toBeTrue();
  });

  it('isPrimitive should return false for objects and arrays', () => {
    expect(component.isPrimitive({})).toBeFalse();
    expect(component.isPrimitive([])).toBeFalse();
  });

  it('isArray should return true only for arrays', () => {
    expect(component.isArray([])).toBeTrue();
    expect(component.isArray([1, 2, 3])).toBeTrue();

    expect(component.isArray('not an array')).toBeFalse();
    expect(component.isArray({ length: 3 })).toBeFalse();
  });

  it('isObject should return true only for non-null objects', () => {
    expect(component.isObject({})).toBeTrue();
    expect(component.isObject({ key: 'value' })).toBeTrue();

    expect(component.isObject(null)).toBeFalse();
    expect(component.isObject([1, 2, 3])).toBeFalse();
    expect(component.isObject('string')).toBeFalse();
    expect(component.isObject(42)).toBeFalse();
    expect(component.isObject(undefined)).toBeFalse();
  });
});
