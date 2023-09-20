export type PaymentInfo = {
  month: number;
  year: number;
  status: PaymentStatus;
  total: number;
};

export type PaymentStatus = "new" | "paid";
