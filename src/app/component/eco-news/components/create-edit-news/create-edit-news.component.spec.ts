import { DragAndDropComponent } from './../../../shared/components/drag-and-drop/drag-and-drop.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PostNewsLoaderComponent } from '../post-news-loader/post-news-loader.component';
import { CreateEditNewsComponent } from './create-edit-news.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ImageCropperModule } from 'ngx-image-cropper';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { ACTION_CONFIG, ACTION_TOKEN } from './action.constants';


describe('CreateEditNewsComponent', () => {
  let component: CreateEditNewsComponent;
  let fixture: ComponentFixture<CreateEditNewsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CreateEditNewsComponent, PostNewsLoaderComponent, DragAndDropComponent],
      imports: [
        TranslateModule.forRoot(),
        FormsModule,
        ReactiveFormsModule,
        ImageCropperModule,
        RouterTestingModule,
        HttpClientModule,
        MatDialogModule
      ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} },
        { provide: ACTION_TOKEN, useValue: ACTION_CONFIG}
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEditNewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
