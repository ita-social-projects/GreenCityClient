import { TProjectName } from './project-name.type';

export interface ISignIn {
  email: string;
  password: string;
  projectName: TProjectName;
}
