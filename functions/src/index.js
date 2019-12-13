("use strict");
const functions = require("firebase-functions");
const nodemailer = require("nodemailer");
const admin = require("firebase-admin");
const axios = require("axios");
const builder = require("xmlbuilder");
const { format } = require("date-fns");

admin.initializeApp(functions.config().firebase);

let db = admin.firestore();

// Take the stream info and insert it into the
// Realtime Database under the path /stream
exports.updateStreamInfo = functions.pubsub
  .schedule("every 1 minutes")
  .onRun(async (req, res) => {
    axios
      .get("http://65.183.82.82:8000/status-json.xsl")
      .then(response => {
        let data = response.data;
        let info = {
          title: data.icestats.source.title,
          description: data.icestats.source.server_description,
          listeners: data.icestats.source.listeners,
          listener_peak: data.icestats.source.listener_peak
        };
        let setDoc = db
          .collection("streams")
          .doc("wayhigh")
          .set(info);
        return;
      })
      .catch();
  });

exports.podcast = functions.https.onRequest((req, res) => {
  // get podcast id from request
  var id = req.query.id;
  var podcast;
  // lookup the podcast in firestore
  let podcastQuery = db.collection("podcasts").doc(id);
  let getPodcast = podcastQuery
    .get()
    .then(doc => {
      if (!doc.exists) {
        res.status(400).send("Podcast Not Found");
        return;
      } else {
        podcast = doc.data();
        // get podcast items
        let itemsQuery = podcastQuery.collection("items");
        getItems = itemsQuery.get();
        return getItems;
      }
    })
    .then(snapshot => {
      let items = [];
      snapshot.forEach(doc => {
        let itemData = doc.data();
        let itemDefault = {
          title: "Title of Podcast Episode",
          description: "Description of podcast episode content",
          link: "http://example.com/podcast-2",
          enclosure: {
            "@url": "http://example.com/podcast-2/podcast.mp3",
            "@type": "audio/mpeg",
            "@length": "1024"
          },
          pubDate: format(new Date(), "iii, d MMM yyyy HH:mm:ss xx"),
          guid: "http://example.com/podcast-2",
          category: "<![CDATA[Podcast]]>",
          "itunes:summary": "Description of podcast episode content",
          "itunes:author": "Author Name",
          "itunes:duration": "00:32:16",
          "itunes:explicit": "no"
        };
        items.push(Object.assign(itemDefault, itemData));
      });
      // create the channel
      let channel = {
        title: "Way High Radio",
        link: "https://wayhighradio.com/listen",
        description: "Main feed",
        lastBuildDate: format(new Date(), "iii, d MMM yyyy HH:mm:ss xx"),
        language: "en-us",
        managingEditor: "wayhighradio@gmail.com (Way High Radio)",
        copyright: "2019 Way High Radio",
        "itunes:author": "Author",
        "itunes:summary": "Main feed",
        "itunes:subtitle": "KWHR",
        "itunes:keywords": "radio,way high,ward,CO,community",
        "itunes:explicit": "clean",
        "itunes:owner": {
          "itunes:name": "Owner Name",
          "itunes:email": "wayhighradio@gmail.com"
        },
        "itunes:category": {
          "@text": "Music"
        },
        "itunes:image": {
          "@href": "http://www.example.com/podcast-icon.jpg"
        },
        "atom10:link": {
          "@xmlns:atom10": "http://www.w3.org/2005/Atom",
          "@rel": "self",
          "@type": "application/rss+xml",
          "@href":
            "https://us-central1-community-radio-network.cloudfunctions.net/podcast?id=" +
            id
        },
        image: {
          title: "Way High Radio",
          link: "https://wayhighradio.com/listen",
          url:
            "http://www.wayhighradio.com/uploads/1/9/7/4/1974686/ccrn-logo-02-border_1.jpg",
          width: "144",
          height: "400"
        },
        item: items
      };
      Object.assign(channel, podcast);
      // create the podcast data object
      let obj = {
        rss: {
          "@version": "2.0",
          "@xmlns:content": "http://purl.org/rss/1.0/modules/content/",
          "@xmlns:wfw": "http://wellformedweb.org/CommentAPI/",
          "@xmlns:dc": "http://purl.org/dc/elements/1.1/",
          "@xmlns:atom": "http://www.w3.org/2005/Atom",
          "@xmlns:sy": "http://purl.org/rss/1.0/modules/syndication/",
          "@xmlns:slash": "http://purl.org/rss/1.0/modules/slash/",
          "@xmlns:itunes": "http://www.itunes.com/dtds/podcast-1.0.dtd",
          "@xmlns:feedburner": "http://rssnamespace.org/feedburner/ext/1.0",
          channel: channel
        }
      };
      // build the podcast rss feed in xml
      let feed = builder
        .create(obj, { version: "1.0", encoding: "UTF-8", standalone: true })
        .instructionBefore(
          "xml-stylesheet",
          'type="text/css" media="screen" href="http://feeds.noodle.mx/~d/styles/itemcontent.css"'
        )
        .end({ pretty: true });
      // send xml file
      res.type("application/xml");
      res.status(200).send(feed);
      return;
    })
    .catch(err => {
      console.error(err);
      res.status(500).send(err);
    });
});

exports.newsletter = functions.firestore
  .document("newsletter/{id}")
  .onCreate((snap, context) => {
    return new Promise((resolve, reject) => {
      const token = snap.data().recaptcha;
      let params = {
        secret: functions.config().recaptcha.secret,
        response: token
      };
      console.log(params);
      // make a post to Recaptcha API to verify front end token
      axios
        .post(
          "https://www.google.com/recaptcha/api/siteverify",
          {},
          { params: params }
        )
        .then(function(response) {
          console.log(response);
          // store API response value in newsletter document
          let setDoc = db
            .collection("newsletter")
            .doc(context.params.id)
            .update({ recaptchaVerify: response.data })
            .then(result => {
              resolve(result);
            });
        })
        .catch(error => {
          console.error(error);
          reject(error);
        });
    });
  });

// Configure the email transport using the default SMTP transport and a GMail account.
// For Gmail, enable these:
// 1. https://www.google.com/settings/security/lesssecureapps
// 2. https://accounts.google.com/DisplayUnlockCaptcha
// For other types of transports such as Sendgrid see https://nodemailer.com/transports/
// TODO: Configure the `gmail.email` and `gmail.password` Google Cloud environment variables.
const gmailEmail = functions.config().google.email;
const gmailPassword = functions.config().google.password;
const mailTransport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: gmailEmail,
    pass: gmailPassword
  }
});

// Your company name to include in the emails
const APP_NAME = "Community Radio Network";

// [START sendWelcomeEmail]
/**
 * Sends a welcome email to new user.
 */
// [START onCreateTrigger]
exports.sendWelcomeEmail = functions.auth.user().onCreate(user => {
  // [END onCreateTrigger]
  // [START eventAttributes]
  const email = user.email; // The email of the user.
  const displayName = user.displayName; // The display name of the user.
  // [END eventAttributes]

  // create profile document
  let profile = {
    name: user.displayName,
    email: user.email,
    profileImg: user.photoURL
      ? user.photoURL
      : "http://lorempixel.com/g/200/200/cats/1",
    headerImg: "http://lorempixel.com/800/200/abstract/1",
    bio: "let us know a bit about yourself",
    groups: {},
    activity: [],
    conversations: [
      {
        id: "public",
        active: true,
        title: "Public",
        styles: {
          color: "default",
          density: "medium"
        },
        notifications: {
          enabled: true,
          muteExpire: new Date()
        }
      }
    ],
    contacts: {
      test: {
        username: "test",
        avatar: "https://cdn.vuetifyjs.com/images/lists/5.jpg"
      }
    },
    profile: [
      { title: "Location", value: "" },
      { title: "Favorite Color", value: "" },
      { title: "Favorite Genera", value: "" }
    ],
    created: new Date()
  };

  // Add a new document in collection "users"
  let setDoc = db
    .collection("users")
    .doc(user.uid)
    .set(profile);

  // add as member of the public chat
  let publicChat = db
    .collection("chats")
    .doc("public")
    .update({
      members: admin.firestore.FieldValue.arrayUnion({
        avatar: profile.profileImg,
        username: profile.name
      })
    });

  return sendWelcomeEmail(email, displayName);
});
// [END sendWelcomeEmail]

// [START sendByeEmail]
/**
 * Send an account deleted email confirmation to users who delete their accounts.
 */
// [START onDeleteTrigger]
exports.sendByeEmail = functions.auth.user().onDelete(user => {
  // [END onDeleteTrigger]
  const email = user.email;
  const displayName = user.displayName;

  return sendGoodbyeEmail(email, displayName);
});
// [END sendByeEmail]

// Sends a welcome email to the given user.
async function sendWelcomeEmail(email, displayName) {
  const mailOptions = {
    from: `${APP_NAME} <noreply@wayhighradio.com>`,
    to: email
  };

  mailOptions.subject = `Welcome to ${APP_NAME}!`;
  mailOptions.text = `Hey ${displayName ||
    ""}! Welcome to ${APP_NAME}. I hope you will enjoy the platform.`;
  await mailTransport.sendMail(mailOptions);
  console.log("New welcome email sent to:", email);
  return null;
}

// Sends a goodbye email to the given user.
async function sendGoodbyeEmail(email, displayName) {
  const mailOptions = {
    from: `${APP_NAME} <noreply@wayhighradio.com>`,
    to: email
  };

  mailOptions.subject = `Bye!`;
  mailOptions.text = `Hey ${displayName ||
    ""}!, We confirm that we have deleted your ${APP_NAME} account.`;
  await mailTransport.sendMail(mailOptions);
  console.log("Account deletion confirmation email sent to:", email);
  return null;
}
