import { Note } from './note.model';

export default class NoteClass implements Note {
  note: string;
  email: string;

  constructor(
    email: string,
    note: string
    ) {
      this.email = email;
      this.note = note;
    }
}
