import {Item} from "./item";
import {ItemDetail} from "./itemDetail";

export class Order {constructor(public id: string, public date: string, public customer_id: string, public itemDetailDTOS: ItemDetail[] , public sum: Number){}}
