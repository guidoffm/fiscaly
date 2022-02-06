import { TssState } from ".";

export interface TssStateData {
    certificate: string;
    serial_number: string;
    public_key: string;
    signature_algorithm: string;
    signature_timestamp_format: string;
    transaction_data_encoding: string;
    max_number_registered_clients: number;
    max_number_active_transactions: number;
    supported_update_variants: string;
    metadata: any;
    _id: string;
    _type: string;
    _env: string;
    _version: string;
    time_creation: number;
    description: string;
    state: TssState;
    signature_counter: string;
    transaction_counter: string;
    number_registered_clients: number;
    number_active_transactions: number;
    time_uninit?: number;
    time_init?: number;
    time_defective?: number;
    time_disable?: number;
}