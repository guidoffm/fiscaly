import { ClientState } from "./client-state";

export type CreateClientResponse = {
    serial_number: string;
    state: ClientState;
    tss_id: string;
    metadata: any;
    _id: string;
    _type: string;
    _env: string;
    _version: string;
    time_creation: number;   
}