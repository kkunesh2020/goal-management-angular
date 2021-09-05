import { File } from './file.model';

export default class FileClass implements File {
  name: string;
  downloadURL: string;
  path: string;
  email: string;

  constructor(
    name: string,
    downloadURL: string,
    path: string,
    email: string
    ) {
      this.name = name;
      this.downloadURL = downloadURL;
      this.path = path;
      this.email = email;
    }
}
