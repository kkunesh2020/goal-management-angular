// Firebase Config
import * as functions from 'firebase-functions';
let firebase = require('firebase-admin');
firebase.initializeApp();

// Sendgrid Config
import * as sgMail from '@sendgrid/mail';
// const URL = 'https://goal-management-system.web.app/';

// var serviceAccount = require("./config/goal-management-system-firebase-adminsdk-53bx2-4b89ce373e.json");

// firebase.initializeApp({
//   credential: firebase.credential.cert(serviceAccount),
//   databaseURL: "https://wick-bridge.firebaseio.com"
// });

const API_KEY = functions.config().sendgrid.key;
const TEMPLATE_ID = functions.config().sendgrid.template;
// const TEMPLATE_ID = functions.config().sendgrid.template;
sgMail.setApiKey(API_KEY);

// student added to class
export const studentAddedToClass = functions.https.onCall(async (data, context) => {
  sgMail.setApiKey(API_KEY);

  const msg = {
    to: data.email,
    from: 'goalmanagement@chadwickschool.org',
    templateId: TEMPLATE_ID,
    dynamic_template_data: {
        subject: data.subject,
        name: data.name,
        class: data.class,
        teacher: data.teacher,
        link: data.link
    },
};

   await sgMail.send(msg);
});

// student creates goal
// export const studentCreatesGoal = functions.https.onCall(async (data, context) => {

//     if (!context.auth && !context.auth.token.email) {
//         throw new functions.https.HttpsError('failed-precondition', 'Must be logged with an email address');
//     }

//     let msg = {
//         to: data.email,
//         // TODO: Use an actual domain.
//         from: {
//           name: 'Chadwick School Goal Management',
//           email: 'wickgoalmanagement@gmail.com'
//         },
//         subject: `You have a new goal ${data.goal}!`,
//         text: `You have a new goal ${data.goal} for ${data.class} created by ${data.teacher}. Please visit ${URL}/goals to accept the goal.`,
//         html: `
//         <p>Hey there!</p>
//         <p>
//          You have a <b>new goal ${data.goal}</b> for ${data.class} created by ${data.teacher}.
//           Please <a href="${URL}/goals">click here</a> to read it.
//         </p>
//         <p>
//           - Chadwick School Goal Management
//         </p>`,
//       }

//     await sgMail.send(msg);

//     // Handle errors here

//     // Response must be JSON serializable
//     return { success: true };

// });

// // teacher creates goal
// export const teacherCreatesGoal = functions.https.onCall(async (data, context) => {

//     if (!context.auth && !context.auth.token.email) {
//         throw new functions.https.HttpsError('failed-precondition', 'Must be logged with an email address');
//     }

//     let msg = {
//         to: data.email,
//         // TODO: Use an actual domain.
//         from: {
//           name: 'Chadwick School Goal Management',
//           email: 'wickgoalmanagement@gmail.com'
//         },
//         subject: `${data.student} created a goal!`,
//         text: `Your student, ${data.student}, created <b> a goal called ${data.goal} for ${data.class}. </b> Please <a href="${URL}/goals">click here</a> to check it out.`,
//         html: `
//         <p>Hi ${data.teacher}!</p>
//         <p>
//           Your student, ${data.student}, created <b> a goal called ${data.goal} for ${data.class}. </b>
//           Please <a href="${URL}/goals">click here</a> to check it out.
//         </p>
//         <p>
//           - Chadwick School Goal Management
//         </p>`,
//       }

//     await sgMail.send(msg);

//     // Handle errors here

//     // Response must be JSON serializable
//     return { success: true };

// });