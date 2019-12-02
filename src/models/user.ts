export class User {
  uid: string = "";
  name: string = "";
  email: string = "";
  phone: string | null = null;
  photoURL: string | null = null;
  providers: Array<Object> = [];
  active: boolean = false;
  roles: Array<string> = [];
  constructor(data: User | {} = {}) {
    Object.assign(this, data);
  }
}
