import { render, getByRole, fireEvent} from '@testing-library/svelte'
import DatePicker from './DatePicker.svelte'
import "../services/i18n/i18n";


describe("DatePicker", () => {
  it('should open calendar and change date', async () => {
    let current = new Date("1981-09-03")
    const handle=jest.fn()
    const { container, findByText, component } = render(DatePicker, { current})
    expect(container).toBeTruthy();
    component.$on("select",handle)
    const button=getByRole(container,"button")
    expect(button).toBeTruthy()
    await fireEvent.click(button)
    const d6=await findByText('6')
    await fireEvent.click(d6)
    expect(handle).toHaveBeenCalledTimes(1)
    expect(current).toEqual(new Date("1981-09-06"))
  })
})
