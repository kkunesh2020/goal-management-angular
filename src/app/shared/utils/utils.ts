import { AngularFirestore } from '@angular/fire/firestore';
import { User } from '../models/user.model';

export class Utils {

constructor(private readonly afs: AngularFirestore) {

}

// Helper: Reads an array of IDs from a collection concurrently
async readIds(collection, ids) {
  const reads = ids.map(id => collection.doc(id).get());
  const result = await Promise.all(reads);
  return result.map(v => v.data());
}

  async getUserNames(userIds: Array<string>): Array<string> {
    const usersCollection = this.afs.collection<User>('users');
    const reads = userIds.map(id => usersCollection.doc(id).get());
    const result = await Promise.all(reads);
    console.log(result);
    return null;
  }


}
