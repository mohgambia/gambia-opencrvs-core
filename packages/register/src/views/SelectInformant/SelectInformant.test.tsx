import {
  createTestApp,
  mockOfflineData,
  assign,
  validToken,
  getItem,
  flushPromises,
  setItem
} from 'src/tests/util'
import { SELECT_INFORMANT } from 'src/navigation/routes'
import { ReactWrapper } from 'enzyme'
import { History } from 'history'
import { Store } from 'redux'
import { getOfflineDataSuccess } from 'src/offline/actions'
import * as fetch from 'jest-fetch-mock'
import { storage } from 'src/storage'
import * as CommonUtils from 'src/utils/commonUtils'

storage.getItem = jest.fn()
storage.setItem = jest.fn()
jest.spyOn(CommonUtils, 'isMobileDevice').mockReturnValue(true)

beforeEach(() => {
  history.replaceState({}, '', '/')
  assign.mockClear()
})

describe('when user is selecting the informant', () => {
  let app: ReactWrapper
  let history: History
  let store: Store

  beforeEach(async () => {
    getItem.mockReturnValue(validToken)
    setItem.mockClear()
    fetch.resetMocks()
    fetch.mockResponses(
      [JSON.stringify({ data: mockOfflineData.locations }), { status: 200 }],
      [JSON.stringify({ data: mockOfflineData.facilities }), { status: 200 }]
    )
    const testApp = createTestApp()
    app = testApp.app
    await flushPromises()
    app.update()
    history = testApp.history
    store = testApp.store
    store.dispatch(getOfflineDataSuccess(JSON.stringify(mockOfflineData)))
  })

  beforeEach(async () => {
    history.replace(SELECT_INFORMANT)
    await flushPromises()
    app.update()
    app
      .find('#createPinBtn')
      .hostNodes()
      .simulate('click')
    await flushPromises()
    app.update()
    for (let i = 0; i < 3; i++) {
      app
        .find('#keypad-1')
        .hostNodes()
        .simulate('click')
    }
    app
      .find('#keypad-2')
      .hostNodes()
      .simulate('click')
    await flushPromises()
    app.update()
    for (let i = 0; i < 3; i++) {
      app
        .find('#keypad-1')
        .hostNodes()
        .simulate('click')
    }
    app
      .find('#keypad-2')
      .hostNodes()
      .simulate('click')
    await flushPromises()
    app.update()
  })
  describe('when selects "Parent"', () => {
    it('takes user to the birth registration by parent informant view', () => {
      app
        .find('#select_parent_informant')
        .hostNodes()
        .simulate('click')

      expect(app.find('#informant_parent_view').hostNodes()).toHaveLength(1)
    })
  })
})
