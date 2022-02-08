import { initialize, validate } from './validator'

describe('Validator', () => {
  initialize('dummy', { a: 'a', b: 'b', c: 'c' })

  it('allows valid object', () => {
    const result = validate({ a: 'ok', b: 'ok', c: 'ok' }, 'dummy', true)
    expect(result).toBeTruthy()
    expect(result.a).toEqual('ok')
  })
  it('corrects invalid object', () => {
    const result = validate(
      { a: 'ok', b: 'ok', c: 'ok', d: 'not ok' },
      'dummy',
      false,
    )
    expect(result).toBeTruthy()
    expect(result.a).toEqual('ok')
    expect(result).toHaveProperty('c')
    expect(result).not.toHaveProperty('d')
  })
  it('throws an error on ivalid object', () => {
    expect(() =>
      validate({ a: 'ok', b: 'ok', c: 'ok', d: 'not ok' }, 'dummy', true),
    ).toThrow(Error)
  })
})
