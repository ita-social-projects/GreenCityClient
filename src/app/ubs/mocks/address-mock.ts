export const ADDRESSESMOCK = {
  REGIONSMOCK: [
    { name: 'Київська область', key: 1 },
    { name: 'місто Київ', key: 2 }
  ],
  DISTRICTSMOCK: [
    { name: 'Бориспільський', key: 1 },
    { name: 'Броварський', key: 2 },
    { name: 'Бучанський', key: 3 }
  ],
  DISTRICTSKYIVMOCK: [
    { name: 'Голосіївський район', key: 1 },
    { name: 'Дарницький район', key: 2 },
    { name: 'Деснянський район', key: 3 }
  ],
  KYIVREGIONSLIST: [
    {
      description: 'Шевченкове, Київська область',
      matched_substrings: [
        { length: 1, offset: 1 },
        { length: 1, offset: 1 }
      ],
      place_id: '1111',
      reference: '1111',
      structured_formatting: {
        main_text: 'Шевченкове',
        main_text_matched_substrings: [{ length: 1, offset: 1 }],
        secondary_text: 'Київська область',
        secondary_text_matched_substrings: [{ length: 1, offset: 1 }]
      },
      terms: [
        { offset: 1, value: 'Шевченкове' },
        { offset: 1, value: 'Київська область' }
      ],
      types: ['locality', 'political', 'geocode']
    },
    {
      description: 'Шевченківка, Київська область',
      matched_substrings: [
        { length: 1, offset: 1 },
        { length: 1, offset: 1 }
      ],
      place_id: '2222',
      reference: '2222',
      structured_formatting: {
        main_text: 'Шевченківка',
        main_text_matched_substrings: [{ length: 1, offset: 1 }],
        secondary_text: 'Київська область',
        secondary_text_matched_substrings: [{ length: 1, offset: 1 }]
      },
      terms: [
        { offset: 1, value: 'Шевченківка' },
        { offset: 1, value: 'Київська область' }
      ],
      types: ['locality', 'political', 'geocode']
    }
  ],
  KYIVCITYLIST: [
    {
      description: 'Київ, місто Київ',
      matched_substrings: [
        { length: 1, offset: 1 },
        { length: 1, offset: 1 }
      ],
      place_id: 'ChIJBUVa4U7P1EAR_kYBF9IxSXY',
      reference: '1111',
      structured_formatting: {
        main_text: 'Київ',
        main_text_matched_substrings: [{ length: 1, offset: 1 }],
        secondary_text: 'місто Київ',
        secondary_text_matched_substrings: [{ length: 1, offset: 1 }]
      },
      terms: [
        { offset: 1, value: 'Київ' },
        { offset: 1, value: 'місто Київ' }
      ],
      types: ['locality', 'political', 'geocode']
    },
    {
      description: 'Київ, Миколаївська область',
      matched_substrings: [
        { length: 1, offset: 1 },
        { length: 1, offset: 1 }
      ],
      place_id: '2222',
      reference: '2222',
      structured_formatting: {
        main_text: 'Київ',
        main_text_matched_substrings: [{ length: 1, offset: 1 }],
        secondary_text: 'Миколаївська область',
        secondary_text_matched_substrings: [{ length: 1, offset: 1 }]
      },
      terms: [
        { offset: 1, value: 'Київ' },
        { offset: 1, value: 'Миколаївська область' }
      ],
      types: ['locality', 'political', 'geocode']
    }
  ],
  PLACEKYIVUK: {
    address_components: [
      { long_name: 'Київ', short_name: 'Київ', types: ['locality', 'political'] },
      { long_name: 'місто Київ', short_name: 'місто Київ', types: ['administrative_area_level_2', 'political'] }
    ],
    formatted_address: 'Київ, Україна, 02000',
    name: 'Київ',
    place_id: 'ChIJBUVa4U7P1EAR_kYBF9IxSXY'
  },
  PLACECITYUK: {
    address_components: [
      { long_name: 'Шевченкове', short_name: 'Шевченкове', types: ['locality', 'political'] },
      { long_name: 'Київська область', short_name: 'Київська область', types: ['administrative_area_level_2', 'political'] }
    ],
    formatted_address: 'Шевченкове, Київська область, Україна, 02000',
    name: 'Шевченкове',
    place_id: '111'
  },
  PLACECITYEN: {
    address_components: [
      { long_name: 'Kyiv', short_name: 'Kyiv', types: ['locality', 'political'] },
      { long_name: 'Kyiv City', short_name: 'Kyiv City', types: ['administrative_area_level_2', 'political'] }
    ],
    formatted_address: 'Kyiv, Ukraine, 02000',
    name: 'Kyiv',
    place_id: 'ChIJBUVa4U7P1EAR_kYBF9IxSXY'
  },
  STREETSKYIVCITYLIST: [
    {
      description: 'вулиця Ломоносова, Київ, Україна',
      matched_substrings: [
        { length: 1, offset: 1 },
        { length: 1, offset: 1 }
      ],
      place_id:
        'EixNeWtoYWlsYSBMb21vbm9zb3ZhIFN0LCBLeWl2LCBVa3JhaW5lLCAwMjAwMCIuKiwKFAoSCb9RPBbdyNRAEb8pDeFisJyLEhQKEgkFRVrhTs_UQBH-RgEX0jFJdg',
      reference: '1111',
      structured_formatting: {
        main_text: 'вулиця Ломоносова',
        main_text_matched_substrings: [{ length: 1, offset: 1 }],
        secondary_text: 'Київ, Україна',
        secondary_text_matched_substrings: [{ length: 1, offset: 1 }]
      },
      terms: [
        { offset: 1, value: 'вулиця Ломоносова' },
        { offset: 1, value: 'Київ' }
      ],
      types: ['route', 'geocode']
    },
    {
      description: 'вулиця Січневого повстання, Київ, Україна',
      matched_substrings: [
        { length: 1, offset: 1 },
        { length: 1, offset: 1 }
      ],
      place_id: '2222',
      reference: '2222',
      structured_formatting: {
        main_text: 'вулиця Січневого повстання',
        main_text_matched_substrings: [{ length: 1, offset: 1 }],
        secondary_text: 'Київ, Україна',
        secondary_text_matched_substrings: [{ length: 1, offset: 1 }]
      },
      terms: [
        { offset: 1, value: 'вулиця Січневого повстання' },
        { offset: 1, value: 'Київ' }
      ],
      types: ['route', 'geocode']
    }
  ],
  STREETSKYIVREGIONLIST: [
    {
      description: 'вулиця Незалежності, Щасливе, Київська область, Україна',
      matched_substrings: [
        { length: 1, offset: 1 },
        { length: 1, offset: 1 }
      ],
      place_id: '1111',
      reference: '1111',
      structured_formatting: {
        main_text: 'вулиця Незалежності',
        main_text_matched_substrings: [{ length: 1, offset: 1 }],
        secondary_text: 'Щасливе, Київська область, Україна',
        secondary_text_matched_substrings: [{ length: 1, offset: 1 }]
      },
      terms: [
        { offset: 1, value: 'вулиця Незалежності' },
        { offset: 1, value: 'Щасливе' }
      ],
      types: ['route', 'geocode']
    },
    {
      description: 'вулиця Незалежності, Щасливе, Миколаївська область, Україна',
      matched_substrings: [
        { length: 1, offset: 1 },
        { length: 1, offset: 1 }
      ],
      place_id: '2222',
      reference: '2222',
      structured_formatting: {
        main_text: 'вулиця Незалежності',
        main_text_matched_substrings: [{ length: 1, offset: 1 }],
        secondary_text: 'Щасливе, Миколаївська область, Україна',
        secondary_text_matched_substrings: [{ length: 1, offset: 1 }]
      },
      terms: [
        { offset: 1, value: 'вулиця Незалежності' },
        { offset: 1, value: 'Щасливе' }
      ],
      types: ['route', 'geocode']
    }
  ],
  PLACESTREETUK: {
    address_components: [
      { long_name: 'вулиця Ломоносова', short_name: 'вулиця Ломоносова', types: ['locality', 'political'] },
      { long_name: 'Голосіївський район', short_name: 'Голосіївський район', types: ['administrative_area_level_2', 'political'] },
      { long_name: 'місто Київ', short_name: 'місто Київ', types: ['administrative_area_level_2', 'political'] }
    ],
    formatted_address: 'вулиця Ломоносова, Київ, Україна, 02000',
    name: 'вулиця Ломоносова',
    place_id:
      'EixNeWtoYWlsYSBMb21vbm9zb3ZhIFN0LCBLeWl2LCBVa3JhaW5lLCAwMjAwMCIuKiwKFAoSCb9RPBbdyNRAEb8pDeFisJyLEhQKEgkFRVrhTs_UQBH-RgEX0jFJdg'
  },
  PLACESTREETEN: {
    address_components: [
      { long_name: 'Lomonosova street', short_name: 'Lomonosova street', types: ['locality', 'political'] },
      { long_name: `Holosiivs'kyi district`, short_name: `Holosiivs'kyi district`, types: ['administrative_area_level_2', 'political'] },
      { long_name: 'Kyiv', short_name: 'Kyiv', types: ['administrative_area_level_2', 'political'] }
    ],
    formatted_address: 'вулиця Ломоносова, Київ, Україна, 02000',
    name: 'вулиця Ломоносова',
    place_id:
      'EixNeWtoYWlsYSBMb21vbm9zb3ZhIFN0LCBLeWl2LCBVa3JhaW5lLCAwMjAwMCIuKiwKFAoSCb9RPBbdyNRAEb8pDeFisJyLEhQKEgkFRVrhTs_UQBH-RgEX0jFJdg'
  },
  SEARCHADDRESS: {
    input: `street, 2, Kyiv`,
    street: `street, 2`,
    city: `Kyiv,`
  }
};
