import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-replies-list',
  templateUrl: './replies-list.component.html',
  styleUrls: ['./replies-list.component.scss']
})
export class RepliesListComponent implements OnInit {
  @Input() public repliesList;

  constructor() { }

  ngOnInit() {
  }

}
