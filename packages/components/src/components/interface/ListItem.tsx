import * as React from 'react'
import styled, { keyframes } from 'styled-components'
import {
  StatusGreen,
  StatusOrange,
  StatusGray,
  StatusCollected
} from '../icons'
import { ListItemAction } from '../buttons'

interface IProp {
  label: string
  value: string
}

interface IStatus {
  icon: string
  label: string
}

export interface IAction {
  label: string
  handler: () => void
}

interface IDynamicValues {
  [key: string]: string
}

export interface IListItemProps {
  index: number
  infoItems: IProp[]
  statusItems: IStatus[]
  actions: IAction[]
  itemData: IDynamicValues
  expandedCellRenderer: (
    itemData: IDynamicValues,
    key: number
  ) => React.Component<{}>
  onClick: () => void
}

interface IListItemState {
  expanded: boolean
}

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`

const Wrapper = styled.div.attrs<{ expanded?: boolean }>({})`
  width: 100%;
  margin-bottom: 1px;
  transition: border-top 300ms;
  box-shadow: ${({ expanded }) =>
    expanded ? `0 0 22px 0 rgba(0,0,0,0.23)` : ``};

  &:last-child {
    margin-bottom: 0;
  }
  border-top: ${({ expanded, theme }) =>
    expanded ? ` 4px solid ${theme.colors.expandedIndicator}` : `0`};
`
const ExpandedCellContent = styled.div`
  animation: ${fadeIn} 500ms;
`
const ExpandedCellContainer = styled.div.attrs<{ expanded: boolean }>({})`
  overflow: hidden;
  transition: max-height 600ms;
  max-height: ${({ expanded }) => (expanded ? '1000px' : '0px')};
  /* stylelint-disable */
  ${ExpandedCellContent} {
    /* stylelint-enable */
    animation: ${fadeIn} 500ms;
  }
`

const ListItemContainer = styled.li`
  display: flex;
  flex-flow: row wrap;
  width: 100%;
  margin-bottom: 1px;
  cursor: pointer;
  &:last-child {
    margin-bottom: 0;
  }
`
const ListContentContainer = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  flex: 1;
  align-items: center;
  padding: 10px;
  font-family: ${({ theme }) => theme.fonts.regularFont};
  background-color: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.copy};
`
const InfoDiv = styled.div`
  flex-grow: 1;
  @media (max-width: ${({ theme }) => theme.grid.breakpoints.md}px) {
    width: 100%;
  }
`

const StatusDiv = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: flex-end;
  @media (max-width: ${({ theme }) => theme.grid.breakpoints.md}px) {
    width: 100%;
    margin-top: 10px;
  }
`
const StyledStatus = styled.div`
  font-family: ${({ theme }) => theme.fonts.boldFont};
  background-color: rgba(150, 150, 150, 0.1);
  border-radius: 17px;
  padding: 5px 10px 5px 7px;
  margin: 2px 5px 2px 0;
  display: flex;
  align-items: center;
  height: 32px;
  & span {
    text-transform: uppercase;
    margin-left: 5px;
    font-size: 13px;
  }
`

const StyledLabel = styled.label`
  font-family: ${({ theme }) => theme.fonts.boldFont};
  margin-right: 3px;
`
const StyledValue = styled.span`
  font-family: ${({ theme }) => theme.fonts.regularFont};
`

function LabelValue({ label, value }: IProp) {
  return (
    <div>
      <StyledLabel>{label}:</StyledLabel>
      <StyledValue>{value}</StyledValue>
    </div>
  )
}

export class ListItem extends React.Component<IListItemProps, IListItemState> {
  constructor(props: IListItemProps) {
    super(props)
    this.state = {
      expanded: false
    }
  }

  toggleExpanded = () => {
    this.setState(state => ({
      expanded: !state.expanded
    }))
  }

  render() {
    const { infoItems, statusItems, index, actions, itemData } = this.props
    const { expanded } = this.state
    return (
      <Wrapper key={index} expanded={expanded}>
        <ListItemContainer key={index}>
          <ListContentContainer onClick={this.toggleExpanded}>
            <InfoDiv>
              {infoItems.map((data: IProp, infoIndex) => (
                <LabelValue
                  key={infoIndex}
                  label={data.label}
                  value={data.value}
                />
              ))}
            </InfoDiv>
            <StatusDiv>
              {statusItems.map((status: IStatus, infoIndex) => (
                <StyledStatus key={infoIndex}>
                  {status.icon}
                  <span>{status.label}</span>
                </StyledStatus>
              ))}
            </StatusDiv>
          </ListContentContainer>
          <ListItemAction
            actions={actions}
            expanded={expanded}
            onExpand={
              this.props.expandedCellRenderer ? this.toggleExpanded : undefined
            }
          />
        </ListItemContainer>

        <ExpandedCellContainer expanded={expanded}>
          {expanded && (
            <ExpandedCellContent>
              {this.props.expandedCellRenderer(itemData, index)}
            </ExpandedCellContent>
          )}
        </ExpandedCellContainer>
      </Wrapper>
    )
  }
}