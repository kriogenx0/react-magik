# List Table is a View for showing tabular data
_ = require 'underscore'

EmptyView = require './empty-view'
Checkbox = require './inputs/checkbox'
ListTableRow = require './list-table-row'

require '../../../bower_components/jquery-ui/jquery-ui'

module.exports = React.createClass

  displayName: 'ListTable'

  data: null
  lastDataLength: null

  getDefaultProps: ->
    fields: null
    data: null # Table Data as collection or models
    showCheckbox: true
    showActions: true
    emptyMessage: 'No Data Available'
    isDraggable: false
    itemActions: null # Collection of Labels and callbacks for each item action
    onSelectChange: -> # Passes count
    onMasterCheckboxChange: ->
    selectAll: false
    selectedItems: {}
    masterSelected: false

  getInitialState: ->
    data: null
    sortField: ""
    sortOrder: true

  handleSort: (key) ->
    @setState { sortOrder: !@state.sortOrder, sortField: key }, =>
      @props.actions.objectListSort { field: key, order: if @state.sortOrder then 'asc' else 'desc' }

  handleLoadMore: ->
    @props.actions.objectListLoadMore()

  componentDidMount: ->
    @refreshManualReorder()

  componentDidUpdate: ->
    @refreshManualReorder()

  componentWillUnmount: ->
    @destroySortable()

  refreshManualReorder: ->
    if @props.isDraggable and !@props.dragDisabled
      $(@refs.sort.getDOMNode()).sortable({
        items: "> tr"
        handle: ".bti-rearrange"
        placeholder: "srt_placeholder"
        opacity: .9
        forceHelperSize: false
        cursorAt: { right: 0, bottom: 0 }
        helper: (event, ui) ->
          title = $(ui).find('.title-column  a').html()
          helper = $("<div><span class='srt_helper_title'>#{title}</span></div>").addClass('srt_helper')
        start: (event, ui) =>
          $('body').addClass('force-hide-tooltips')
          @originalIndex = $(ui.item).index()
          @draggedId = ui.item[0].dataset.id
          @dragged = $(ui.item)

        stop: (event, ui) =>
          $('body').removeClass('force-hide-tooltips')
          event.preventDefault()

          newIndex = @dragged.index()

          return if newIndex is @originalIndex

          if newIndex is 0
            newRank = @props.data.at(newIndex).getRank() - 1
          else if newIndex is @props.data.length - 1
            newRank = @props.data.at(@props.data.length - 1).getRank() + 1
          else
            if @originalIndex > newIndex
              newRank = (@props.data.at(newIndex - 1).getRank() + @props.data.at(newIndex).getRank()) / 2
            else
              newRank = (@props.data.at(newIndex + 1).getRank() + @props.data.at(newIndex).getRank()) / 2

          @props.updateRank(@draggedId, newRank)

          _.defer =>
            $(@refs.sort.getDOMNode()).sortable("cancel")
      })
    else
      @destroySortable()

  destroySortable: ->
    if $(@refs.sort.getDOMNode()).sortable()
      $(@refs.sort.getDOMNode()).sortable("destroy")

  render: ->
    orderClass = if @state.sortOrder then "is-sort-ascending" else "is-sort-descending"

    <div>
      <table className="lta">
        <thead>
          <tr>
            {if @props.showCheckbox
              <td width="1">
                <Checkbox flush="true" className="l-v-align-middle" onChange={@props.onMasterCheckboxChange} checked={@props.masterSelected}/>
              </td>
            }
            {if @props.fields
              for field, index in @props.fields
                <td key={index}>
                  {
                    if field.sortable
                      <h5 className="lta_header lta_header-sortable #{if field.name? and field.name is @state.sortField then orderClass else ''}" onClick={@handleSort.bind(this, field.name)}>{field.label}</h5>
                    else
                      <h5 className="lta_header">{field.label}</h5>
                  }
                </td>
            }
            {if @props.showActions
              <td></td>
            }
            {if @props.isDraggable
              <td></td>
            }
          </tr>
        </thead>
        <tbody ref="sort" className="srt srt-table">
          {if @props.data
            if @props.children
              # Uses children to render each row
              React.Children.map @props.children, (child) =>
                for item, index in @props.data.models
                  React.addons.cloneWithProps child,
                    key: index
                    fields: @props.fields
                    record: item
                    isChecked: @props.selectedItems?[item.get 'id']
                    onCheckboxChange: @props.onSelectChange
                    itemActions: @props.itemActions
                    isDraggable: @props.isDraggable
                    dragDisabled: @props.dragDisabled

            else
              for item, index in @props.data.models
                <ListTableRow
                  key={index}
                  fields={@props.fields}
                  record={item}
                  isChecked={@props.selectedItems?[item.get 'id']}
                  onCheckboxChange={@props.onSelectChange}
                  itemActions={@props.itemActions}
                  isDraggable={@props.isDraggable}
                  dragDisabled={@props.dragDisabled}
                />
          }
        </tbody>
      </table>
      {if @props.data.hasNextPage()
        <a onClick={@handleLoadMore} className="btn btn-default">Load More</a>
      }
      {
        # No Data
        unless @props.data
          <EmptyView title={@props.emptyMessage} />
      }
    </div>
