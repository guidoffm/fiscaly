import { TransactionType } from "./transaction-type";

export type MetadataType = {
    type: TransactionType;
    creator: string;
    table: string;
    receiptTransactionId?: string;
    receiptTransactionNumber?: number;
}