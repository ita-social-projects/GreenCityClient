export function transformAddress(input: any) {
  console.log(input);
  return {
    region: { uk: input.regionUk, en: input.regionEn },
    city: { uk: input.cityUk, en: input.cityEn },
    district: { uk: input.districtUk, en: input.districtEn },
    address: {
      uk: `${input.streetUk} ${input.houseNumber}, корп.- ${input.houseCorpus || ''}, п.${input.entranceNumber}`,
      en: `${input.streetEn} ${input.houseNumber}, b.- ${input.houseCorpus || ''}, e.${input.entranceNumber}`
    },
    commentToAddressForClient: input.addressComment || ''
  };
}
