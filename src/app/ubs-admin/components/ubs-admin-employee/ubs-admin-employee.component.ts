import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-ubs-admin-employee',
  templateUrl: './ubs-admin-employee.component.html',
  styleUrls: ['./ubs-admin-employee.component.scss']
})
export class UbsAdminEmployeeComponent implements OnInit {
  public fakeData = [
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
    },
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
    },
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
    },
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
    },
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
    },
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
    },
    {
      name: 'Богдан-Ігор',
      surname: 'Антонович-Барський-Антонович',
      phoneNumber: '+380931123344',
      email: 'avety_longname_andsurname@example.com',
      role: ['Менеджер послуги', 'Менеджер обдзвону всіх присутніх людей'],
      location: ['Саперно-Слобідська', 'Петрівка'],
      image: 'assets/img/profile/achievements/achievement-1.png'
    },
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
    },
    {
      name: 'Богдан-Ігор',
      surname: 'Антонович-Барський-Антонович',
      phoneNumber: '+380931123344',
      email: 'avety_longname_andsurname@example.com',
      role: ['Менеджер послуги', 'Менеджер обдзвону всіх присутніх людей'],
      location: ['Саперно-Слобідська', 'Петрівка'],
      image: 'assets/img/profile/achievements/achievement-1.png'
    },
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
    },
    {
      name: 'Богдан-Ігор',
      surname: 'Антонович-Барський-Антонович',
      phoneNumber: '+380931123344',
      email: 'avety_longname_andsurname@example.com',
      role: ['Менеджер послуги', 'Менеджер обдзвону всіх присутніх людей'],
      location: ['Саперно-Слобідська', 'Петрівка'],
      image: 'assets/img/profile/achievements/achievement-1.png'
    },
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

  public totalLength = this.fakeData.length;
  public currentPage = 1;
  public paginationId = 'employee';
  public changeCurrentPage(page: number): void {
    this.currentPage = page;
    this.location.go(`/ubs-admin/employee/${this.currentPage}`);
  }

  constructor(private activatedRoute: ActivatedRoute, private location: Location) {}

  public ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.currentPage = params['page'];
    });
  }
}
