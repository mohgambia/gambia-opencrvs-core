import * as fetch from 'jest-fetch-mock'
import { createServerWithEnvironment } from 'src/tests/util'

describe('authenticate handler receives a request', () => {
  let server: any

  beforeEach(async () => {
    server = await createServerWithEnvironment({ NODE_ENV: 'production' })
  })

  describe('refresh expiring token', () => {
    it('verifies a token and generates a new token', async () => {
      const codeService = require('../verifyCode/service')
      const authService = require('../authenticate/service')

      fetch.mockResponse(
        JSON.stringify({
          valid: true,
          nonce: '12345',
          userId: '1',
          role: 'admin'
        })
      )
      const codeSpy = jest.spyOn(codeService, 'sendVerificationCode')
      jest.spyOn(authService, 'authenticate').mockReturnValue({
        userId: '1',
        role: 'admin',
        mobile: '+345345343'
      })
      jest.spyOn(codeService, 'setVerificationCodeAsUsed').mockReturnValue(true)

      const authRes = await server.server.inject({
        method: 'POST',
        url: '/authenticate',
        payload: {
          mobile: '+345345343',
          password: '2r23432'
        }
      })
      const code = codeSpy.mock.calls[0][1]
      const res = await server.server.inject({
        method: 'POST',
        url: '/verifyCode',
        payload: {
          nonce: authRes.result.nonce,
          code
        }
      })

      const refreshResponse = await server.server.inject({
        method: 'POST',
        url: '/refreshToken',
        payload: {
          nonce: authRes.result.nonce,
          token: res.result.token
        }
      })
      expect(refreshResponse.result.token.split('.')).toHaveLength(3)
      const [, payload] = refreshResponse.result.token.split('.')
      const body = JSON.parse(Buffer.from(payload, 'base64').toString())
      expect(body.role).toBe('admin')
      expect(body.sub).toBe('1')
    })
    /*it('refreshError returns a 401 to the client', async () => {
    })*/
  })
})
