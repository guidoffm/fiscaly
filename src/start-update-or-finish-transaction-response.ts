export type StartUpdateOrFinishTransactionResponse = {
    schema: any;
    state: string;
    tss_id: string;
    tss_serial_number: string;
    client_id: string;
    client_serial_number: string;
    revision: number;
    latest_revision: number;
    number: number;
    time_start: number;
    time_end: number;
    _id: string;
    _type: string;
    _env: string;
    _version: string;
    metadata: object;
    signature: {
        value: string;
        algorithm: string;
        counter: number;
        public_key: string;
    };
    log: {
        operation: string;
        timestamp: number;
        timestamp_format: string;
    };
    qr_code_data?: string;
}