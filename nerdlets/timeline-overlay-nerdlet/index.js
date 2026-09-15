import React from 'react'
import { NerdletStateContext } from 'nr1'
import TimelineContainer from '../../src/components/timeline/TimelineContainer'
import { ConfigProvider } from '../../src/context/ConfigContext'

export default class Wrapper extends React.Component {
  render() {
    return (
      <NerdletStateContext.Consumer>
        {({
          filter,
          groupingValue,
          groupingDate,
          duration,
          entityGuid,
          accountId,
          config,
        }) => (
          <ConfigProvider entityGuid={entityGuid}>
            <TimelineContainer
              accountId={accountId}
              entityGuid={entityGuid}
              filter={filter}
              groupingValue={groupingValue}
              groupingDate={groupingDate}
              duration={duration}
              config={config}
            />
          </ConfigProvider>
        )}
      </NerdletStateContext.Consumer>
    )
  }
}
