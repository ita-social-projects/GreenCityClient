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

  bigRegions = [
    { name: 'Київська область', key: 1 },
    { name: 'місто Київ', key: 2 }
  ];

  bigRegionsEn = [
    { name: `Kyivs'ka oblast`, key: 1 },
    { name: 'Kyiv', key: 2 }
  ];

  regionsKyiv = [
    { name: 'Голосіївський район', key: 1 },
    { name: 'Дарницький район', key: 2 },
    { name: 'Деснянський район', key: 3 },
    { name: 'Дніпровський район', key: 4 },
    { name: 'Оболонський район', key: 5 },
    { name: 'Печерський район', key: 6 },
    { name: 'Подільський район', key: 7 },
    { name: 'Святошинський район', key: 8 },
    { name: `Солом'янський район`, key: 9 },
    { name: 'Шевченківський район', key: 10 }
  ];

  regionsKyivEn = [
    { name: `Holosiivs'kyi district`, key: 1 },
    { name: `Darnyts'kyi district`, key: 2 },
    { name: `Desnyans'kyi district`, key: 3 },
    { name: `Dniprovs'kyi district`, key: 4 },
    { name: 'Obolonskyi district', key: 5 },
    { name: `Pechers'kyi district`, key: 6 },
    { name: `Podil's'kyi district`, key: 7 },
    { name: `Svyatoshyns'kyi district`, key: 8 },
    { name: `Solom'yans'kyi district`, key: 9 },
    { name: `Shevchenkivs'kyi district`, key: 10 }
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
}
