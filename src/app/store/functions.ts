export function transformAddress(input: any) {
  return {
    region: { uk: input.region, en: input.regionEn },
    city: { uk: input.city, en: input.cityEn },
    district: { uk: input.district, en: input.districtEn },
    address: {
      uk: `${input.street} ${input.houseNumber}, корп.- ${input.houseCorpus || ''}, п.${input.entranceNumber}`,
      en: `${input.streetEn} ${input.houseNumber}, b.- ${input.houseCorpus || ''}, e.${input.entranceNumber}`
    },
    commentToAddressForClient: input.addressComment || ''
  };
}
