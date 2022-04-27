/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2022 by G. Weirich         *
 * License and Terms see LICENSE            *
 ********************************************/

export interface IComparator<T> {
  compare(a: T, b: T): number
}
export interface ITreeListener {
  fetchChildren(t: Tree<any>): Promise<boolean>
}

export class Tree<T> {
  private _first: Tree<T>
  private _next: Tree<T>
  public props: any = {}

  /**
   * @param parent
   * @param payload
   * @param listener - If a tree has a listener, it becomes a LazyTree, i.e. loads children only when getChildren() is called.
   */
  constructor(
    private _parent: Tree<T>,
    private _payload: T,
    private listener?: ITreeListener,
  ) {
    if (_parent) {
      const sibling = _parent._first
      this._next = sibling
      _parent._first = this
    }
  }

  public getChildren(): Array<Tree<T>> {
    const ret = new Array<Tree<T>>()
    let runner = this._first
    while (runner) {
      ret.push(runner)
      runner = runner._next
    }
    return ret
  }
  public async fetch(): Promise<Array<Tree<T>>> {
    if (this.listener) {
      const result = await this.listener.fetchChildren(this)
    }
    return this.getChildren()
  }

  /**
   * Creates a new Node with the given payload. If a node with the same payload (as identified by the comparator) already exists, return that node.
   * @param payload
   * @param comparator
   * @returns
   */
  public insert(
    payload: T,
    comparator: (a: T, b: T) => number,
    listener?: ITreeListener,
  ): Tree<T> {
    let runner = this._first
    while (runner) {
      if (comparator(runner.payload, payload) === 0) {
        return runner
      } else {
        runner = runner._next
      }
    }
    return new Tree<T>(this, payload, listener)
  }

  /**
   * Moves a complete subtree into this Tree (must be the same type)
    */
  public acquireTree(other:Tree<T>){
    const oldparent=other.parent
    if(oldparent.first==other){
      oldparent._first=other.next
    }else{
      let runner=oldparent.first
      while(runner){
        if(runner.next==other){
          runner._next=other.next
        }
        runner=runner.next
      }
    }
    other._parent=this
    other._next=this.first
    this._first=other
  }

  setPayload = (p: T) => {
    this._payload = p
  }
  get payload() {
    return this._payload
  }
  get next() {
    return this._next
  }
  get first() {
    return this._first
  }
  get parent() {
    return this._parent
  }
}
