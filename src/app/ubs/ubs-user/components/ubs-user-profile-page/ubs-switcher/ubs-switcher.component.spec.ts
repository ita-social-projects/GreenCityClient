import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { UbsSwitcherComponent } from './ubs-switcher.component';
import { EventEmitter } from '@angular/core';

describe('UbsSwitcherComponent', () => {
  let component: UbsSwitcherComponent;
  let fixture: ComponentFixture<UbsSwitcherComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [UbsSwitcherComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsSwitcherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('displayChecked getter', () => {
    it('should return true when isChecked is true', () => {
      component.isChecked = true;
      expect(component.displayChecked).toBe(true);
    });

    it('should return false when isChecked is false', () => {
      component.isChecked = false;
      expect(component.displayChecked).toBe(false);
    });

    it('should return undefined when isChecked is not set', () => {
      component.isChecked = undefined;
      expect(component.displayChecked).toBeUndefined();
    });
  });

  describe('onChange method', () => {
    it('should emit true when checkbox is checked', () => {
      component.isChecked = false;
      spyOn(component.switchChanged, 'emit');

      const mockCheckbox = { checked: true } as HTMLInputElement;
      const mockEvent = { target: mockCheckbox } as unknown as Event;

      component.onChange(mockEvent);

      expect(component.switchChanged.emit).toHaveBeenCalledWith(true);
    });

    it('should emit false when checkbox is unchecked', () => {
      component.isChecked = true;
      spyOn(component.switchChanged, 'emit');

      const mockCheckbox = { checked: false } as HTMLInputElement;
      const mockEvent = { target: mockCheckbox } as unknown as Event;

      component.onChange(mockEvent);

      expect(component.switchChanged.emit).toHaveBeenCalledWith(false);
    });

    it('should reset checkbox.checked to isChecked value', () => {
      component.isChecked = true;

      const mockCheckbox = { checked: false } as HTMLInputElement;
      const mockEvent = { target: mockCheckbox } as unknown as Event;

      component.onChange(mockEvent);

      expect(mockCheckbox.checked).toBe(true);
    });

    it('should handle event when isChecked is false', () => {
      component.isChecked = false;
      spyOn(component.switchChanged, 'emit');

      const mockCheckbox = { checked: true } as HTMLInputElement;
      const mockEvent = { target: mockCheckbox } as unknown as Event;

      component.onChange(mockEvent);

      expect(mockCheckbox.checked).toBe(false);
      expect(component.switchChanged.emit).toHaveBeenCalledWith(true);
    });

    it('should cast event.target to HTMLInputElement', () => {
      component.isChecked = false;

      const mockCheckbox = { checked: true } as HTMLInputElement;
      const mockEvent = { target: mockCheckbox } as unknown as Event;

      expect(() => component.onChange(mockEvent)).not.toThrow();
    });
  });

  describe('Input properties', () => {
    it('should accept isChecked input', () => {
      component.isChecked = true;
      expect(component.isChecked).toBe(true);
    });

    it('should accept isEditing input', () => {
      component.isEditing = true;
      expect(component.isEditing).toBe(true);
    });
  });

  describe('Output properties', () => {
    it('should have switchChanged EventEmitter', () => {
      expect(component.switchChanged).toBeDefined();
      expect(component.switchChanged instanceof EventEmitter).toBe(true);
    });
  });

  it('should handle null event.target gracefully', () => {
    component.isChecked = false;
    spyOn(component.switchChanged, 'emit');

    const mockEvent = { target: null } as unknown as Event;

    expect(() => component.onChange(mockEvent)).toThrow();
  });

  it('should handle undefined event.target gracefully', () => {
    component.isChecked = false;
    spyOn(component.switchChanged, 'emit');

    const mockEvent = {} as Event;

    expect(() => component.onChange(mockEvent)).toThrow();
  });

  it('should work when isChecked is undefined', () => {
    component.isChecked = undefined;
    spyOn(component.switchChanged, 'emit');

    const mockCheckbox = { checked: true } as HTMLInputElement;
    const mockEvent = { target: mockCheckbox } as unknown as Event;

    component.onChange(mockEvent);

    expect(mockCheckbox.checked).toBe(undefined);
    expect(component.switchChanged.emit).toHaveBeenCalledWith(true);
  });

  it('should handle event with null target and undefined isChecked', () => {
    component.isChecked = undefined;
    const mockEvent = { target: null } as unknown as Event;

    expect(() => component.onChange(mockEvent)).toThrow();
  });
});
