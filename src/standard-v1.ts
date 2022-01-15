import { Order } from './order';
import { Receipt } from "./receipt";

export type StandardV1 = {
    order: Order;
} | {
    receipt: Receipt;
};
