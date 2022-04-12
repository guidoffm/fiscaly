import { MetadataType } from './metadata-type';
import { Raw } from './raw';
import { StandardV1 } from './standard-v1';
import { TransactionStateEnum } from './transaction-state-enum';

export type StartUpdateOrFinishTransactionRequest = {
    state: TransactionStateEnum;
    client_id: string;
    schema: StandardV1 | Raw;
    metadata: MetadataType;
};
