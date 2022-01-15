import { Raw } from './raw';
import { StandardV1 } from './standard-v1';

export type Schema = {
    standard_v1: StandardV1;
} | {
    raw: Raw;
};
