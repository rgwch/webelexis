import { render, fireEvent } from '@testing-library/svelte'
import {Tree} from '../models/tree'
import "../services/i18n/i18n"
import { _ } from 'svelte-i18n'

import TreeView from './TreeView.svelte'

describe("Treeview", () => {
    it("creates a TreeView", () => {
        const comparator=(a,b)=>{return a.localeCompare(b)}
        const lp=n=>{
            return n.payload
        }
        const dummy = new Tree(null, null)
        const n1 = new Tree(dummy, "eins")
        const n2 = new Tree(dummy, "zwei")
        // n1.insert("ch1", comparator)
        const  {container}  = render(TreeView,{tree:dummy, labelProvider: lp})
        expect(container).toBeTruthy()
    })
})