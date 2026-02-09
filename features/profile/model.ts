export interface Profile {
  id: number;
  name: string;
  email: string;
  mobile: string;
  status: "pending" | "inactive" | "active";
}

export interface PaymentSession {
  payment_session_id: string;
  order_id: string;
  order_amount: string;
  order_currency: string;
  order_status: string;
  order_meta: {
    return_url: string;
  };
}
