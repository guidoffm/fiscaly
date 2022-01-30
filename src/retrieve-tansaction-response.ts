import { Schema } from ".";
import { Log } from "./log";
import { Signature } from "./signature";

export type RetrieveTransactionResponse = {
    number: number;
    time_start: number;
    client_serial_number: string;
    tss_serial_number: string;
    state: string;
    client_id: string;
    schema: Schema;
    revision: number;
    latest_revision: number;
    tss_id: string;
    metadata: object,
    _type: string;
    _id: string;
    _env: string;
    _version: string;
    time_end: number,
    qr_code_data: string;
    log: Log;
    signature: Signature
}