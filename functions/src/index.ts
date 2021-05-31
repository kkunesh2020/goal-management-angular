// Firebase Config
import * as functions from 'firebase-functions';
let firebase = require('firebase-admin');
firebase.initializeApp();
const db = firebase.firestore();
// Sendgrid Config
import * as sgMail from '@sendgrid/mail';
const URL = 'https://goal-management-system.web.app/';

// var serviceAccount = require("./config/goal-management-system-firebase-adminsdk-53bx2-4b89ce373e.json");

// firebase.initializeApp({
//   credential: firebase.credential.cert(serviceAccount),
//   databaseURL: "https://wick-bridge.firebaseio.com"
// });

const API_KEY = functions.config().sendgrid.key;
// const TEMPLATE_ID = functions.config().sendgrid.template;
sgMail.setApiKey(API_KEY);

// student added to class
export const studentAddedToClass = functions.https.onCall(async (data, context) => {
  sgMail.setApiKey(API_KEY);

    const msg = {
        to: data.email,
        from: {
          name: 'Chadwick School Goal Management',
          email: 'wickgoalmanagement@gmail.com'
        },
        subject: `You are invited to join ${data.class}!`,
        text: `You have been added to ${data.class} taught by ${data.teacher}. Please visit ${URL}/goals to view the classs.`,
        html: `
        <p>Hey there!</p>
        <p>
        You have been added to <b>${data.class} taught by ${data.teacher}</b>.
        Please visit <a href="${URL}/classes">click here</a> to view the class.
        </p>
        <p>
          - Chadwick School Goal Management
        </p>`
    };

   await sgMail.send(msg);
});


export const userCreatedGoalEmail = functions.firestore.document('goals/{goalID}').onCreate( async (change, context) => {

  // Read the post document
  const postSnap = await db.collection('goals').doc(context.params.goalID).get();

  // Raw Data
  const goal = postSnap.data(); 
  const classDoc = await db.collection('classes').doc(goal.classID).get();
  const classData = classDoc.data();
  const teacherDoc = await db.collection('users').doc(classData.teacherUID).get();
  const teacherData = teacherDoc.data()


  // Email if teacher creates goal
  let msg = {
      to: goal.createdBy.email,
      from: {
        name: 'Chadwick School Goal Management',
        email: 'wickgoalmanagement@gmail.com'
      },
      subject: `You have a new goal ${goal.description}!`,
      text: `You were assigned a new goal ${goal.description} for ${classData.title} created by ${teacherData.name}. Please <a href="${URL}/goals">click here</a> to view the goal.`,
      html: `
      <p>Hey there!</p>
      <p>
        You have a <b>new goal ${goal.description}</b> for ${classData.titles} created by ${teacherData.name}.
        Please <a href="${URL}/goals">click here</a> to view the goal.
      </p>
      <p>
        - Chadwick School Goal Management
      </p>`,
  };

  // Email if student creates goal
  if(goal.createdBy.accountType == "student"){
    msg.to = teacherData.email;
    msg.subject = `${goal.createdBy.name} created a new goal!`;
    msg.text = `Your student, ${goal.createdBy.name}, created a new goal called ${goal.description} for your class ${classData.title}. Please <a href="${URL}/classes/${classDoc.id}/goals/${postSnap.id}">click here</a> to view the goal.`;
    msg.html = `
    <p>Hey there!</p>
      <p>
        Your student, ${goal.createdBy.name}, <b>created a new goal called ${goal.description} for your class ${classData.title}.</b>
        Please <a href="${URL}/classes/${classDoc.id}/goals/${postSnap.id}">click here</a> to view the goal.
      </p>
      <p>
        - Chadwick School Goal Management
      </p>
    `;
    await sgMail.send(msg);
    return;
  }else{
    for(let student of goal.assignedToID){
      let studentDoc = await db.collection('users').doc(student).get();
      msg.to = studentDoc.data().email;
      await sgMail.send(msg);
    }
  }
});