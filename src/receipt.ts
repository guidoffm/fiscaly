import { AmountPerPaymentType } from './amount-per-payment-type';
import { AmountPerVatRate } from './amount-per-vat-rate';
import { ReceiptTypeEnum } from './receipt-type-enum';


export type Receipt = {
    receipt_type: ReceiptTypeEnum;
    amounts_per_vat_rate: AmountPerVatRate[];
    amounts_per_payment_type: AmountPerPaymentType[];
};
