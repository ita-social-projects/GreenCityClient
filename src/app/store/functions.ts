export function transformAddress(input: any) {
  return {
    region: { ua: input.region, en: input.regionEn },
    city: { ua: input.city, en: input.cityEn },
    district: { ua: input.district, en: input.districtEn },
    address: {
      ua: `${input.street} ${input.houseNumber}, корп.- ${input.houseCorpus || ''}, п.${input.entranceNumber}`,
      en: `${input.streetEn} ${input.houseNumber}, b.- ${input.houseCorpus || ''}, e.${input.entranceNumber}`
    },
    commentToAddressForClient: input.addressComment || ''
  };
}
