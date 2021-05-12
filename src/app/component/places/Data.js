let redIcon = 'assets/img/places/red-marker.png';

export let cards = [
  {
    id: 0,
    cardName: 'Hotel Lviv',
    cardAddress: 'Hotel address, №123',
    cardText: 'this is Hotel Lviv',
    cardImgUrl: 'assets/img/places/place_lviv-hotel.png',
    cardRating: 0.3,
    favorite: 'assets/img/places/bookmark-default.svg'
  },
  {
    id: 1,
    cardName: 'Magnus',
    cardAddress: 'magnus address',
    cardText: 'this is Magnus',
    cardImgUrl: 'assets/img/places/place_magnus.png',
    cardRating: 0.5,
    favorite: 'assets/img/places/bookmark-default.svg'
  },
  {
    id: 2,
    cardName: 'McDonalds',
    cardAddress: 'mac address, №123',
    cardText: 'this is McDonalds',
    cardImgUrl: 'assets/img/places/place_McDonalds.png',
    cardRating: 0,
    favorite: 'assets/img/places/bookmark-default.svg'
  },
  {
    id: 3,
    cardName: 'KFC',
    cardAddress: 'KFC address, №123',
    cardText: 'this is KFC',
    cardImgUrl: 'assets/img/places/place_KFC.png',
    cardRating: 0.9,
    favorite: 'assets/img/places/bookmark-default.svg'
  },
  {
    id: 4,
    cardName: 'Staff',
    cardAddress: 'Staff address, №123',
    cardText: 'this is Staff',
    cardImgUrl: 'assets/img/places/place_staff.png',
    cardRating: 1,
    favorite: 'assets/img/places/bookmark-default.svg'
  }
];

export let markers = [
  {
    lat: 49.84579876141749,
    lng: 24.025125288060412,
    iconUrl: redIcon,
    card: cards[0]
  },
  {
    lat: 49.84423766639821,
    lng: 24.02405838813841,
    iconUrl: redIcon,
    card: cards[1]
  },
  {
    lat: 49.842959399097296,
    lng: 24.026151152038356,
    iconUrl: redIcon,
    card: cards[2]
  },
  {
    lat: 49.841649695791766,
    lng: 24.026889537979542,
    iconUrl: redIcon,
    card: cards[3]
  },
  {
    lat: 49.83929345961723,
    lng: 24.025845314617513,
    iconUrl: redIcon,
    card: cards[4]
  }
];
