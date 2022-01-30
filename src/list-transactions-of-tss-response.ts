import { ListTransactionsOfTssResponseDataItem } from "./list-transactions-of-tss-response-data-item";
import { Log } from "./log";
import { Schema } from "./schema";
import { Signature } from "./signature";

export type ListTransactionsOfTssResponse = {

    count: number;
    data: ListTransactionsOfTssResponseDataItem[];
    _env: string;
    _type: string;
    _version: string;
}