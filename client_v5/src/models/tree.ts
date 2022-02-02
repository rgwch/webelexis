export interface IComparator<T> {
  compare(a: T, b: T): number
}
export interface ITreeListener {
  fetchChildren(t: Tree<any>): Promise<boolean>
}

export class Tree<T> {
  private _first: Tree<T>
  private _next: Tree<T>

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

  public async getChildren(): Promise<Array<Tree<T>>> {
    if (this.listener) {
      const result = await this.listener.fetchChildren(this)
    }
    const ret = new Array<Tree<T>>()
    let runner = this._first
    while (runner) {
      ret.push(runner)
      runner = runner._next
    }
    return ret
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
