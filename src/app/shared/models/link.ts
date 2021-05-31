import { Link } from './link.model';

export default class LinkClass implements Link {
  url: string;
  email: string;

  constructor(
    url: string,
    email: string
    ) {
      this.url = url;
      this.email = email;
    }
}
