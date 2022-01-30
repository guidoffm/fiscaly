import { Schema } from ".";
import { Log } from "./log";
import { Signature } from "./signature";

export type ListTransactionsOfTssResponseDataItem = {
    client_id: string;
    client_serial_number: string;
    latest_revision: number;
    log: Log;
    metadata: object;
    number: number;
    revision: number;
    schema: Schema;
    signature: Signature;
}