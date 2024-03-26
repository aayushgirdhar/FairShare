type Payer = {
  uid: string;
  amount: number;
};

export type Expense = {
  id: string;
  uid: string;
  description: string;
  total: number;
  payers: Payer[];
  group: string;
  createdAt: string;
  updatedAt: string;
};
