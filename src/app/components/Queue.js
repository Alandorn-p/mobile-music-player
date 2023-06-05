export default class Queue {
  constructor() {
    console.log("SHOULD ONLY BE PRINTED ONCE");
    this._head = null;
    this._tail = null;
  }
  push = (value) => {
    let newNode = new Node(value);
    if (this._head === null) {
      this._head = newNode;
      this._tail = newNode;
    } else {
      this._tail.next = newNode;
      this._tail = newNode;
    }
  };
  pop = () => {
    let first = this._head;
    if (first === null) return null;
    this._head = this._head.next;
    if (this._head === null) {
      this._tail = null;
    }
    return first.value;
  };
  isEmpty() {
    return this.head === null;
  }
}
class Node {
  constructor(value, next = null) {
    this.value = value;
    this.next = next;
  }
}
