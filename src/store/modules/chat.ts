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
        },
        {
          username: "test",
          avatar: "https://cdn.vuetifyjs.com/images/lists/1.jpg"
        },
        {
          username: "test2",
          avatar: "https://cdn.vuetifyjs.com/images/lists/2.jpg"
        }
      ],
      messages: [
        {
          author: "test2",
          body: "This is a message from another user",
          timestamp: new Date(2018, 11, 28)
        },
        {
          author: "test",
          body: "This is a message you sent",
          timestamp: new Date(2019, 2, 22)
        },
        {
          author: "test2",
          body: "Another message from another user",
          timestamp: new Date(2019, 3, 20)
        },
        { author: "test", body: "Another from you", timestamp: new Date() }
      ]
    },
    {
      id: new Date(2019, 4, 3).getTime(),
      unread: true,
      active: true,
      title: "",
      styles: {
        color: "default",
        density: "medium"
      },
      notifications: {
        state: true
      },
      created: new Date(2019, 4, 3),
      creator: "test",
      members: [
        {
          username: "skyfly",
          avatar: "https://cdn.vuetifyjs.com/images/lists/5.jpg"
        },
        {
          username: "test",
          avatar: "https://cdn.vuetifyjs.com/images/lists/1.jpg"
        }
      ],
      messages: [
        {
          author: "test",
          body: "Hey, whats up?",
          timestamp: new Date(2019, 4, 3)
        }
      ]
    },
    {
      id: new Date(2019, 3, 3).getTime(),
      unread: false,
      active: true,
      title: "",
      styles: {
        color: "default",
        density: "medium"
      },
      notifications: {
        state: true
      },
      created: new Date(2019, 3, 3),
      creator: "test3",
      members: [
        {
          username: "skyfly",
          avatar: "https://cdn.vuetifyjs.com/images/lists/5.jpg"
        },
        {
          username: "test",
          avatar: "https://cdn.vuetifyjs.com/images/lists/1.jpg"
        },
        {
          username: "test3",
          avatar: "https://cdn.vuetifyjs.com/images/lists/1.jpg"
        }
      ],
      messages: [
        {
          author: "test3",
          body: "Hola amigos",
          timestamp: new Date(2019, 4, 3)
        }
      ]
    }
  ].map(c => new Conversation(c));
  contacts: Array<Contact> = [
    {
      username: "test",
      avatar: "https://cdn.vuetifyjs.com/images/lists/1.jpg"
    },
    {
      username: "test2",
      avatar: "https://cdn.vuetifyjs.com/images/lists/2.jpg"
    },
    {
      username: "test3",
      avatar: "https://cdn.vuetifyjs.com/images/lists/3.jpg"
    },
    {
      username: "test4",
      avatar: "https://cdn.vuetifyjs.com/images/lists/4.jpg"
    },
    {
      username: "skyfly",
      avatar: "https://cdn.vuetifyjs.com/images/lists/5.jpg"
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
  @Mutation set_conversation(payload: { id: number; data: object }) {
    let index = this.conversations.findIndex(c => payload.id === c.id);
    this.conversations[index] = payload.data;
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
  @Mutation set_active_conversation(id: number) {
    this.active = id;
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
  @Mutation new_message(message: Message) {
    let index = this.conversations.findIndex(c => message.convoID === c.id);
    this.conversations[index].messages.push(message);
    if (index > 0) {
      let newest = this.conversations.splice(index, 1);
      this.conversations.unshift(newest[0]);
    }
  }

  // Actions

  @Action async load_conversations() {
    var query = firebase
      .firestore()
      .collection("chats")
      .limit(12);

    let t = this;
    query
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          // doc.data() is never undefined for query doc snapshots
          t.context.commit("set_conversation", {
            id: doc.id,
            data: new Conversation(doc.data())
          });
          console.log(doc.id, " => ", doc.data());
        });
      })
      .catch(function(error) {
        console.log("Error getting documents: ", error);
      });
  }
  @Action({ commit: "set_contacts" }) load_contacts() {
    return [new Contact()];
  }
  @Action async listen(id: string) {
    let chatID = id ? id : "public";
    var query = firebase
      .firestore()
      .collection("chats")
      .doc(chatID)
      .collection("messages")
      .orderBy("timestamp")
      .limit(12);

    let t = this;
    // Start listening to the query.
    query.onSnapshot(function(snapshot) {
      var index: number = t.conversations.findIndex(c => t.active === c.id);
      var messages = t.conversations[index].messages;
      snapshot.docChanges().forEach(function(change) {
        if (change.type === "removed") {
          //deleteMessage(change.doc.id);
        } else {
          var message = change.doc.data();
          messages.push(new Message(message));
        }
      });
      t.context.commit("set_conversation", messages);
    });
  }
  @Action({ commit: "set_active_conversation" }) async select_conversation(
    id: number
  ) {
    return id;
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
  @Action({ commit: "new_message" }) send_message(message: Message) {
    return message;
  }
  @Action({ commit: "set_active_recipients" }) set_recipients(
    recipients: Array<Contact>
  ) {
    return recipients;
  }
  @Action({ commit: "set_convo_prop" }) update_conversation(data: PropUpdate) {
    return data;
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
