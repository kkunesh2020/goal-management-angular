import { Note } from './note.model';

export default class NoteClass implements Note {
  note: string;
  uid: string;

  constructor(
    uid: string,
    note: string
    ) {
      this.uid = uid;
      this.note = note;
    }
};
