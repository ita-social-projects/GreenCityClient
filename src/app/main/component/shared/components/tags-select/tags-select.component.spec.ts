import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TagsSelectComponent } from './tags-select.component';

describe('TagsSelectComponent', () => {
  let component: TagsSelectComponent;
  let fixture: ComponentFixture<TagsSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TagsSelectComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagsSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
