import FormBlock from './FormBlock'
import FormInput from './FormInput'
import FormSelect from './FormSelect'
import FormList from './FormList'
import FormCheckbox from './FormCheckbox'

const getSchema = (schema, key) => {
  if (Array.isArray(schema))
    return Object.values(schema).find(s => s.name === key && s.modifiable)
  else return schema.name === key && schema.modifiable ? schema : undefined
}

export const createComponent = (schema, entity, config, key, value, path) => {
  const schemaItem = getSchema(schema, key)
  if (schemaItem) {
    if (
      typeof schemaItem.type !== 'undefined' &&
      entity.domain !== schemaItem.type
    ) {
      return null
    }
    const schemaPath = path ? path : key
    switch (schemaItem.display) {
      case 'block':
      case 'line':
        return (
          <FormBlock
            path={schemaPath}
            schema={schemaItem}
            values={value}
            type={schemaItem.display}
            entity={entity}
            config={config}
          />
        )
      case 'dropdown':
        return (
          <FormSelect path={schemaPath} schemaItem={schemaItem} value={value} config={config} />
        )
      case 'selectable-list':
        return (
          <FormList path={schemaPath} schemaItem={schemaItem} value={value} config={config} />
        )
      case 'checkbox':
        return (
          <FormCheckbox path={schemaPath} schemaItem={schemaItem} value={value} config={config} />
        )
      default:
        return (
          <FormInput path={schemaPath} schemaItem={schemaItem} value={value} config={config} />
        )
    }
  } else return null
}
