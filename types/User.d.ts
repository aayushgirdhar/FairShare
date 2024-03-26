export type User = {
  id: string;
  name: string;
  email: string;
  image: string;
  password: string;
  groups: string[];
  expenses: string[];
  isOAuth: boolean;
  createdAt: string;
  updatedAt: string;
};
