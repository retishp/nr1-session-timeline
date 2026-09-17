import React from 'react'
import PropTypes from 'prop-types'
import {
  BlockText,
  NrqlQuery,
  Spinner,
  Table,
  TableHeader,
  TableHeaderCell,
  TableRow,
  TableRowCell,
  SparklineTableRowCell,
} from 'nr1'
import startCase from 'lodash.startcase'
import { withConfigContext } from '../../context/ConfigContext'
import SectionHeader from '../section-header/SectionHeader'
import { getEntityCondition } from '../../utils/queries'
const dayjs = require('dayjs')
const customParseFormat = require('dayjs/plugin/customParseFormat')

class SearchResults extends React.Component {
  flattenData = data => {
    const {
      config: { groupingAttribute },
    } = this.props
    let flattened = []

    for (let d of data) {
      const name = d.metadata.name
      flattened = flattened.concat(
        d.data.map(item => {
          return { date: name, value: item[groupingAttribute] }
        })
      )
    }

    return flattened
  }

  getGoldenMetricQuery = (query, searchValue, dateValue) => {
    const {
      config: { groupingAttribute },
    } = this.props

    // convert the string to a date and then back into a string format usable by NR1
    dayjs.extend(customParseFormat)
    const dateFormat = 'YYYY-MM-DD HH:mm:ss'
    const dayOfStart = dayjs(dateValue, 'MMMM D, YYYY')
      .hour(0)
      .minute(0)
      .second(0)
      .format(dateFormat)
    const dayOfEnd = dayjs(dayOfStart)
      .add(86399, 'second')
      .format(dateFormat)

    return `${query} MAX WHERE ${groupingAttribute} = '${searchValue}' and dateOf(timestamp) = '${dateValue}' SINCE '${dayOfStart}' UNTIL '${dayOfEnd}'`
  }

  onChooseGrouping = (evt, { item, index }) => {
    const { chooseGrouping } = this.props
    chooseGrouping(item.date, item.value)
  }

  shouldComponentUpdate(nextProps) {
    const { selected, duration } = this.props
    const nextSelected = nextProps.selected
    const nextDuration = nextProps.duration

    if (selected != nextSelected || duration != nextDuration) return true
    else return false
  }

  renderTable = data => {
    const {
      goldenMetricQueries,
      entity: { accountId },
      config: { groupingAttribute },
    } = this.props

    return (
      <Table items={data} compact>
        <TableHeader>
          <TableHeaderCell className="search-results__table-header">
            Date
          </TableHeaderCell>
          <TableHeaderCell className="search-results__table-header">
            {startCase(groupingAttribute)}
          </TableHeaderCell>
          {goldenMetricQueries.map(q => (
            <TableHeaderCell className="search-results__table-header">
              {q.title}
            </TableHeaderCell>
          ))}
        </TableHeader>

        {({ item }) => (
          <TableRow onClick={this.onChooseGrouping}>
            <TableRowCell className="search-results__row">
              {item.date}
            </TableRowCell>
            <TableRowCell className="search-results__row">
              {item.value}
            </TableRowCell>
            {goldenMetricQueries.map(q => (
              <SparklineTableRowCell
                className="search-results__row"
                accountIds={[accountId]}
                query={this.getGoldenMetricQuery(
                  q.query,
                  item.value,
                  item.date
                )}
              />
            ))}
          </TableRow>
        )}
      </Table>
    )
  }

  render() {
    const {
      entity,
      selected,
      duration,
      config,
    } = this.props
    const { groupingAttribute, searchAttribute, rootEvent: event } = config
    const { accountId } = entity
    const entityCondition = getEntityCondition(entity.guid, entity.domain, config)
    const query = `FROM ${event} SELECT uniques(${groupingAttribute}) WHERE ${entityCondition} ${searchAttribute}='${selected}' ${duration.since} FACET dateOf(timestamp) LIMIT MAX `

    return (
      <React.Fragment>
        {!selected && <div></div>}
        {selected && (
          <div className="search-results">
            <SectionHeader
              header={`Results for ${selected} (click to view timeline)`}
              subheader="Per day"
            />
            <div className="search-results__table">
              <NrqlQuery accountIds={[accountId]} query={query}>
                {({ data, error, loading }) => {
                  if (loading) return <Spinner fillContainer />
                  if (error) return <BlockText>{error.message}</BlockText>

                  if (!data) return <div>No results found</div>
                  return this.renderTable(this.flattenData(data))
                }}
              </NrqlQuery>
            </div>
          </div>
        )}
      </React.Fragment>
    )
  }
}

SearchResults.propTypes = {
  entity: PropTypes.object.isRequired,
  selected: PropTypes.string.isRequired,
  chooseGrouping: PropTypes.func.isRequired,
  duration: PropTypes.object.isRequired,
}

export default withConfigContext(SearchResults)
