import { Component } from '@angular/core';

@Component({
  selector: 'app-ubs-admin-employee',
  templateUrl: './ubs-admin-employee.component.html',
  styleUrls: ['./ubs-admin-employee.component.scss']
})
export class UbsAdminEmployeeComponent {
  fakeData = [
    {
      name: 'Богдан-Ігор',
      surname: 'Антонович-Барський',
      phoneNumber: '+380931123344',
      email: 'avety_longname_andsurname@example.com',
      role: ['Менеджер послуги', 'Менеджер обдзвону'],
      location: ['Саперно-Слобідська', 'Петрівка'],
      image: 'assets/img/profile/achievements/achievement-1.png'
    },
    {
      name: 'Jake',
      surname: 'Jhonson',
      phoneNumber: '+380931123344',
      email: 'avety_longname_andsurname@example.com',
      role: ['Philologist', 'very long be here'],
      location: ['Ivano-Frankivsk', 'Petrivka city']
    },
    {
      name: 'Kohn',
      surname: 'Deeer',
      phoneNumber: '+380931123344',
      email: 'vasiDeeertefanyk@example.com',
      role: ['Philologist', 'very must be here'],
      location: ['Ivano-Frankivsk', 'Petrivka city']
    },
    {
      name: 'Богдан-Ігор',
      surname: 'Антонович-Барський-Антонович',
      phoneNumber: '+380931123344',
      email: 'avety_longname_andsurname@example.com',
      role: ['Менеджер послуги', 'Менеджер обдзвону всіх присутніх людей'],
      location: ['Саперно-Слобідська', 'Петрівка'],
      image: 'assets/img/profile/achievements/achievement-1.png'
    }
  ];

  constructor() {}
}
