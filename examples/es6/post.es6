export default class Post {
  constructor({id, userId, title, body}) {
    this.id     = id;
    this.userId = userId;
    this.title  = title;
    this.body   = body;
    this.length = title.length + body.length;
  }
}