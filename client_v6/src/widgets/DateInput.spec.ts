import { render, getByLabelText, fireEvent } from '@testing-library/svelte'
import { vi } from 'vitest'

import "../services/i18n/i18n";

import DateInput from './DateInput.svelte'

const wait = async ms => {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}
describe.skip("DateInput", () => {
  it('should show calendar and change date', async () => {
    const params = {
      date: "2015-08-01"
    }

    const handle = vi.fn()
    const { container, findByText, component } = render(DateInput, { dateString: params.date, label: "A DateInput" })
    expect(container).toBeTruthy();
    component.$on('dateChanged', handle)
    const button = getByLabelText(container, "A DateInput")
    expect(button).toBeTruthy()
    await fireEvent.click(button)
    const d6 = await findByText('6')
    await fireEvent.click(d6)
    expect(handle).toHaveBeenCalledTimes(1)
    // expect(params.date).toEqual("2015-08-06")

  })
})
