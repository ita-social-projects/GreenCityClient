import { Component, OnInit } from '@angular/core';
import { CardModel } from "../../models/card.model";

@Component({
  selector: 'profile-cards',
  templateUrl: './profile-cards.component.html',
  styleUrls: ['./profile-cards.component.scss']
})
export class ProfileCardsComponent implements OnInit {

  constructor() { }
  public cardsData: Array<CardModel> = [
    {
      id: 1,
      title: 'Fact of the Day',
      description: 'Adipisicing magna occaecat aliquip magna cillum cupidatat est laborum aliqua do consectetur.',
      backgroundColor: '#13AA57'
    },
    {
      id: 2,
      title: 'Dear Friend',
      description: 'Adipisicing magna occaecat aliquip magna cillum cupidatat est laborum aliqua do consectetur.',
      backgroundColor: '#5200FF'
    },
    {
      id: 3,
      title: 'Dear Friend',
      description: 'Adipisicing magna occaecat aliquip magna cillum cupidatat est laborum aliqua do consectetur.',
      backgroundColor: '#FFC100'
    }
  ];

  ngOnInit() {}

}
