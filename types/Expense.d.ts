type Payer = {
  uid: string;
  amount: number;
  isPaid: boolean;
};

export type Expense = {
  id: string;
  uid: string;
  description: string;
  total: number;
  group_id: string;
  isPaid: boolean;
  date: string;
};
