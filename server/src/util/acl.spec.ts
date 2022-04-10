import { ACE, declareACE, hasRight, needsRight } from './acl'
const root = new ACE("root")

describe("ACL", () => {
  it("declares and checks ACEs", () => {
    const acl1 = new ACE("article.find", root)
    const acl2 = new ACE("user.get", root)
    const acl3 = new ACE("billing", root)
    declareACE([root, acl1, acl2, acl3])
    const admin = { roles: ["admin", "doc"] }
    const user = { roles: ["user"] }
    const mpa = { roles: ["assistant"] }
    const doc = { roles: ["doctor"] }
    expect(hasRight(admin, "blubb")).toEqual(true)
    expect(hasRight(user, "blubb")).toEqual(true)
    expect(hasRight(user, "article.find")).toEqual(false)
    expect(hasRight(user, "user.get")).toEqual(true)
    expect(hasRight(admin, "article.find")).toEqual(true)
    expect(hasRight(mpa, "article.find")).toEqual(true)
    expect(hasRight(mpa, "billing")).toEqual(false)
    expect(hasRight(doc, "billing")).toEqual(true)
    expect(hasRight(admin, "billing")).toEqual(true)
    expect(hasRight(mpa, "user.get")).toEqual(true)
    expect(() => needsRight(mpa, "billing")).toThrow()
  })
})
