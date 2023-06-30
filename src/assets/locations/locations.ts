import { Injectable } from '@angular/core';
import { Language } from 'src/app/main/i18n/Language';

@Injectable({ providedIn: 'any' })
export class Locations {
  cities = [
    { cityName: 'Київ' },
    { cityName: 'Гатне' },
    { cityName: 'Горенка' },
    { cityName: `Зазим'є` },
    { cityName: 'Ірпінь' },
    { cityName: 'Княжичі' },
    { cityName: 'Коцюбинське' },
    { cityName: 'Новосілки' },
    { cityName: 'Петропавлівська Борщагівка' },
    { cityName: 'Погреби' },
    { cityName: 'Проліски' },
    { cityName: 'Софіївська Борщагівка' },
    { cityName: 'Чайки' },
    { cityName: 'Щасливе' }
  ];

  citiesEn = [
    { cityName: 'Kyiv' },
    { cityName: 'Hatne' },
    { cityName: 'Horenka' },
    { cityName: `Zazymie` },
    { cityName: `Irpin'` },
    { cityName: 'Kniazhychi' },
    { cityName: `Kotsyubyns'ke` },
    { cityName: 'Novosilky' },
    { cityName: 'Petropavlivska Borshchahivka' },
    { cityName: 'Pohreby' },
    { cityName: 'Prolisky' },
    { cityName: 'Sofiivska Borschahivka' },
    { cityName: 'Chaiky' },
    { cityName: 'Shchaslyve' }
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
    { name: 'Бориспільський район', key: 1 },
    { name: 'Броварський район', key: 2 },
    { name: 'Бучанський район', key: 3 },
    { name: 'Вишгородський район', key: 4 },
    { name: 'Обухівський район', key: 5 },
    { name: 'Фастівський район', key: 6 }
  ];

  regionsEn = [
    { name: `Boryspil's'kyi district`, key: 1 },
    { name: `Brovars'kyi district`, key: 2 },
    { name: `Buchans'kyi district`, key: 3 },
    { name: `Vyshhorods'kyi district`, key: 4 },
    { name: `Obukhivs'kyi district`, key: 5 },
    { name: `Fastivs'kyi district`, key: 6 }
  ];

  getCity(language: string) {
    return language === Language.UA ? this.cities : this.citiesEn;
  }

  getRegionsKyiv(language: string) {
    return language === Language.UA ? this.regionsKyiv : this.regionsKyivEn;
  }

  getRegions(language: string) {
    return language === Language.UA ? this.regions : this.regionsEn;
  }

  getBigRegions(language: string) {
    return language === Language.UA ? this.bigRegions : this.bigRegionsEn;
  }
}
