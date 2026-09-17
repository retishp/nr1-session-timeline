import React from 'react'
import { schema } from '../../data/packSchema'
import { Select, SelectItem, Tooltip } from 'nr1'
import { transformCamelCaseForDisplay } from '../../utils/text-formatter'
import { withConfigContext } from '../../context/ConfigContext'
import FormInput from './FormInput'

const FormSelect = ({
  path,
  schemaItem,
  value,
  config,
  lookupValue,
  changeConfigItem,
}) => {
  const selectItems = lookupValue(schemaItem.source).filter(
    item => {
      const sourceSchemaItem = schema.find(item => item.name === schemaItem.source)
      return !sourceSchemaItem ||
        typeof sourceSchemaItem.enabled === 'undefined' ||
        sourceSchemaItem.enabled(config, item)
    })

  return (
    <Tooltip
      placementType={Tooltip.PLACEMENT_TYPE.RIGHT}
      text={schemaItem.desc}
    >
      {selectItems ? (
        <Select
          className="config-form__item"
          value={value}
          onChange={(event, value) => changeConfigItem(path, value)}
          required={schemaItem.mandatory}
          disabled={typeof schemaItem.enabled !== 'undefined' && !schemaItem.enabled(config)}
          invalid={
            schemaItem.mandatory && !value ? 'Please select a value' : ''
          }
          label={
            schemaItem.title
              ? schemaItem.title
              : transformCamelCaseForDisplay(schemaItem.name)
          }
        >
          <SelectItem value="">Choose One</SelectItem>
          {selectItems.map(item => (
            <SelectItem value={item.name}>{item.name}</SelectItem>
          ))}
        </Select>
      ) : (
        <FormInput path={path} schemaItem={schemaItem} value={value} config={config} />
      )}
    </Tooltip>
  )
}

export default withConfigContext(FormSelect)
