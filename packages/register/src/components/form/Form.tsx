import * as React from 'react'
import { withFormik } from 'formik'

import {
  InputField,
  TextInput,
  Select,
  DateField
} from '@opencrvs/components/lib/forms'
import { InjectedIntlProps, injectIntl } from 'react-intl'
import styled from '../../styled-components'
import { IFormField } from '../../forms'

const FormItem = styled.div`
  margin-bottom: 2em;
`

const FormSectionTitle = styled.h2`
  font-family: ${({ theme }) => theme.fonts.lightFont};
  color: ${({ theme }) => theme.colors.copy};
`

function getInputField(field: IFormField, label: string) {
  if (field.type === 'select') {
    return (
      <InputField
        component={Select}
        options={field.options}
        required={field.required}
        id={field.name}
        label={label}
      />
    )
  }
  if (field.type === 'date') {
    return (
      <InputField
        component={DateField}
        options={field.options}
        required={field.required}
        id={field.name}
        label={label}
      />
    )
  }
  return (
    <InputField
      component={TextInput}
      required={field.required}
      id={field.name}
      label={label}
    />
  )
}

interface IFormSectionProps {
  fields: IFormField[]
  title: string
  id: string
  handleSubmit: () => void
}

function FormSectionComponent({
  handleSubmit,
  fields,
  title,
  id,
  intl
}: IFormSectionProps & InjectedIntlProps) {
  return (
    <section>
      <FormSectionTitle id={`form_section_title_${id}`}>
        {title}
      </FormSectionTitle>
      <form onSubmit={handleSubmit}>
        {fields.map(field => {
          return (
            <FormItem key={`${field.name}`}>
              {getInputField(field, intl.formatMessage(field.label))}
            </FormItem>
          )
        })}
      </form>
    </section>
  )
}

export const Form = injectIntl(
  withFormik<
    { fields: IFormField[]; title: string; id: string } & InjectedIntlProps,
    any
  >({
    handleSubmit: values => {
      console.log(values)
    }
  })(FormSectionComponent)
)