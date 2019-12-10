import { Module, VuexModule, Mutation, Action } from "vuex-module-decorators";
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
  active: string = "public";
  contacts: Array<Contact> = [];
  conversationsList: Array<object> = [];
  conversations: Array<Conversation> = [];

  // Mutations
  @Mutation set_contacts(contacts: Array<Contact>) {
    this.contacts = contacts;
  }
  @Mutation set_messages(payload: { id: string; data: object }) {
    let index = this.conversations.findIndex(c => payload.id === c.id);
    this.conversations[index].messages = payload.data;
  }
  @Mutation add_message(payload: { id: string; data: object }) {
    let index = this.conversations.findIndex(c => payload.id === c.id);
    if (this.conversations[index]) {
      if (this.conversations[index].messages) {
        this.conversations[index].messages.push(payload.data);
      } else {
        this.conversations[index].messages = [payload.data];
      }
    } else {
      console.log(this.conversations);
    }
  }
  @Mutation set_conversations_list(conversations: object) {
    this.conversationsList = conversations;
  }
  @Mutation set_conversations(conversations: object) {
    this.conversations = conversations;
  }
  @Mutation set_conversation(conversation: object) {
    this.conversations.push(new Conversation(conversation));
  }
  @Mutation set_convo_prop(data: PropUpdate) {
    let index = this.conversations.findIndex(c => this.active === c.id);
    if (hasKey(this.conversations[index], data.property)) {
      this.conversations[index][data.property] = data.value;
    }
  }
  @Mutation set_active_recipients(recipients: Array<Contact>) {
    this.conversations[this.active].members = recipients;
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
  @Action async sync(uid: string) {
    let t = this;
    var db = firebase.firestore();
    let userQuery = db.collection("users").doc(uid);

    userQuery
      .get()
      .then(function(userDoc) {
        if (userDoc.exists) {
          let user = userDoc.data();

          let contacts = user.contacts ? user.contacts : [];
          t.context.commit("set_contacts", contacts);
          let conversations = user.conversations ? user.conversations : [];
          t.context.commit("set_conversations_list", conversations);

          conversations.forEach((c: object) => {
            var convoQuery = db.collection("chats").doc(c.id);

            convoQuery
              .get()
              .then(function(convoDoc) {
                if (convoDoc.exists) {
                  let convo = convoDoc.data();
                  convo.id = c.id;
                  t.context.commit("set_conversation", convo);
                  var messagesQuery = convoQuery
                    .collection("messages")
                    .orderBy("timestamp");

                  // Start listening to the conversation
                  messagesQuery.onSnapshot(function(snapshot) {
                    snapshot.docChanges().forEach(function(change) {
                      t.context.commit("add_message", {
                        id: c.id,
                        data: new Message(change.doc.data())
                      });
                    });
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
  @Action send_message(message: object) {
    return firebase
      .firestore()
      .collection("chats")
      .doc(this.active + "")
      .collection("messages")
      .add(message);
  }
  @Action({ commit: "set_conversation" }) start_conversation(
    conversation: Conversation
  ) {
    return { id: "new", conversation: conversation };
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
    let index: number = this.conversations.findIndex(c => this.active === c.id);
    return this.conversations[index];
  }
  get getConversations() {
    return this.conversations;
  }
  get getConversation() {
    return (id: Number) => {
      return this.conversations[id];
    };
  }
  get getContacts() {
    return this.contacts;
  }
  get getContact() {
    return (username: string) => {
      return this.contacts[username];
    };
  }
}
