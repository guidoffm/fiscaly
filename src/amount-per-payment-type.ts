import { PaymentTypeEnum } from "./payment-type-enum";

export type AmountPerPaymentType = {
    payment_type: PaymentTypeEnum;
    amount: string;
    currency_code: string;
};
