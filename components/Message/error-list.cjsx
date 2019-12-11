# Renders a re-usable error list for field validation for async forms posted to the server.
Helpers = require 'utils/cjsx_helpers'

module.exports = React.createClass
  getDefaultProps: ->
    errors: {}

  render: ->
    <ul className="errorList l-v-spaced">
      {for key of @props.errors
        <li key={key}>
          <span style={width: 10, height: 10, background: '#ea5f5f', display: 'inline-block', borderRadius: '50%'} className="l-h-right-half-spaced l-v-align-middle"/>
          {if key isnt 'non_field_errors'
            <strong className="strong l-v-align-middle">{Helpers.capitalize(key)}: </strong>
          }
          <span className="l-v-align-middle">{@props.errors[key]}</span>
        </li>
      }
    </ul>
