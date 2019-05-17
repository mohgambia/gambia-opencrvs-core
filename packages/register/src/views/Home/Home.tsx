import * as React from 'react'
import { connect } from 'react-redux'
import { InjectedIntlProps, injectIntl, defineMessages } from 'react-intl'
import { RouteComponentProps } from 'react-router'
import { getLanguage } from '@opencrvs/register/src/i18n/selectors'
import { IStoreState } from '@opencrvs/register/src/store'
import { goToEvents as goToEventsAction } from 'src/navigation'
import { HomeViewHeader } from 'src/components/HomeViewHeader'
import {
  Banner,
  SearchInput,
  ISearchInputProps
} from '@opencrvs/components/lib/interface'
import {
  FooterAction,
  FooterPrimaryButton,
  ViewFooter
} from 'src/components/interface/footer'
import { ActionList, IconAction } from '@opencrvs/components/lib/buttons'
import { ActionTitle } from '@opencrvs/components/lib/buttons/IconAction'
import { Plus } from '@opencrvs/components/lib/icons'
import styled from 'src/styled-components'
import { IUserDetails } from '../../utils/userUtils'
import { getUserDetails } from 'src/profile/profileSelectors'
import { GQLHumanName } from '@opencrvs/gateway/src/graphql/schema'
import { NOTIFICATION_STATUS, REJECTED_STATUS } from 'src/utils/constants'
import { HeaderContent } from '@opencrvs/components/lib/layout'
import { WORK_QUEUE } from 'src/navigation/routes'

const messages = defineMessages({
  declareNewEventActionTitle: {
    id: 'register.home.buttons.registerNewEvent',
    defaultMessage: 'New application',
    description: 'The title for declaring new vital event on an action'
  },
  myDraftActionTitle: {
    id: 'register.home.buttons.mydraft',
    defaultMessage: 'My draft',
    description: 'The title for my draft on an action'
  },
  pendingSubmissionsActionTitle: {
    id: 'register.home.buttons.pendingSubimissions',
    defaultMessage: 'Pending submissions',
    description: 'The title for pending submissions on an action'
  },
  completedSubmissionsActionTitle: {
    id: 'register.home.buttons.completedSumissions',
    defaultMessage: 'Completd submissions',
    description: 'The title for completed submissions on an action'
  },
  logoutActionTitle: {
    id: 'register.home.logout',
    defaultMessage: 'Log out',
    description: 'The title for log out on an action'
  },
  hello: {
    id: 'register.home.header.hello',
    defaultMessage: 'Hello {fullName}',
    description: 'Title for the user'
  },
  FIELD_AGENT: {
    id: 'register.home.header.FIELD_AGENT',
    defaultMessage: 'Field Agent',
    description: 'The description for FIELD_AGENT role'
  },
  REGISTRATION_CLERK: {
    id: 'register.home.header.REGISTRATION_CLERK',
    defaultMessage: 'Registration Clerk',
    description: 'The description for REGISTRATION_CLERK role'
  },
  LOCAL_REGISTRAR: {
    id: 'register.home.header.LOCAL_REGISTRAR',
    defaultMessage: 'Registrar',
    description: 'The description for LOCAL_REGISTRAR role'
  },
  DISTRICT_REGISTRAR: {
    id: 'register.home.header.DISTRICT_REGISTRAR',
    defaultMessage: 'District Registrar',
    description: 'The description for DISTRICT_REGISTRAR role'
  },
  STATE_REGISTRAR: {
    id: 'register.home.header.STATE_REGISTRAR',
    defaultMessage: 'State Registrar',
    description: 'The description for STATE_REGISTRAR role'
  },
  NATIONAL_REGISTRAR: {
    id: 'register.home.header.NATIONAL_REGISTRAR',
    defaultMessage: 'National Registrar',
    description: 'The description for NATIONAL_REGISTRAR role'
  },
  notificationsToComplete: {
    id: 'register.home.banner.notificationsToComplete',
    defaultMessage: 'Notifications to complete in my area',
    description: 'The title on the notifications banner'
  },
  rejectedApplications: {
    id: 'register.home.banner.rejectedApplications',
    defaultMessage: 'My rejected applications',
    description: 'The title on the rejected applications banner'
  },
  savedDrafts: {
    id: 'register.home.button.savedDrafts',
    defaultMessage: 'My saved drafts',
    description: 'The title on the saved drafts button'
  },
  records: {
    id: 'register.home.button.records',
    defaultMessage: 'My records',
    description: 'The title on the completed records button'
  },
  searchInputButtonTitle: {
    id: 'register.workQueue.buttons.search',
    defaultMessage: 'Search',
    description: 'The title of search input submit button'
  },
  trackingId: {
    id: 'register.home.buttons.trackingId',
    defaultMessage: 'Tracking ID',
    description: 'The placeholder of search input'
  }
})

const StyledActionList = styled(ActionList)`
  && {
    margin-top: -20px;
  }
`

const StyledPlusIcon = styled(Plus)`
  display: flex;
  margin-left: -23px;
  margin-top: -23px;
`
const StyledIconAction = styled(IconAction)`
  display: flex;
  min-height: 96px;
  padding: 0 20px 0 0;
  box-shadow: 0 0 12px 1px rgba(0, 0, 0, 0.22);
  background-color: ${({ theme }) => theme.colors.accentLight};
  /* stylelint-disable */
  ${ActionTitle} {
    /* stylelint-enable */
    font-size: 28px;
    font-weight: 300;
    margin: -20px 0 0 0;
    line-height: 1.3em;
    color: ${({ theme }) => theme.colors.white};
  }
`
interface IHomeProps {
  language: string
  userDetails: IUserDetails
  goToEvents: typeof goToEventsAction
  draftCount: string
}

type FullProps = IHomeProps &
  InjectedIntlProps &
  ISearchInputProps &
  RouteComponentProps<{}>

class HomeView extends React.Component<FullProps> {
  render() {
    const { intl, language, userDetails, history } = this.props
    if (userDetails && userDetails.name && userDetails.role === 'FIELD_AGENT') {
      const nameObj = userDetails.name.find(
        (storedName: GQLHumanName) => storedName.use === language
      ) as GQLHumanName
      const fullName = `${String(nameObj.firstNames)} ${String(
        nameObj.familyName
      )}`
      return (
        <>
          <HomeViewHeader
            title={intl.formatMessage(messages.hello, {
              fullName
            })}
            description={intl.formatMessage(
              messages[userDetails.role as string]
            )}
            id="home_view"
          />
          <StyledActionList id="home_action_list">
            <HeaderContent>
              <StyledIconAction
                id="new_event_declaration"
                icon={() => <StyledPlusIcon />}
                onClick={this.props.goToEvents}
                title={intl.formatMessage(messages.declareNewEventActionTitle)}
              />
              <Banner
                text={intl.formatMessage(messages.notificationsToComplete)}
                count={10}
                status={NOTIFICATION_STATUS}
              />
              <Banner
                text={intl.formatMessage(messages.rejectedApplications)}
                count={10}
                status={REJECTED_STATUS}
              />
              <SearchInput
                placeholder={intl.formatMessage(messages.trackingId)}
                buttonLabel={intl.formatMessage(
                  messages.searchInputButtonTitle
                )}
                {...this.props}
              />
            </HeaderContent>
          </StyledActionList>
          <ViewFooter>
            <HeaderContent>
              <FooterAction>
                <FooterPrimaryButton>
                  {intl.formatMessage(messages.logoutActionTitle)}
                </FooterPrimaryButton>
              </FooterAction>
            </HeaderContent>
          </ViewFooter>
        </>
      )
    } else if (
      userDetails &&
      userDetails.role &&
      userDetails.role !== 'FIELD_AGENT'
    ) {
      history.push(WORK_QUEUE)
      return <></>
    } else {
      return <></>
    }
  }
}

const mapStateToProps = (store: IStoreState) => {
  store.drafts.drafts = store.drafts.drafts || []
  const draftCount = store.drafts.drafts.length.toString()
  return {
    draftCount,
    language: getLanguage(store),
    userDetails: getUserDetails(store)
  }
}
export const Home = connect(
  mapStateToProps,
  {
    goToEvents: goToEventsAction
  }
)(injectIntl(HomeView))
