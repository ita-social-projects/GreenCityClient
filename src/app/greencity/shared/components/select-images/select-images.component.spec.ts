import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SelectImagesComponent } from './select-images.component';

describe('SelectImagesComponent', () => {
  let component: SelectImagesComponent;
  let fixture: ComponentFixture<SelectImagesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SelectImagesComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectImagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
