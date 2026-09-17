import React from 'react'
import { Checkbox, Tooltip } from 'nr1'
import { transformCamelCaseForDisplay } from '../../utils/text-formatter'
import { withConfigContext } from '../../context/ConfigContext'

const DEFAULT_REQUIRED_MESSAGE = 'Required field'
const FormCheckbox = ({ path, schemaItem, value, config, changeConfigItem }) => {
  return (
    <Tooltip
      placementType={Tooltip.PLACEMENT_TYPE.RIGHT}
      text={schemaItem.desc}
    >
        <Checkbox
          value={value}
          label={schemaItem.title ? schemaItem.title : transformCamelCaseForDisplay(schemaItem.name)}
          checked={value}
          disabled={typeof schemaItem.enabled !== 'undefined' && !schemaItem.enabled(config)}
          onChange={event =>
            changeConfigItem(path, event.target.checked)
          }
          className="config-form__item"
        />
    </Tooltip>
  )
}

export default withConfigContext(FormCheckbox)
