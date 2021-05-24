// Firebase Config
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp();
const db = admin.firestore();

// Sendgrid Config
import * as sgMail from '@sendgrid/mail';

const API_KEY = functions.config().sendgrid.key;
const TEMPLATE_ID = functions.config().sendgrid.template;
sgMail.setApiKey(API_KEY);


// student added to class
export const studentAddedToClass = functions.https.onCall(async (data, context) => {

    if (!context.auth && !context.auth.token.email) {
        throw new functions.https.HttpsError('failed-precondition', 'Must be logged with an email address');
    }

    const msg = {
        to: context.auth.token.email,
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

    // Handle errors here

    // Response must be JSON serializable
    return { success: true };

});

// student creates goal
// export const welcomeEmail = functions.auth.user().onCreate(user => {

//     const msg = {
//         to: user.email,
//         from: 'hello@fireship.io',
//         templateId: TEMPLATE_ID,
//         dynamic_template_data: {
//             subject: 'Welcome to my awesome app!',
//             name: user.displayName,
//         },
//     };

//     return sgMail.send(msg);

// });

// teacher creates goal
// export const welcomeEmail = functions.auth.user().onCreate(user => {

//     const msg = {
//         to: user.email,
//         from: 'hello@fireship.io',
//         templateId: TEMPLATE_ID,
//         dynamic_template_data: {
//             subject: 'Welcome to my awesome app!',
//             name: user.displayName,
//         },
//     };

//     return sgMail.send(msg);

// });