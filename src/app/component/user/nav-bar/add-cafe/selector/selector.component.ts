import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Observable} from 'rxjs';
import {CategoryDto} from "../../../../../model/category.model";
import {CategoryService} from "../../../../../service/category.service";


@Component({
  selector: 'app-selector',
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.css']
})

export class SelectorComponent implements OnInit {
  categories: any;

  category: CategoryDto = new CategoryDto();

  @Output() addCategory = new EventEmitter();

  selectedType: string;

  constructor(private categoryService: CategoryService) {
  }

  ngOnInit() {
    this.categoryService.findAllCategory().subscribe(data => {
      this.categories = data;
    });
  }

  addTypeCategory = (term) => ({name: term});

  ev() {
    this.addCategory.emit(this.selectedType);
  }
}

