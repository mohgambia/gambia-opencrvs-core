import * as React from 'react'

import { defineMessages, injectIntl, InjectedIntlProps } from 'react-intl'

import { Action, ActionList } from '@opencrvs/components/lib/buttons'
import { ViewHeader } from '../../components/ViewHeader'
import { goToBirthRegistrationAsParent } from '../../navigation/navigationActions'
import { connect } from 'react-redux'

export const messages = defineMessages({
  newBirthRegistration: {
    id: 'register.selectInformant.newBirthRegistration',
    defaultMessage: 'New birth declaration',
    description: 'The message that appears for new birth registrations'
  },
  informantTitle: {
    id: 'register.selectInformant.informantTitle',
    defaultMessage: 'Who is the informant?',
    description: 'The title that appears when asking for the informant'
  },
  informantDescription: {
    id: 'register.selectInformant.informantDescription',
    defaultMessage:
      'Tell us who is providing the details, and check what information is needed to submit the form.',
    description: 'The description that appears when asking for the informant'
  },
  parentInformantTitle: {
    id: 'register.selectInformant.parentInformantTitle',
    defaultMessage: 'Parent',
    description: 'The title that appears when selecting the parent as informant'
  },
  parentInformantDescription: {
    id: 'register.selectInformant.parentInformantDescription',
    defaultMessage:
      '<strong>Required</strong>: Details of the <strong>child, mother</strong> and <strong>informant</strong>.' +
      '<br /><strong>Optional</strong>: Details of the <strong>father.</strong>',
    description:
      'The description that appears when selecting the parent as informant'
  },
  otherInformantTitle: {
    id: 'register.selectInformant.otherInformantTitle',
    defaultMessage: 'Someone else',
    description:
      'The title that appears when selecting someone else as informant'
  },
  otherInformantDescription: {
    id: 'register.selectInformant.otherInformantDescription',
    defaultMessage:
      'Required: Details of the child and informant. Optional: Details of the mother/father.',
    description:
      'The description that appears when selecting someone else as informant'
  },
  selfInformantTitle: {
    id: 'register.selectInformant.selfInformantTitle',
    defaultMessage: 'Self (18+)',
    description: 'The title that appears when selecting self as informant'
  },
  selfInformantDescription: {
    id: 'register.selectInformant.selfInformantDescription',
    defaultMessage:
      '<strong>Required</strong>: Details of the <strong>individual</strong> and <strong>informant</strong>.' +
      '<br /><strong>Optional</strong>: Details of the <strong>mother/father</strong>',
    description: 'The description that appears when selecting self as informant'
  }
})

export class SelectInformantView extends React.Component<
  InjectedIntlProps & {
    goToBirthRegistrationAsParent: typeof goToBirthRegistrationAsParent
  }
> {
  render() {
    const { intl } = this.props
    return (
      <>
        <ViewHeader
          breadcrumb={intl.formatMessage(messages.newBirthRegistration)}
          title={intl.formatMessage(messages.informantTitle)}
          description={intl.formatMessage(messages.informantDescription)}
          id="select_informant_view"
        />
        <ActionList>
          <Action
            id="select_parent_informant"
            title={intl.formatMessage(messages.parentInformantTitle)}
            description={intl.formatMessage(
              messages.parentInformantDescription
            )}
            onClick={this.props.goToBirthRegistrationAsParent}
          />
          <Action
            id="select_someone_else_informant"
            title={intl.formatMessage(messages.otherInformantTitle)}
            description={intl.formatMessage(messages.otherInformantDescription)}
            disabled
          />
          <Action
            id="select_self_informant"
            title={intl.formatMessage(messages.selfInformantTitle)}
            description={intl.formatMessage(messages.selfInformantDescription)}
            disabled
          />
        </ActionList>
      </>
    )
  }
}

export const SelectInformant = injectIntl(
  connect(null, { goToBirthRegistrationAsParent })(SelectInformantView)
)