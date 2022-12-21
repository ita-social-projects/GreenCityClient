import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'any' })
export class Locations {
  cities = [
    { cityName: 'Київ', key: 1 },
    { cityName: 'Гатне', key: 2 },
    { cityName: 'Горенка', key: 3 },
    { cityName: `Зазим'є`, key: 4 },
    { cityName: 'Ірпінь', key: 5 },
    { cityName: 'Княжичі', key: 6 },
    { cityName: 'Коцюбинське', key: 7 },
    { cityName: 'Новосілки', key: 8 },
    { cityName: 'Петропавлівська Борщагівка', key: 9 },
    { cityName: 'Погреби', key: 10 },
    { cityName: 'Проліски', key: 11 },
    { cityName: 'Софіївська Борщагівка', key: 12 },
    { cityName: 'Чайки', key: 13 },
    { cityName: 'Щасливе', key: 14 }
  ];

  citiesEn = [
    { cityName: 'Kyiv', key: 1 },
    { cityName: 'Hatne', key: 2 },
    { cityName: 'Horenka', key: 3 },
    { cityName: `Zazymie`, key: 4 },
    { cityName: `Irpin'`, key: 5 },
    { cityName: 'Kniazhychi', key: 6 },
    { cityName: `Kotsyubyns'ke`, key: 7 },
    { cityName: 'Novosilky', key: 8 },
    { cityName: 'Petropavlivska Borshchahivka', key: 9 },
    { cityName: 'Pohreby', key: 10 },
    { cityName: 'Prolisky', key: 11 },
    { cityName: 'Sofiivska Borschahivka', key: 12 },
    { cityName: 'Chaiky', key: 13 },
    { cityName: 'Shchaslyve', key: 14 }
  ];

  bigRegions = [{ name: 'Київська область', key: 1 }];

  bigRegionsEn = [{ name: 'Kyiv region', key: 1 }];

  regionsKyiv = [
    { name: 'Голосіївський', key: 1 },
    { name: 'Дарницький', key: 2 },
    { name: 'Деснянський', key: 3 },
    { name: 'Дніпровський', key: 4 },
    { name: 'Оболонський', key: 5 },
    { name: 'Печерський', key: 6 },
    { name: 'Подільський', key: 7 },
    { name: 'Святошинський', key: 8 },
    { name: `Солом'янський`, key: 9 },
    { name: 'Шевченківський', key: 10 }
  ];

  regionsKyivEn = [
    { name: `Holosiivs'kyi`, key: 1 },
    { name: `Darnyts'kyi`, key: 2 },
    { name: `Desnyans'kyi`, key: 3 },
    { name: `Dniprovs'kyi`, key: 4 },
    { name: 'Obolonskyi', key: 5 },
    { name: `Pechers'kyi`, key: 6 },
    { name: `Podil's'kyi`, key: 7 },
    { name: `Svyatoshyns'kyi`, key: 8 },
    { name: `Solom'yans'kyi`, key: 9 },
    { name: `Shevchenkivs'kyi`, key: 10 }
  ];

  regions = [
    { name: 'Бориспільський', key: 1 },
    { name: 'Броварський', key: 2 },
    { name: 'Бучанський', key: 3 },
    { name: 'Вишгородський', key: 4 },
    { name: 'Обухівський', key: 5 },
    { name: 'Фастівський', key: 6 }
  ];

  regionsEn = [
    { name: `Boryspil's'kyi`, key: 1 },
    { name: `Brovars'kyi`, key: 2 },
    { name: `Buchans'kyi`, key: 3 },
    { name: `Vyshhorods'kyi`, key: 4 },
    { name: `Obukhivs'kyi`, key: 5 },
    { name: `Fastivs'kyi`, key: 6 }
  ];

  citiesCoordinates = [
    {
      name: 'Kyiv',
      coordinates: {
        north: 50.59079800991073,
        south: 50.36107811970851,
        east: 30.82594104187906,
        west: 30.23944009690609
      }
    },
    {
      name: 'Hatne',
      coordinates: {
        north: 50.37442678529015,
        south: 50.33875011559573,
        east: 30.43766503261107,
        west: 30.36528835440419
      }
    },
    {
      name: 'Horenka',
      coordinates: {
        north: 50.57230832685655,
        south: 50.54623397558239,
        east: 30.34209295119151,
        west: 30.29022923521974
      }
    },
    {
      name: 'Zazymie',
      coordinates: {
        north: 50.61041616146291,
        south: 50.55368602265396,
        east: 30.71374415368001,
        west: 30.62748562237025
      }
    },
    {
      name: `Irpin'`,
      coordinates: {
        north: 50.55358870439215,
        south: 50.47426305824818,
        east: 30.29792156390341,
        west: 30.18841487336181
      }
    },
    {
      name: 'Kniazhychi',
      coordinates: {
        north: 50.48184174016671,
        south: 50.44120359312664,
        east: 30.81911787071394,
        west: 30.7427286619337
      }
    },
    {
      name: `Kotsyubyns'ke`,
      coordinates: {
        north: 50.49827703479146,
        south: 50.4827099945956,
        east: 30.34905105788864,
        west: 30.31743489454659
      }
    },
    {
      name: 'Novosilky',
      coordinates: {
        north: 50.36113097482927,
        south: 50.34734892884189,
        east: 30.4702960715714,
        west: 30.44694299382216
      }
    },
    {
      name: 'Petropavlivska Borshchahivka',
      coordinates: {
        north: 50.44963303657267,
        south: 50.41125259054702,
        east: 30.36406525639132,
        west: 30.30642999550708
      }
    },
    {
      name: 'Pohreby',
      coordinates: {
        north: 50.56892842696831,
        south: 50.53440775625535,
        east: 30.670464521996,
        west: 30.60179475906344
      }
    },
    {
      name: 'Prolisky',
      coordinates: {
        north: 50.39777496652665,
        south: 50.38887000633115,
        east: 30.80212600252601,
        west: 30.77519090221131
      }
    },
    {
      name: 'Sofiivska Borschahivka',
      coordinates: {
        north: 50.42782468468117,
        south: 50.3860964715175,
        east: 30.41841193637191,
        west: 30.3046957000854
      }
    },
    {
      name: 'Chaiky',
      coordinates: {
        north: 50.44717523623419,
        south: 50.42651061933346,
        east: 30.3137255456495,
        west: 30.27492994583497
      }
    },
    // Shchaslyve
    {
      name: 'Shchaslyve',
      coordinates: {
        north: 50.38754203448847,
        south: 50.35395648311329,
        east: 30.8247612642593,
        west: 30.76784754829883
      }
    }
  ];

  getCity(language: string) {
    return language === 'ua' ? this.cities : this.citiesEn;
  }
  getRegionsKyiv(language: string) {
    return language === 'ua' ? this.regionsKyiv : this.regionsKyivEn;
  }

  getRegions(language: string) {
    return language === 'ua' ? this.regions : this.regionsEn;
  }

  getBigRegions(language: string) {
    return language === 'ua' ? this.bigRegions : this.bigRegionsEn;
  }

  getCityCoordinates(cityName: string) {
    return this.citiesCoordinates.find((it) => it.name === cityName);
  }
}
