import { render, fireEvent } from '@testing-library/svelte'
import "../services/i18n/i18n"
import { _ } from 'svelte-i18n'

import Flexform from './Flexform.svelte'

describe('Flexform', () => {
  let trl
  let unsubscribe
  beforeAll(() => {
    unsubscribe = _.subscribe(res => { trl = res })
  })
  afterAll(() => { unsubscribe() })
  it("should create", async () => {
    const ff_cfg = {
      title: () => "Testform",
      attributes: [
        {
          attribute: "textfield",
          label: trl("demotest")
        },
      ],
    };
    const entity = {
      textfield: "Test"
    }
    const { container, getByLabelText } = render(Flexform, { ff_cfg, entity })
    expect(container).toBeTruthy()
    // const inp: HTMLInputElement = getByLabelText(trl("demotest")) as HTMLInputElement
    // expect(inp).toBeTruthy()
    // expect(inp.value).toEqual("Test")

  })
})
