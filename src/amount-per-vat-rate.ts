import { VatRateEnum } from "./vat-rate-enum";

export type AmountPerVatRate = {
    vat_rate: VatRateEnum;
    amount: string;
};
