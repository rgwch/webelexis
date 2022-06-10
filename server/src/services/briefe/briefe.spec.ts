import app from '../../test/app'
import { ensurePath, store, retrieve } from './briefe.util'
import fs from 'fs'

describe("Briefe", () => {
    const ctx = {
        app,
        data: {
            path: "test/my/path.txt",
            contents: "Blah blah blah"
        },
        result: {
            path: "test/my/path.txt"
        }
    }
    const base = app.get("docbase")
    afterAll(() => {
        fs.rm(base, { recursive: true }, err => {
            if (err) {
                console.log(err)
            }
        })
    })
    it("rebases a path", async () => {
        const rebased = await ensurePath(app, "test/my/path.txt")
        expect(rebased).toEqual(base + "/test/my/path.txt")
    })

    it("stores a file", async () => {
        const res = await store(ctx)
        expect(res).toHaveProperty("data")
        expect(res.data).not.toHaveProperty("contents")
    })

    it("retrieves a file", async () => {
        const save = await store(ctx)
        const load = await retrieve(ctx)
        expect(load).toBeTruthy()
        expect(load.result).toHaveProperty("contents")
        expect(load.result.contents).toEqual("Blah blah blah")
    })
})