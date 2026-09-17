const goldenMetricQueries = [
  {
    title: 'Interactions',
    query: `select count(*) from Mobile WHERE category = 'Interaction' TIMESERIES `,
  },
  {
    title: 'HTTP Requests per minute',
    query: `select rate(count(*), 1 minute) from MobileRequest TIMESERIES `,
  },
  {
    title: 'HTTP response time (95%) (s)',
    query: `select percentile(responseTime,95) from MobileRequest TIMESERIES `,
  },
  {
    title: 'HTTP errors and network failures',
    query: `select count(*) from MobileRequestError TIMESERIES `,
  },
  {
    title: 'Crashes',
    query: `select count(*) from MobileCrash TIMESERIES `,
  },
  {
    title: 'ANRs',
    query: `select count(*) from MobileApplicationExit TIMESERIES `,
  },
]

export { goldenMetricQueries }
