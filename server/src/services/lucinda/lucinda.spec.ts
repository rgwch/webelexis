import app from '../../test/app'
import lucinda from './lucinda.service'
app.configure(lucinda)

describe('Lucinda', () => {
  let service

  beforeAll(() => {
    service = app.service("lucinda")
  })
  it('registered the service', () => {
    expect(service).toBeTruthy()
  })


})