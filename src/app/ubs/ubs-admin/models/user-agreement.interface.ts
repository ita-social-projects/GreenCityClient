export type TUserAgreementText = {
  textUk: string;
  textEn: string;
};

type TUserAgreementMeta = {
  id: number;
  createdAt: string;
  authorEmail: string;
};

export type TUserAgreementAdmin = TUserAgreementMeta & TUserAgreementText;
