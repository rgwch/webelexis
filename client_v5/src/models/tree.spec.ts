import { Tree } from './tree'

describe('Tree', () => {
  it('should create a correct tree structure', async () => {
    const stringComparator = (a: string, b: string) => {
      return a.localeCompare(b)
    }
    expect(stringComparator("abcd","bcde")).toBe(-1)
    expect(stringComparator("bcde","abcd")).toBe(1)
    expect(stringComparator("abcd","abcd")).toBe(0)
    
    const t1 = new Tree<string>(null, "parent")
    const t2 = new Tree<string>(t1, 'first child')
    const t3 = new Tree<string>(t1, 'second child')
    const t4 = new Tree<string>(t2, 'grandchild')
    const t5 = t1.insert('first child', stringComparator)

    expect(t1.first.payload).toBe(t3.payload)

    expect(t3.next.payload).toBe(t2.payload)
    expect(t2.next).toBeUndefined()
    expect(t2.parent.payload).toBe(t1.payload)
    expect(t3.parent.payload).toBe(t1.payload)
    expect(t4.parent.payload).toBe(t2.payload)
    expect(t4.next).toBeUndefined()
    expect((await t1.getChildren()).length).toBe(2)
    expect((await t2.getChildren()).length).toBe(1)
  })
})
