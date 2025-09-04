export interface Plan {
  id: number;
  name: string;
  price: number;
  type: string;
}

export interface PartnerInvoice {
  id: number;
  name: string;
}

export interface Partner {
  id: number;
  name: string;
  dni: string;
  type_doc: string;
  email: string;
  phone: string;
  mobile: string;
  street: string;
  street2: string;
  country: string;
  state: string;
  city: string;
}

export interface Franchise {
  id: number;
  name: string;
}

export interface Subscription {
  id: number;
  code: string;
  company_id: number;
  state: string;
  street: string;
  street2: string;
  is_seniors: boolean;
  is_disability: boolean;
  installation_date: string;
  partner_bank: string;
  considered_arcotel: boolean;
  considered_reporting_samples: boolean;
  phone: string;
  plan: Plan[];
  partner_invoice: PartnerInvoice;
  partner: Partner;
  franchise: Franchise;
  city_id: number;
  city: string;
  residual: number;
}

export interface SubscriptionResponse {
  subscriptions: Subscription[];
}