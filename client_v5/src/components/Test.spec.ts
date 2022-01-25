import Test from './Test.svelte'
import { render } from '@testing-library/svelte'

describe("Test", () => {
  it('should create', () => {
    const { container } = render(Test,{title: "Test"})
    expect(container).toBeTruthy();
  })
})