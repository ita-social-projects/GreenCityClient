import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  constructor() { }

  cardsData: any[] = [
    {
      title: 'Fact of the Day',
      description: 'Adipisicing magna occaecat aliquip magna cillum cupidatat est laborum aliqua do consectetur.',
      backgroundColor: '#13AA57'
    },
    {
      title: 'Dear Friend',
      description: 'Adipisicing magna occaecat aliquip magna cillum cupidatat est laborum aliqua do consectetur.',
      backgroundColor: '#5200FF'
    },
    {
      title: 'Dear Friend',
      description: 'Adipisicing magna occaecat aliquip magna cillum cupidatat est laborum aliqua do consectetur.',
      backgroundColor: '#FFC100'
    }
  ];

  ngOnInit() {
  }

}
