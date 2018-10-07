import IObject from "./IObject";


export default class LinkedList<T extends IObject> {
  arr: Array<T> = [];

  constructor() {
    this.arr = [];
  }

  size(): number {
    return this.arr.length;
  }
  last(): T {
    return this.arr[this.arr.length - 1];
  }
  clear(): void {
    this.arr = [];
  }
  first(): T {
    return this.arr[0];
  }

  public add(t: T) {
    this.arr.push(t);
    return this;
  }

  public toArray(): Array<T> {
    return this.arr;
  }

  public toString() {
    let s = "";
    this.arr.forEach(e => {
      s += e.toString();
    });
    return s;
  }
}
