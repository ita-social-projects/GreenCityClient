import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { ClientInfoPanelComponent } from './client-info-panel.component';

describe('ClientInfoPanelComponent', () => {
  let component: ClientInfoPanelComponent;
  let fixture: ComponentFixture<ClientInfoPanelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ClientInfoPanelComponent]
    });
    fixture = TestBed.createComponent(ClientInfoPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Helper Methods', () => {
    it('isPrimitive should return true for primitives', () => {
      expect(component.isPrimitive(null)).toBeTrue();
      expect(component.isPrimitive(undefined)).toBeTrue();
      expect(component.isPrimitive('test')).toBeTrue();
      expect(component.isPrimitive(42)).toBeTrue();
      expect(component.isPrimitive(true)).toBeTrue();
    });

    it('isPrimitive should return false for objects and arrays', () => {
      expect(component.isPrimitive({})).toBeFalse();
      expect(component.isPrimitive([])).toBeFalse();
    });

    it('isArray should correctly detect arrays', () => {
      expect(component.isArray([1, 2, 3])).toBeTrue();
      expect(component.isArray('not-array')).toBeFalse();
      expect(component.isArray({ length: 2 })).toBeFalse();
    });

    it('isObject should correctly detect plain objects', () => {
      expect(component.isObject({ key: 'value' })).toBeTrue();
    });

    it('isObject should return false for arrays and primitives', () => {
      expect(component.isObject([1, 2])).toBeFalse();
      expect(component.isObject(null)).toBeFalse();
      expect(component.isObject('string')).toBeFalse();
      expect(component.isObject(42)).toBeFalse();
    });

    it('objectKeys should return object keys', () => {
      const obj = { a: 1, b: 2 };
      expect(component.objectKeys(obj)).toEqual(['a', 'b']);
    });
  });
});
