import * as React from 'react'
import { createTestComponent, selectOption } from 'src/tests/util'
import { FormFieldGenerator } from './FormFieldGenerator'
import { ReactWrapper } from 'enzyme'
import { createDraft, storeDraft } from 'src/drafts'
import { createStore } from '../../store'
import {
  SELECT_WITH_OPTIONS,
  SELECT_WITH_DYNAMIC_OPTIONS,
  TEL
} from 'src/forms'

export interface IMotherSectionFormData {
  firstName: string
}

import {
  messages as addressMessages,
  states,
  stateDistrictMap
} from 'src/forms/address'

describe('form component', () => {
  const { store } = createStore()
  const draft = createDraft()
  store.dispatch(storeDraft(draft))
  const modifyDraft = jest.fn()
  let component: ReactWrapper<{}, {}>
  const testComponent = createTestComponent(
    <FormFieldGenerator
      id="mother"
      onChange={modifyDraft}
      setAllFieldsDirty={false}
      fields={[
        {
          name: 'country',
          type: SELECT_WITH_OPTIONS,
          label: addressMessages.country,
          required: true,
          initialValue: 'BGD',
          validate: [],
          options: [
            {
              value: 'BGD',
              label: {
                id: 'countries.BGD',
                defaultMessage: 'Bangladesh',
                description: 'ISO Country: BGD'
              }
            }
          ]
        },
        {
          name: 'state',
          type: SELECT_WITH_OPTIONS,
          label: addressMessages.state,
          required: true,
          initialValue: 'state1',
          validate: [],
          options: states
        },
        {
          name: 'district',
          type: SELECT_WITH_DYNAMIC_OPTIONS,
          label: addressMessages.district,
          required: true,
          initialValue: '',
          validate: [],
          dynamicOptions: {
            dependency: 'state',
            options: stateDistrictMap
          }
        },
        {
          name: 'phone',
          type: TEL,
          label: addressMessages.district,
          required: true,
          initialValue: '',
          validate: []
        }
      ]}
    />,
    store
  )
  component = testComponent.component
  describe('when user is in the moth​​er section', () => {
    it('renders the page', () => {
      expect(component.find('#country_label').hostNodes()).toHaveLength(1)
    })
    it('changes the state select', async () => {
      const select = selectOption(component, '#state', 'Dhaka Division')
      expect(component.find(select).text()).toEqual('Dhaka Division')
    })
    it('changes the district select', async () => {
      const select = selectOption(component, '#district', 'Gazipur District')
      expect(component.find(select).text()).toEqual('Gazipur District')
    })
    describe('when resetDependentSelectValues is called', () => {
      beforeEach(() => {
        const instance = component
          .find('FormSectionComponent')
          .instance() as any
        instance.resetDependentSelectValues('state')
      })
      it('resets dependent select fields', () => {
        expect(
          component
            .find('#district')
            .hostNodes()
            .text()
        ).toEqual('Select...')
      })
      it('doesnt reset non dependent select fields', () => {
        expect(
          component
            .find('#country')
            .hostNodes()
            .text()
        ).toEqual('Bangladesh')
      })
    })
  })
})

describe('form component registration section', () => {
  const { store } = createStore()
  const draft = createDraft()
  store.dispatch(storeDraft(draft))
  const modifyDraft = jest.fn()
  let component: ReactWrapper<{}, {}>
  const testComponent = createTestComponent(
    <FormFieldGenerator
      id="registration"
      onChange={modifyDraft}
      setAllFieldsDirty={false}
      fields={[
        {
          name: 'registrationPhone',
          type: TEL,
          label: {
            defaultMessage: 'Phone number',
            id: 'formFields.registration.phone',
            description: 'Input label for phone input'
          },
          required: true,
          initialValue: '',
          validate: []
        }
      ]}
    />,
    store
  )
  component = testComponent.component
  describe('when user is in the register section', () => {
    it('renders registration phone type as tel', () => {
      expect(
        component
          .find('#registrationPhone')
          .hostNodes()
          .prop('type')
      ).toEqual('tel')
    })
  })
})