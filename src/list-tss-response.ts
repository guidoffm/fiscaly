import { TssStateData } from "./tss-state-data";

export interface ListTssResponse {
    data: TssStateData[];
    count: number;
    _type: string;
    _env: string;
    _version: string;
}