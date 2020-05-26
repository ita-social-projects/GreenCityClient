import { Component, OnInit } from '@angular/core';

@Component({
  selector: "app-profile-progress",
  templateUrl: "./profile-progress.component.html",
  styleUrls: ["./profile-progress.component.scss"],
})
export class ProfileProgressComponent implements OnInit {
  progress = [
    { id: 1, name: "acquired habits", quantity: 3 },
    { id: 2, name: "habits in progress", quantity: 4 },
    { id: 3, name: "written articles", quantity: 23 },
    { id: 4, name: "published news", quantity: 9 },
  ];
  
  constructor() {}

  ngOnInit() {}
}
