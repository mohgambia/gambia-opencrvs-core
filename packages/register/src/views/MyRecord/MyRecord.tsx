import * as React from 'react'
import { injectIntl, InjectedIntlProps, defineMessages } from 'react-intl'
import { IFormSection, IFormSectionData } from 'src/forms'
import {
  ActionPage,
  ListItem,
  ListItemExpansion,
  DataTable
} from '@opencrvs/components/lib/interface'
// import { Spinner } from '@opencrvs/components/lib/interface'
import styled from 'styled-components'
// import { Query } from 'react-apollo'
import { PrimaryButton } from '@opencrvs/components/lib/buttons'
import {
  StatusGray,
  StatusOrange,
  StatusGreen,
  StatusCollected
} from '@opencrvs/components/lib/icons'

const Container = styled.div`
  margin: 0 ${({ theme }) => theme.grid.margin}px;
`
// const StyledSpinner = styled(Spinner)`
//   margin: 50% auto;
// `
const StyledPrimaryButton = styled(PrimaryButton)`
  font-family: ${({ theme }) => theme.fonts.boldFont};
`
// const ErrorText = styled.div`
//   color: ${({ theme }) => theme.colors.error};
//   font-family: ${({ theme }) => theme.fonts.lightFont};
//   text-align: center;
//   margin-top: 100px;
// `
const StatusIcon = styled.div`
  margin-top: 3px;
`
const data = [
  {
    id: 123,
    name: 'John Doe',
    dob: '2010-01-01',
    date_of_application: '2001-10-10',
    tracking_id: '23221',
    event: 'BIRTH',
    declaration_status: 'REGISTERED'
  },
  {
    id: 234,
    name: 'Jane Doe',
    dob: '2010-01-02',
    date_of_application: '2001-10-20',
    tracking_id: '33333',
    event: 'BIRTH',
    declaration_status: 'COLLECTED'
  }
]
type State = {
  data: IFormSectionData
  enableConfirmButton: boolean
}

type IProps = {
  backLabel: string
  registrationId: string
  togglePrintCertificateSection: () => void
  printCertificateFormSection: IFormSection
}

type IFullProps = InjectedIntlProps & IProps

const messages = defineMessages({
  title: {
    id: 'my.record.title',
    defaultMessage: 'My Records',
    description: 'The displayed title in the header'
  },
  queryError: {
    id: 'print.certificate.queryError',
    defaultMessage:
      'An error occurred while quering for birth registration data',
    description: 'The error message shown when a query fails'
  },
  confirm: {
    id: 'print.certificate.confirm',
    defaultMessage: 'Confirm',
    description:
      'The label for confirm button when all information of the collector is provided'
  },
  dataTableResults: {
    id: 'register.workQueue.dataTable.results',
    defaultMessage: 'Results',
    description: 'Results label at the top of the data table component'
  },
  dataTableNoResults: {
    id: 'register.workQueue.dataTable.noResults',
    defaultMessage: 'No result to display',
    description:
      'Text to display if the search return no results for the current filters'
  },
  filtersAllEvents: {
    id: 'register.workQueue.labels.events.all',
    defaultMessage: 'All life events',
    description: 'Label for the filter by all events option'
  },
  filtersFilterBy: {
    id: 'register.workQueue.labels.selects.filter',
    defaultMessage: 'Filter by',
    description: 'Label for the filter by section of the filters'
  },
  filtersBirth: {
    id: 'register.workQueue.labels.events.birth',
    defaultMessage: 'Birth',
    description: 'Label for the filter by birth option'
  },
  filtersDeath: {
    id: 'register.workQueue.labels.events.death',
    defaultMessage: 'Death',
    description: 'Label for the filter by death option'
  },
  filtersMarriage: {
    id: 'register.workQueue.labels.events.marriage',
    defaultMessage: 'Marriage',
    description: 'Label for the filter by marriage option'
  },
  filtersAllStatuses: {
    id: 'register.workQueue.labels.statuses.all',
    defaultMessage: 'All statues',
    description: 'Label for the filter by all statuses option'
  },
  filtersApplication: {
    id: 'register.workQueue.labels.statuses.application',
    defaultMessage: 'Application',
    description: 'Label for the filter by application option'
  },
  filtersRegistered: {
    id: 'register.workQueue.labels.statuses.registered',
    defaultMessage: 'Registered',
    description: 'Label for the filter by registered option'
  },
  filtersCollected: {
    id: 'register.workQueue.labels.statuses.collected',
    defaultMessage: 'Collected',
    description: 'Label for the filter by collected option'
  },
  listItemName: {
    id: 'register.workQueue.labels.results.name',
    defaultMessage: 'Name',
    description: 'Label for name in work queue list item'
  },
  listItemDob: {
    id: 'register.workQueue.labels.results.dob',
    defaultMessage: 'D.o.B',
    description: 'Label for DoB in work queue list item'
  },
  listItemDateOfApplication: {
    id: 'register.workQueue.labels.results.dateOfApplication',
    defaultMessage: 'Date of application',
    description: 'Label for date of application in work queue list item'
  },
  listItemTrackingNumber: {
    id: 'register.workQueue.labels.results.trackingID',
    defaultMessage: 'Tracking ID',
    description: 'Label for tracking ID in work queue list item'
  }
})

class MyRecordActionComponent extends React.Component<IFullProps, State> {
  constructor(props: IFullProps) {
    super(props)
    this.state = {
      data: {},
      enableConfirmButton: false
    }
  }
  getDeclarationStatusIcon = (status: string) => {
    switch (status) {
      case 'APPLICATION':
        return (
          <StatusIcon>
            <StatusOrange />
          </StatusIcon>
        )
      case 'REGISTERED':
        return (
          <StatusIcon>
            <StatusGreen />
          </StatusIcon>
        )
      case 'COLLECTED':
        return (
          <StatusIcon>
            <StatusCollected />
          </StatusIcon>
        )
      default:
        return (
          <StatusIcon>
            <StatusOrange />
          </StatusIcon>
        )
    }
  }

  renderCell = (
    item: { [key: string]: string & Array<{ type: string }> },
    key: number
  ): JSX.Element => {
    const info = []
    const status = []

    info.push({
      label: this.props.intl.formatMessage(messages.listItemName),
      value: item.name
    })
    info.push({
      label: this.props.intl.formatMessage(messages.listItemDob),
      value: item.dob
    })
    info.push({
      label: this.props.intl.formatMessage(messages.listItemDateOfApplication),
      value: item.date_of_application
    })

    info.push({
      label: this.props.intl.formatMessage(messages.listItemTrackingNumber),
      value: item.tracking_id
    })

    status.push({ icon: <StatusGray />, label: item.event })
    status.push({
      icon: this.getDeclarationStatusIcon(item.declaration_status),
      label: item.declaration_status
    })

    // const listItemActions = []

    const expansionActions: JSX.Element[] = []

    expansionActions.push(
      <StyledPrimaryButton id={`reviewAndRegisterBtn_${item.tracking_id}`}>
        {'Button'}
      </StyledPrimaryButton>
    )
    // listItemActions.push({
    //   label: 'Print',
    //   handler: () => {
    //     console.log('here')
    //   }
    // })
    return (
      <ListItem
        index={key}
        infoItems={info}
        statusItems={status}
        key={key}
        itemData={{}}
        // actions={listItemActions}
        expandedCellRenderer={() => (
          <ListItemExpansion actions={expansionActions} />
        )}
      />
    )
  }

  render = () => {
    const { backLabel, togglePrintCertificateSection, intl } = this.props
    const filterBy = {
      input: {
        label: intl.formatMessage(messages.filtersFilterBy)
      },
      selects: {
        name: '',
        options: [
          {
            name: 'event',
            options: [
              {
                value: '',
                label: intl.formatMessage(messages.filtersAllEvents)
              },
              {
                value: 'BIRTH',
                label: intl.formatMessage(messages.filtersBirth)
              },
              {
                value: 'DEATH',
                label: intl.formatMessage(messages.filtersDeath)
              },
              {
                value: 'MARRIAGE',
                label: intl.formatMessage(messages.filtersMarriage)
              }
            ],
            value: ''
          },
          {
            name: 'declaration_status',
            options: [
              {
                value: '',
                label: intl.formatMessage(messages.filtersAllStatuses)
              },
              {
                value: 'APPLICATION',
                label: intl.formatMessage(messages.filtersApplication)
              },
              {
                value: 'REGISTERED',
                label: intl.formatMessage(messages.filtersRegistered)
              },
              {
                value: 'COLLECTED',
                label: intl.formatMessage(messages.filtersCollected)
              }
            ],
            value: ''
          }
        ]
      }
    }
    return (
      <ActionPage
        title={intl.formatMessage(messages.title)}
        backLabel={backLabel}
        goBack={togglePrintCertificateSection}
      >
        <Container>
          <DataTable
            data={data}
            filterBy={filterBy}
            cellRenderer={this.renderCell}
            resultLabel={intl.formatMessage(messages.dataTableResults)}
            noResultText={intl.formatMessage(messages.dataTableNoResults)}
          />
        </Container>
      </ActionPage>
    )
  }
}
export const MyRecordAction = injectIntl<IFullProps>(MyRecordActionComponent)
