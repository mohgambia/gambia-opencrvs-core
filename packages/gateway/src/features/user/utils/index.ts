import { USER_MANAGEMENT_URL, COUNTRY } from '@gateway/constants'
import fetch from 'node-fetch'
import { logger } from '@gateway/logger'
import { callingCountries } from 'country-data'
import { IAuthHeader } from '@gateway/common-types'
import * as decode from 'jwt-decode'

export interface ITokenPayload {
  sub: string
  exp: string
  algorithm: string
  scope: string[]
}

export const convertToLocal = (
  mobileWithCountryCode: string,
  countryCode: string
) => {
  // tslint:disable-next-line
  countryCode = countryCode.toUpperCase()
  return mobileWithCountryCode.replace(
    callingCountries[countryCode].countryCallingCodes[0],
    '0'
  )
}

export const convertToMSISDN = (phoneWithoutCountryCode: string) => {
  const countryCode =
    callingCountries[COUNTRY.toUpperCase()].countryCallingCodes[0]

  return phoneWithoutCountryCode.startsWith('0')
    ? `${countryCode}${phoneWithoutCountryCode.substring(1)}`
    : `${countryCode}${phoneWithoutCountryCode}`
}

export async function getUserMobile(userId: string, authHeader: IAuthHeader) {
  try {
    const res = await fetch(`${USER_MANAGEMENT_URL}getUserMobile`, {
      method: 'POST',
      body: JSON.stringify({ userId }),
      headers: {
        'Content-Type': 'application/json',
        ...authHeader
      }
    })
    const body = await res.json()

    return body
  } catch (err) {
    logger.error(`Unable to retrieve mobile for error : ${err}`)
  }
}

export function hasScope(authHeader: IAuthHeader, scope: string) {
  if (!authHeader || !authHeader.Authorization) {
    return false
  }
  const tokenPayload = getTokenPayload(authHeader.Authorization.split(' ')[1])
  return (tokenPayload.scope && tokenPayload.scope.indexOf(scope) > -1) || false
}

export const getTokenPayload = (token: string): ITokenPayload => {
  let decoded: ITokenPayload
  try {
    decoded = decode(token)
  } catch (err) {
    throw new Error(
      `getTokenPayload: Error occured during token decode : ${err}`
    )
  }
  return decoded
}
