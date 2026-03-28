import { randomUUID } from 'crypto';
import { AuthData } from './auth-data';
import { CreateClientResponse } from './create-client-response';
import { CreateTssResponse } from './create-tss-response';
import { ListTransactionsOfTssResponse } from './list-transactions-of-tss-response';
import { ListTssResponse } from './list-tss-response';
import { Raw } from './raw';
import { RetrieveTransactionResponse } from './retrieve-tansaction-response';
import { StandardV1 } from './standard-v1';
import { StartUpdateOrFinishTransactionResponse } from './start-update-or-finish-transaction-response';
import { StartUpdateOrFinishTransactionRequest } from './start-update-or-finish-transaction-request';
import { TransactionStateEnum } from './transaction-state-enum';
import { TssStateData } from './tss-state-data';
import { TssState } from './tss-state-enum';

export class Fiscaly {

    private authData?: AuthData;
    baseUrl: string;

    constructor(baseUrl?: string) {
        this.baseUrl = baseUrl || 'https://kassensichv-middleware.fiskaly.com/api/v2';
    }

    private async request<T>(method: string, url: string, body?: unknown, authenticated = true): Promise<T> {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json'
        };
        if (authenticated && this.authData?.access_token) {
            headers['Authorization'] = `Bearer ${this.authData.access_token}`;
        }

        const response = await fetch(url, {
            method,
            headers,
            body: body !== undefined ? JSON.stringify(body) : undefined
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        return await response.json() as T;
    }

    async auth(apiKey: string, apiSecret: string) {
        this.authData = await this.request<AuthData>('POST', `${this.baseUrl}/auth`, {
            api_key: apiKey,
            api_secret: apiSecret
        }, false);
    }

    async listTss() {
        return this.request<ListTssResponse>('GET', `${this.baseUrl}/tss`);
    }

    async retrieveTss(tssId: string) {
        return this.request<TssStateData>('GET', `${this.baseUrl}/tss/${tssId}`);
    }

    async createTss(): Promise<CreateTssResponse> {
        const tssId = randomUUID();
        return this.request<CreateTssResponse>('PUT', `${this.baseUrl}/tss/${tssId}`, {});
    }

    async changeOrUnblockAdminPin(tssId: string, admin_puk: string, new_admin_pin: string): Promise<void> {
        await this.request<void>('PATCH', `${this.baseUrl}/tss/${tssId}/admin`, {
            admin_puk,
            new_admin_pin
        });
    }

    async updateTss(tssId: string, requestedState: TssState): Promise<void> {
        await this.request<void>('PATCH', `${this.baseUrl}/tss/${tssId}`, {
            state: requestedState
        });
    }

    async authenticateAdmin(tssId: string, adminPin: string): Promise<void> {
        await this.request<void>('POST', `${this.baseUrl}/tss/${tssId}/admin/auth`, {
            admin_pin: adminPin
        });
    }

    async createClient(tssId: string): Promise<CreateClientResponse> {
        const clientId = randomUUID();
        return this.request<CreateClientResponse>('PUT', `${this.baseUrl}/tss/${tssId}/client/${clientId}`, {
            serial_number: `ERS ${clientId}`
        });
    }

    async startUpdateOrFinishTransaction(tssId: string, clienId: string, transactionId: string | undefined, transactionRevision: number, state: TransactionStateEnum, schema: StandardV1 | Raw | undefined, metadata: any | undefined): Promise<StartUpdateOrFinishTransactionResponse> {

        if (!transactionId) {
            transactionId = randomUUID();
        }

        const data = {
            state: state,
            client_id: clienId
        } as StartUpdateOrFinishTransactionRequest;

        if (schema) {
            data.schema = schema;
        }

        if (metadata) {
            data.metadata = metadata;
        }

        return this.request<StartUpdateOrFinishTransactionResponse>(
            'PUT',
            `${this.baseUrl}/tss/${tssId}/tx/${transactionId}?tx_revision=${transactionRevision}`,
            data
        );
    }

    async listTransactionsOfTss(tssId: string, states: TransactionStateEnum[] | undefined): Promise<ListTransactionsOfTssResponse> {
        let statesFilter = '';
        let stateNumber = 0;
        const limit = 100;
        let count = 0;

        if (states && states.length > 0) {
            for (const s of states) {
                if (stateNumber > 0) {
                    statesFilter += '&';
                }
                statesFilter += `states[${stateNumber++}]=${s}`;
            }
        }

        let currentCount = 0;
        const data = [];
        let responseData!: ListTransactionsOfTssResponse;
        let offset = 0;
        do {
            let url = `${this.baseUrl}/tss/${tssId}/tx?offset=${offset}&limit=${limit}`;

            if (states?.length) {
                url += `&${statesFilter}`;
            }

            responseData = await this.request<ListTransactionsOfTssResponse>('GET', url);
            currentCount = responseData.count;
            data.push(...responseData.data);
            count += currentCount;
            offset += limit;
        } while (currentCount === limit);

        return {
            count: count,
            data: data,
            _env: responseData._env,
            _type: responseData._type,
            _version: responseData._version
        } as ListTransactionsOfTssResponse;
    }

    async retrieveTransaction(tssId: string, transactionId: string, transactionRevision: number | undefined): Promise<RetrieveTransactionResponse> {
        const url = transactionRevision
            ? `${this.baseUrl}/tss/${tssId}/tx/${transactionId}?tx_revision=${transactionRevision}`
            : `${this.baseUrl}/tss/${tssId}/tx/${transactionId}`;
        return this.request<RetrieveTransactionResponse>('GET', url);
    }

    async retrieveTransactionAllRevisions(tssId: string, transactionId: string): Promise<RetrieveTransactionResponse[]> {
        const allRevisions: RetrieveTransactionResponse[] = [];
        let latestRevision = -1;
        for (let currentRevisionNumber = 1; latestRevision === -1 || currentRevisionNumber <= latestRevision; currentRevisionNumber++) {
            const revision = await this.retrieveTransaction(tssId, transactionId, currentRevisionNumber);
            latestRevision = revision.latest_revision;
            allRevisions.push(revision);
        }
        return allRevisions;
    }
}
