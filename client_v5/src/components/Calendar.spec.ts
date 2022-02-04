import { render, fireEvent } from '@testing-library/svelte'
import userEvent from '@testing-library/user-event'
import "../services/i18n/i18n";

import Calendar from './Calendar.svelte'

describe("Calendar", () => {
  it('should create', async () => {
    let date = new Date("1981-09-03")
    const { container, findByText } = render(Calendar, { date })
    expect(container).toBeTruthy();
    const d6 = await findByText("6")
    expect(d6).toBeTruthy()
    await fireEvent.click(d6)
    expect(date).toEqual(new Date("1981-09-06"))
  })
})
