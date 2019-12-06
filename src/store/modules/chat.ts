import {
  Module,
  VuexModule,
  Mutation,
  Action,
  MutationAction
} from "vuex-module-decorators";
import firebase from "firebase";

import { Conversation } from "@/models/conversation";
import { Contact } from "@/models/contact";
import { Message } from "@/models/message";
import { PropUpdate } from "@/models/propUpdate";

function hasKey<O>(obj: O, key: string | number | symbol): key is keyof O {
  return key in obj;
}

@Module
export default class Chat extends VuexModule {
  active: number = new Date(2018, 11, 28).getTime();
  conversations: Array<Conversation> = [
    {
      id: new Date(2018, 11, 28).getTime(),
      unread: false,
      active: true,
      title: "The Group",
      styles: {
        color: "default",
        density: "medium"
      },
      notifications: {
        state: true
      },
      created: new Date(2018, 11, 28),
      creator: "test",
      members: [
        {
          username: "skyfly",
          avatar: "https://cdn.vuetifyjs.com/images/lists/5.jpg"
        }
      ],
      messages: [
        { author: "test", body: "Another from you", timestamp: new Date() }
      ]
    }
  ].map(c => new Conversation(c));
  contacts: Array<Contact> = [
    {
      username: "test",
      avatar: "https://cdn.vuetifyjs.com/images/lists/1.jpg"
    }
  ].map(c => new Contact(c));

  // Mutations
  @Mutation set_contacts(contacts: Array<Contact>) {
    this.contacts = contacts;
  }
  @Mutation set_messages(payload: { id: number; data: object }) {
    let index = this.conversations.findIndex(c => payload.id === c.id);
    this.conversations[index].messages = payload.data;
  }
  @Mutation set_conversations(conversations: Array<Conversation>) {
    this.conversations = conversations;
  }
  @Mutation set_conversation_unread(index: string) {
    // shift conversation to front of the list
    if (index > 0) {
      let newest = this.conversations.splice(index, 1);
      this.conversations.unshift(newest[0]);
    }
  }
  @Mutation new_conversation(conversation: Conversation) {
    this.conversations.unshift(conversation);
  }
  @Mutation set_convo_prop(data: PropUpdate) {
    let index: number = this.conversations.findIndex(c => data.id === c.id);
    if (hasKey(this.conversations[index], data.property)) {
      this.conversations[index][data.property] = data.value;
    }
  }
  @Mutation set_active_recipients(recipients: Array<Contact>) {
    let index: number = this.conversations.findIndex(c => this.active === c.id);
    this.conversations[index].members = recipients;
  }
  @Mutation update_recipients(data: {
    id: number;
    recipients: Array<Contact>;
  }) {
    let index: number = this.conversations.findIndex(c => data.id === c.id);
    this.conversations[index].members = data.recipients;
  }
  @Mutation deactivate_conversation(id: number) {
    let index: number = this.conversations.findIndex(c => id === c.id);
    this.conversations[index].active = false;
  }
  @Mutation remove_conversation(id: number) {
    let index = this.conversations.findIndex(c => id === c.id);
    if (index >= 0) {
      if (this.active === this.conversations[index].id) {
        this.active =
          index > 0
            ? this.conversations[0].id
            : this.conversations[1]
            ? this.conversations[1].id
            : -1;
      }
      this.conversations.splice(index, 1);
    }
  }
  @Mutation set_active_conversation(id: number) {
    this.active = id;
  }

  // Actions
  @Action({ commit: "set_contacts" }) load_contacts() {
    return [new Contact()];
  }
  @Action async sync() {
    let t = this;
    let uid = "IO5H06wVMXh7LXNnscLuDiwuzHf1"; // lookup with context.rootState.instance.getUID not working?
    var db = firebase.firestore();
    let userQuery = db.collection("users").doc("IO5H06wVMXh7LXNnscLuDiwuzHf1");

    userQuery
      .get()
      .then(function(userDoc) {
        if (userDoc.exists) {
          let user = userDoc.data();

          let contacts = user.contacts ? user.contacts : [];
          t.context.commit("set_contacts", contacts);

          let conversations = user.conversations ? user.conversations : {};
          Object.keys(conversations).forEach((id: string) => {
            let convo = conversations[id];
            var convoQuery = db.collection("chats").doc(id);

            convoQuery
              .get()
              .then(function(convoDoc) {
                if (convoDoc.exists) {
                  t.context.commit("set_conversations", convoDoc.data());

                  var messagesQuery = convoQuery
                    .collection("messages")
                    .orderBy("timestamp")
                    .limit(12);

                  // Start listening to the conversation
                  messagesQuery.onSnapshot(function(snapshot) {
                    var messages = t.conversations[id].messages;
                    snapshot.docChanges().forEach(function(change) {
                      messages.push(new Message(change.doc.data()));
                    });
                    t.context.commit("set_messages", {
                      id: convo,
                      data: messages
                    });
                    t.context.commit("set_conversation_unread", id);
                  });
                } else {
                  console.log("convo missing");
                }
              })
              .catch(function(error) {
                console.error("Error getting documents: ", error);
              });
          });
        } else {
          console.log("user missing");
        }
      })
      .catch(function(error) {
        console.log("Error getting documents: ", error);
      });
  }
  @Action send_message(message: Message) {
    return firebase
      .firestore()
      .collection("chats")
      .doc(this.active + "")
      .collection("messages")
      .add(message);
  }
  @Action({ commit: "new_conversation" }) start_conversation(
    conversation: Conversation
  ) {
    return conversation;
  }
  @Action({ commit: "remove_conversation" }) delete_conversation(id: number) {
    return id;
  }
  @Action({ commit: "deactivate_conversation" }) leave_conversation(
    id: number
  ) {
    return id;
  }
  @Action({ commit: "set_active_recipients" }) set_recipients(
    recipients: Array<Contact>
  ) {
    return recipients;
  }
  @Action({ commit: "set_convo_prop" }) update_conversation(data: PropUpdate) {
    return data;
  }
  @Action({ commit: "set_active_conversation" }) async select_conversation(
    id: number
  ) {
    return id;
  }

  // Getters

  get activeID() {
    return this.active;
  }
  get getActiveConversation() {
    return this.conversations.find((c: Conversation) => c.id === this.active);
  }
  get getConversations() {
    return this.conversations;
  }
  get getConversation() {
    return (id: Number) => {
      return this.conversations.find((c: Conversation) => c.id === id);
    };
  }
  get getContacts() {
    return this.contacts;
  }
  get getContact() {
    return (username: string) => {
      return this.contacts.find(c => c.username === username);
    };
  }
}
