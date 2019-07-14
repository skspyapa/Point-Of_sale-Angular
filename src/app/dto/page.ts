import {Customer} from "./customer";
import {Item} from "./item";
import {Order} from "./order";
import {ItemDetail} from "./itemDetail";

export class Page {
  links:{rel: string,href: string}[];
  content: Array<Customer|Item|Order|ItemDetail>;
  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number
  };
  constructor(links: { rel: string; href: string }[], content: Array<Customer|Item|Order|ItemDetail>, page: { size: number; totalElements: number; totalPages: number; number: number }) {
    this.links = links;
    this.content = content;
    this.page = page;
  }
}
