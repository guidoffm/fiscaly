import axios, { AxiosRequestConfig } from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { AuthData } from './auth-data';
import { CreateClientResponse } from './create-client-response';
import { CreateTssResponse } from './create-tss-response';
import { Raw } from './raw';
import { StandardV1 } from './standard-v1';
import { TransactionStateEnum } from './transaction-state-enum';
import { TssState } from './tss-state-enum';

type StartUpdateOrFinishTransactionRequest = {
    state: TransactionStateEnum;
    client_id: string;
    schema: StandardV1 | Raw;
    metadata: object;
};

export class Fiscaly {

    private authData?: AuthData;
    baseUrl: string;

    constructor(baseUrl?: string) { 
        this.baseUrl = baseUrl || 'https://kassensichv-middleware.fiskaly.com/api/v2';
    }

    async auth(apiKey: string, apiSecret: string) {

        let config = {
            method: 'post',
            url: `${this.baseUrl}/auth`,
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                "api_key": apiKey,
                "api_secret": apiSecret
            })
        } as AxiosRequestConfig;

        const response = await axios(config);
        this.authData = response.data;
        // console.log(this.authData);
    }

    async createTss(): Promise<CreateTssResponse> {
        const tssId = uuidv4();
        console.log(tssId);
        let config = {
            method: 'put',
            url: `${this.baseUrl}/tss/${tssId}`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.authData?.access_token}`

            },
            data: JSON.stringify({
            })
        } as AxiosRequestConfig;

        const response = await axios(config);
        console.log(response.data);
        return response.data;
    }

    async changeOrUnblockAdminPin(tssId: string, admin_puk: string, new_admin_pin: string): Promise<void> {
        let config = {
            method: 'patch',
            url: `${this.baseUrl}/tss/${tssId}/admin`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.authData?.access_token}`

            },
            data: JSON.stringify({
                "admin_puk": admin_puk,
                "new_admin_pin": new_admin_pin
            })
        } as AxiosRequestConfig;

        const response = await axios(config);
        console.log(response.data);
        // return tssId;
    }

    async updateTss(tssId: string, requestedState: TssState): Promise<void> {
        let config = {
            method: 'patch',
            url: `${this.baseUrl}/tss/${tssId}`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.authData?.access_token}`

            },
            data: JSON.stringify({
                "state": requestedState
            })
        } as AxiosRequestConfig;

        const response = await axios(config);
        console.log(response.data);
        // return tssId;
    }

    async authenticateAdmin(tssId: string, adminPin: string): Promise<void> {
        let config = {
            method: 'post',
            url: `${this.baseUrl}/tss/${tssId}/admin/auth`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.authData?.access_token}`

            },
            data: JSON.stringify({
                "admin_pin": adminPin
            })
        } as AxiosRequestConfig;

        const response = await axios(config);
        console.log(response.data);
    }

    async createClient(tssId: string): Promise<CreateClientResponse> {
        const clientId = uuidv4();
        console.log(clientId);
        let config = {
            method: 'put',
            url: `${this.baseUrl}/tss/${tssId}/client/${clientId}`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.authData?.access_token}`

            },
            data: JSON.stringify({
                "serial_number": `ERS ${clientId}`
            })
        } as AxiosRequestConfig;

        const response = await axios(config);
        console.log(response.data);
        return response.data as CreateClientResponse;
    }

    async startUpdateOrFinishTransaction(tssId: string, clienId: string, transactionId: string | undefined, transactionRevision: number, state: TransactionStateEnum, schema: StandardV1 | Raw | undefined, metadata: object | undefined) {

        if (!transactionId) {
            transactionId = uuidv4();
        }

        // console.log(transactionId);

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

        // console.log('requestData', data);
        let config = {
            method: 'put',
            url: `${this.baseUrl}/tss/${tssId}/tx/${transactionId}?tx_revision=${transactionRevision}`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.authData?.access_token}`
            },
            data: JSON.stringify(data)
        } as AxiosRequestConfig;

        const response = await axios(config);
        // console.log(response.data);
        return response.data;
    }

    async listTransactionsOfTss(tssId: string, states: TransactionStateEnum[] | undefined) {
        let statesFilter = '';
        let stateNumber = 0;

        if (states && states.length > 0) {

            if (states.indexOf(TransactionStateEnum.ACTIVE) !== -1) {
                if (stateNumber > 0) {
                    statesFilter += '&';
                }
                statesFilter += `states[${stateNumber++}]=${TransactionStateEnum.ACTIVE}`;
            }

            if (states.indexOf(TransactionStateEnum.CANCELLED) !== -1) {
                if (stateNumber > 0) {
                    statesFilter += '&';
                }
                statesFilter += `states[${stateNumber++}]=${TransactionStateEnum.CANCELLED}`;
            }

            if (states.indexOf(TransactionStateEnum.FINISHED) !== -1) {
                if (stateNumber > 0) {
                    statesFilter += '&';
                }
                statesFilter += `states[${stateNumber++}]=${TransactionStateEnum.FINISHED}`;
            }
        }


        let config = {
            method: 'get',
            url: statesFilter.length ?
                `${this.baseUrl}/tss/${tssId}/tx?${statesFilter}` :
                `${this.baseUrl}/tss/${tssId}/tx`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.authData?.access_token}`
            }
        } as AxiosRequestConfig;

        // console.log(config.url);

        const response = await axios(config);
        // console.log(response.data.data.length);
        return response.data;
    }

    async retrieveTransaction(tssId: string, transactionId: string, transactionRevision: number | undefined): Promise<any> {
        let config = {
            method: 'get',
            url: transactionRevision ?
                `${this.baseUrl}/tss/${tssId}/tx/${transactionId}?tx_revision=${transactionRevision}` :
                `${this.baseUrl}/tss/${tssId}/tx/${transactionId}`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.authData?.access_token}`
            }
        } as AxiosRequestConfig;

        const response = await axios(config);
        console.log(response.data);
        return response.data;
    }

    async retrieveTransactionAllRevisions(tssId: string, transactionId: string): Promise<object[]> {
        const allRevisions = [];
        let latestRevision = -1;
        for (let currentVevisionNumber = 1; latestRevision === -1 || currentVevisionNumber <= latestRevision; currentVevisionNumber++) {
            const revision = await this.retrieveTransaction(tssId, transactionId, currentVevisionNumber);
            latestRevision = revision.latest_revision;
            allRevisions.push(revision);
        }
        return allRevisions;
    }
}
