export type StripeCustomer = {
  id?: number;
  customerId: string;
  email: string;
  name: string;
  currency: string;
};

export type StripeCustomerResponse = {
  ok: boolean;
  status: number;
  data: string | StripeCustomer;
  error?: string;
};

export type StripeCustomerPayload = {
  email: string;
  name: string;
  currency: string;
};

export type StripeCustomerModalValues = {
  id: number;
  email: string;
  name: string;
  currency: string;
};

export type CustomModalProps = {
  modalProps: {
    opened: boolean;
    onClose: () => void;
  };
  initialValues?: StripeCustomerModalValues;
  onSubmit?: (values: StripeCustomerModalValues) => Promise<void>;
  loading?: boolean;
};
