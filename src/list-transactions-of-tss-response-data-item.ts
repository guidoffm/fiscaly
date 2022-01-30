import { Schema, TransactionStateEnum } from ".";
import { Log } from "./log";
import { Signature } from "./signature";

export type ListTransactionsOfTssResponseDataItem = {
    client_id: string;
    client_serial_number: string;
    latest_revision: number;
    log: Log;
    metadata: object;
    number: number;
    qr_code_data?: string;
    revision: number;
    schema: Schema;
    signature: Signature;
    state: TransactionStateEnum;
    time_end?: number;
    time_start: number;
    tss_id: string;
    tss_serial_number: string;
    _env: string;
    _id: string;
    _type: string;
    _version: string;
}