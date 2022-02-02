import { Tree } from './tree'

describe('Tree', () => {
  it('should create a correct tree structure', async () => {
    const stringComparator = (a: string, b: string) => {
      return a.localeCompare(b)
    }
    expect(stringComparator("abcd","bcde")).toBe(-1)
    expect(stringComparator("bcde","abcd")).toBe(1)
    expect(stringComparator("abcd","abcd")).toBe(0)
    
    const t1 = new Tree<string>(null, null)
    const t2 = new Tree<string>(t1, 'first child')
    const t3 = new Tree<string>(t1, 'second child')
    const t4 = new Tree<string>(t2, 'grandchild')
    const t5 = t1.insert('first child', stringComparator)

    expect(t1.getFirst().getPayload()).toBe(t3.getPayload())
/*
    expect(t2.getNext()).toBe(t3)
    expect(t2.getParent()).toBe(t1)
    expect(t3.getParent()).toBe(t1)
    expect(t4.getParent()).toBe(t2)
    expect(t4.getNext()).toBeUndefined()
    expect((await t1.getChildren()).length).toBe(2)
    */
  })
})
