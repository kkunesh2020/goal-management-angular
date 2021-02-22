import { Link } from './link.model';

export default class LinkClass implements Link {
  url: string;
  uid: string;

  constructor(
    url: string,
    uid: string
    ) {
      this.url = url;
      this.uid = uid;
    }
}
