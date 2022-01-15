import { TssState } from './tss-state-enum';

export type CreateTssResponse = {
    certificate: string;
    serial_number: string;
    public_key: string;
    signature_algorithm: string;
    signature_timestamp_format: string;
    transaction_data_encoding: string;
    max_number_registered_clients: string;
    max_number_active_transactions: string;
    supported_update_variants: string;
    metadata: object;
    _id: string;
    _type: string;
    _env: string;
    _version: string;
    time_creation: number;
    admin_puk: string;
    state: TssState;
};
