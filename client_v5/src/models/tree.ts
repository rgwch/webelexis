export interface Comparator<T> {
  compare(a: T, b: T): number
}
export class Tree<T> {
  private first: Tree<T>
  private next: Tree<T>

  constructor(private parent: Tree<T>, private payload: T) {
    if (parent) {
      this.next = parent.first
      parent.first = this
    }
  }

  public getChildren(): Array<Tree<T>> {
    const ret = new Array<Tree<T>>()
    let runner = this.first
    while (runner) {
      ret.push(runner)
      runner = runner.next
    }
    return ret
  }

  public insert(element: T, comparator: Comparator<T>): Tree<T> {
    let runner = this.first
    while (runner) {
      if (comparator.compare(runner.payload, element) == 0) {
        return runner
      } else {
        runner = runner.next
      }
    }
    return new Tree<T>(this, element)
  }
  getPayload = () => this.payload
  getNext = () => this.next
  getFirst = () => this.first
  getParent = () => this.parent
}

export interface LazyTreeListener {
  fetchChildren(t: LazyTree<any>): boolean
}
export class LazyTree<T> extends Tree<T> {
  constructor(parent: Tree<T>, payload: T, private listener) {
    super(parent, payload)
  }

  public getChildren(): Array<Tree<T>> {
    if (super.getFirst() != null || this.listener(this)) {
      return super.getChildren()
    } else {
      return []
    }
  }
}
