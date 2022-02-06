import { render, fireEvent } from '@testing-library/svelte'
import "../services/i18n/i18n"

import Flexform from './Flexform.svelte'

describe('Flexform', () => {
  it("should create", async () => {
    const ff_cfg = {
      title: () => "Testform",
      attributes: [
        {
          attribute: "textfield",
        },
      ],
    };
    const entity = {
      textfield: "Test"
    }
    const { container } = render(Flexform, { ff_cfg, entity })
    expect(container).toBeTruthy()
  })
})
