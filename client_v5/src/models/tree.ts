export interface IComparator<T> {
  compare(a: T, b: T): number
}
export interface ITreeListener {
  fetchChildren(t: Tree<any>): Promise<boolean>
}

export class Tree<T> {
  private first: Tree<T>
  private next: Tree<T>

  /**
   * @param parent
   * @param payload
   * @param listener - If a tree has a listener, it becomes a LazyTree, i.e. loads children only when getChildren() is called.
   */
  constructor(
    private parent: Tree<T>,
    private payload: T,
    private listener?: ITreeListener,
  ) {
    if (parent) {
      const sibling = parent.first
      this.next = sibling
      parent.first = this
    }
  }

  public async getChildren(): Promise<Array<Tree<T>>> {
    if (this.listener) {
      const result = await this.listener.fetchChildren(this)
    }
    const ret = new Array<Tree<T>>()
    let runner = this.first
    while (runner) {
      ret.push(runner)
      runner = runner.next
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
    let runner = this.first
    while (runner) {
      if (comparator(runner.payload, payload) === 0) {
        return runner
      } else {
        runner = runner.next
      }
    }
    return new Tree<T>(this, payload, listener)
  }
  setPayload = (p: T) => {
    this.payload = p
  }
  getPayload = () => this.payload
  getNext = () => this.next
  getFirst = () => this.first
  getParent = () => this.parent
}
