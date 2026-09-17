export function getEntityCondition(entityGuid, entityDomain, config) {
  if (entityDomain === 'BROWSER') {
    return `entityGuid = '${entityGuid}' AND`
  }

  if (config.includeBrowserEvents || config.includeLogEvents) {
    return ''
  }

  return `entityGuid = '${entityGuid}' AND`
}
