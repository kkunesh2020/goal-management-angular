import { Commit } from './commit.model';

export default class CommitClass implements Commit {
  url: string;
  uid: string;

  constructor(
    url: string,
    uid: string
    ) {
      this.url = url;
      this.uid = uid;
    }
};
