import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectImagesComponent } from './select-images.component';

describe('SelectImagesComponent', () => {
  let component: SelectImagesComponent;
  let fixture: ComponentFixture<SelectImagesComponent>;

  beforeEach(async(() => {
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
