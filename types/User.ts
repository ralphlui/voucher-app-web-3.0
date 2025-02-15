import { UserTypeEnum } from "@/types/UserTypeEnum";

export interface UserRegistrationResponseProps {
  message: string;
  result: [User];
}

export interface User {
  id?: number;
  email?: string;
  type?: UserTypeEnum;
}

export type UserTypeProps = {
  id: number;
  type: UserTypeEnum;
};

export interface UserFilterType {
  setFilter: (setFilter: UserTypeProps) => void;
}

export interface SessionUserProps {
  email: string;
  name: string;
  role: string;
}

export { UserTypeEnum };
