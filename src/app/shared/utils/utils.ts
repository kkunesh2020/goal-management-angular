// import { AngularFirestore } from '@angular/fire/firestore';
// import { User } from '../models/user.model';
//
// export class Utils {
//
// constructor(private readonly afs: AngularFirestore) {
//
// }
//
// // Helper: Reads an array of IDs from a collection concurrently
// // async readIds(collection, ids) {
// //   const reads = ids.map(id => collection.doc(id).get());
// //   const result = await Promise.all(reads);
// //   return result.map(v => v.data());
// // }
//
// async getUserNames(userIds: Array<string>) {
//     const usersCollection = this.afs.collection<User>('users');
//     let userNames = new Set();
//     const reads = userIds.map(id => {
//       // grab the user
//       const user$ = usersCollection.doc<User>(id).valueChanges();
//       // add their name to a set
//       user$.subscribe(user => {
//         userNames.add(user.name);
//       })
//     });
//     await Promise.all(reads);
//     return Array.from(userNames.values());
//   }
//
//
// }
