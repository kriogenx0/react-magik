# List Table Rows
Link = require('react-router').Link
Checkbox = require './inputs/checkbox'
PVR = require './pvr'
IconButton = require './icon-button'

###
Fields
For each object in fields collection:
Required properties:
* propName - string or function(called with record as parameter) that returns the correlating property name for the data given
Optional properties:
* label - how the field displays, only used in list table at the moment
* link - where the table data points to, can be string or function(called with record as parameter)

Example

fields = [
  {
    label: 'Name'
    propName: (item) ->
      item['name']?['en-US']
    link: (item) ->
      item['url']?
  },


###

module.exports = React.createClass

  displayName: 'ListTableRow'

  propTypes:
    onCheckboxChange: PropTypes.func
    isChecked: PropTypes.bool

  getDefaultProps: ->
    showCheckbox: true
    fields: null
    record: null
    isChecked: false
    itemActions: null
    onCheckboxChange: ->

  contextTypes:
    currentLocale: PropTypes.string

  handleCheckChange: (checked) ->
    @props.onCheckboxChange(checked, @props.record.get 'id')

  render: ->
    <tr ref="row" data-id={@props.record.get 'id'} data-relation-id={@props.record.getItemRelation()?.id}>
      {
        ### Checkbox Column ###
      }
      {if @props.showCheckbox
        <td width="1">
          <Checkbox flush="true" className="l-v-align-middle" checked={@props.isChecked} onChange={@handleCheckChange}/>
        </td>
      }
      {
        ### Fields with Data ###
      }
      {for field, index in @props.fields
        displayValue = if typeof field.getValue is 'function'
          field.getValue.call @props.record, @props.record
        else if field.name
          @props.record[field.name]

        <td className="title-column" key={index}>
          <div >
            {if field.linkTo
              <Link to={field.linkTo} params={if typeof field.linkParams is 'function' then field.linkParams.call(@props.record, @props.record) else null} className="gray-link strong">{displayValue}</Link>
            else if typeof field.link is 'function'
              <a href={field.link.call @props.record, @props.record}>{displayValue}</a>
            else
              <span>{displayValue}</span>
            }
          </div>
        </td>
      }
      {
        ### Last Column ###
      }
      {if @props.itemActions
        <td width="1">
          <PVR toggleClassName="btn btn-small" className="l-text-align-left pvr-anchor-right" toggleContents={<span className="icn icn-gear l-v-align-middle" />}>
            <ul className="lst">
              {for item, index in @props.itemActions
                <li className="lst_row" key={index}>
                  <a href="javascript: void(0)" onClick={item.action.bind null, @props.record}>{item.label}</a>
                </li>
              }
            </ul>
          </PVR>
        </td>
      }
      {if @props.isDraggable
        <td width="1" style={opacity: if @props.dragDisabled then .35 else 1}>
          <IconButton tooltipGravity='e' className="bti-rearrange #{if @props.dragDisabled then 'cursor-disabled' else ''}" name="sort-handle" title={if @props.dragDisabled then 'Manual reordering not available while a sort or filter is applied.' else ' '}/>
        </td>
      }
    </tr>
