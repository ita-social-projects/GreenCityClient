export type TUserAgreementText = {
  textUa: string;
  textEn: string;
};

type TUserAgreementMeta = {
  id: number;
  createdAt: string;
  authorEmail: string;
};

export type TUserAgreementAdmin = TUserAgreementMeta & TUserAgreementText;
