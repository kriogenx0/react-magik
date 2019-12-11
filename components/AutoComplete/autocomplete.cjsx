# Renders the an autocomplete input

Fuzzy = require 'fuzzy'
Pill = require './pill'
AutoCompleteRow = require './autocomplete-row'

BaseStore = require 'stores/base-store'
BaseModel = require 'models/base-model'

TrackModel = require 'models/track-model'

module.exports = React.createClass
  displayName: 'Autocomplete'

  propTypes:
    onFooterClick: PropTypes.func
    onChange: PropTypes.func
    onFocus: PropTypes.func
    onAdd: PropTypes.func
    options: PropTypes.array
    selected: PropTypes.array
    footerTitle: PropTypes.string
    compact: PropTypes.bool
    placeholder: PropTypes.string
    name: PropTypes.string
    detect: PropTypes.oneOf(['email'])
    allowAdd: PropTypes.bool
    limit: PropTypes.number
    className: PropTypes.string
    store: PropTypes.func # this should be a ModelStore (eg. TrackStore)
    isValidResult: PropTypes.func
    formatAddMessage: PropTypes.func

  getDefaultProps: ->
    onFooterClick: ->
    onChange: ->
    onFocus: ->
    onAdd: ->
    isValidResult: -> true
    formatAddMessage: (value) ->
      <span>Add "<span className='strong'>{value}</span>" (press enter)</span>
    options: []
    selected: []
    footerTitle: null
    compact: false
    placeholder: null
    name: null
    detect: null
    allowAdd: false
    limit: Infinity
    className: ''
    store: null
    queryOptions: {}

  getInitialState: ->
    chosen: @props.selected
    options: []
    focusedRow: -1
    focusedPill: -1
    value: ''
    open: false

  componentWillMount: ->
    if @props.store
      @state.options = @getFilteredModels(@state.chosen)
      @props.store.addChangeListener @storeUpdated

      # We do not want to hammer the search API
      # Wait until user is done typing (wait 200ms), then search
      @handleSearchDebounced = _.debounce @doSearch, 200

  componentWillUnmount: ->
    if @props.store
      @props.store.removeChangeListener @storeUpdated

  componentDidMount: ->
    if @props.store
      @storeUpdated()
    else
      @setState options: @filterOptions()

  componentWillReceiveProps: (props) ->
    if !@isMounted()
      return

    if props.selected
      @setState
        chosen: props.selected
        options: if @props.store then @getFilteredModels(props.selected) else @filterOptions()

  componentDidUpdate: ->
    @resizeInput()
    @ensureFocusedRowVisible()

  storeUpdated: ->
    if @isMounted()
      @setState options: @getFilteredModels(@state.chosen)

  getFilteredModels: (chosen) ->
    chosenIds = _.map chosen, (model) -> model.get('id')

    @props.store.getCollection().filter (model) =>
      @props.isValidResult(model) and model.get('id') not in chosenIds

  doSearch: ->
    queryParams = _.extend {}, {search: @state.value}, @props.queryOptions
    @props.store.actions.objectListSearch queryParams

  emailPattern: "^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$"

  handleSelect: (option, e) ->
    willClose = false

    if e
      e.preventDefault()

    if e and (e.which is 3 or e.button is 2)
      return # ignore right click

    if !option
      return

    # we should close the dropdown on mouse click
    if e and e.button is 0
      willClose = true

    # close after selecting one option if limit is one
    if @props.limit is 1
      willClose = true

    # When you can only have one selection, clear chosen values and replace with selection.
    chosen = @state.chosen
    if (@props.limit is 1 and @state.chosen.length)
      chosen = []

    chosen = chosen.concat option

    @setState
      chosen: chosen
      value: ''
    , =>
      @handleChange()
      if willClose # close overlay
        @handleToggle()
        @refs.input.getDOMNode().blur()

  handleClickAdd: (e) ->
    if e
      e.preventDefault()

    if @props.detect
      @detectSpecial()
    else
      @handleAdd()

  handleAdd: (e) ->
    if e
      e.preventDefault()

    unless @props.store
      @handleSelect
        title: @state.value
        value: @state.value

    @props.onAdd @state.value

    # set value first so filterOptions picks it up
    @state.value = ''
    @setState
      value: @state.value
      options: @filterOptions()

  handleRemoveAll: (e) ->
    e.preventDefault()
    @handleToggle()
    @setState chosen: [], @handleChange

  handleRemove: (item) ->
    if @props.store
      chosen = _.filter @state.chosen, (model) -> model.get('id') != item.get('id')
    else
      chosen = _.filter @state.chosen, (object) -> object.value != item.value

    @setState
      chosen: chosen
    , @handleChange

  handleChange: ->
    @setState options: @filterOptions()
    @props.onChange @state.chosen

  compare: (a, b) ->
    if a.title < b.title
      return -1
    if a.title > b.title
      return 1
    return 0

  handleTagContainerClick: (e) ->
    e.stopPropagation()
    if !@state.open
      @clearValue()

    # Make the autocompleter act like a select input
    if @props.limit is 1 and @state.options.length
      @handleToggle()

    @refs.input.getDOMNode().focus()

  resizeInput: ->
    # when we add or remove a pill item, we need to resize the input

    padding = 6 # padding between items and edge of input
    tagHeight = 28 # height of a tag item
    itemMargin = 4 # margin between tags (vertically)

    $tags = $(@refs.tags.getDOMNode())
    $input = $(@refs.input.getDOMNode())
    $lastTag = $tags.find('.autocomplete_chosen_item').last()

    maxWidth = $input.innerWidth()
    height = $tags.innerHeight() - itemMargin
    width = $tags.innerWidth()

    if $lastTag.position()
      left = $lastTag.position().left + $lastTag.innerWidth() + padding
    top = height - padding - tagHeight

    # move to newline if the remaining typing space is less than 100 px
    if (maxWidth - left) < 100 and !!$lastTag.position() and (@state.chosen.length < @props.limit)
      height = $tags.innerHeight() + tagHeight
      left = padding
      top = height - padding - tagHeight

    # if no tags exist, reset to starting measurements
    if !$lastTag.position()
      height = ""
      top = ""
      left = ""
      padding = ""

    $input.css
      paddingTop: top
      height: height
      paddingBottom: padding
      paddingLeft: left

  incrementFocusedRow: ->
    rowIndex = if @state.focusedRow >= @state.options.length - 1 then @state.options.length - 1 else @state.focusedRow + 1
    @setState focusedRow: rowIndex

  decrementFocusedRow: ->
    rowIndex = if @state.focusedRow <= 0 then 0 else @state.focusedRow - 1
    @setState focusedRow: rowIndex

  ensureFocusedRowVisible: ->
    $container = $(@refs.scroll.getDOMNode())
    el = $container.find('.is-focused')
    if el.length <= 0
      return
    $el = $(el[0])

    offsetTop = $el.position().top

    if (offsetTop + $el.innerHeight()) > $container.innerHeight()
      scrollTo = offsetTop - $container.innerHeight() + $el.innerHeight()
    else
      scrollTo = 0

    @refs.scroll.getDOMNode().scrollTop = scrollTo

  handleKeyUp: (e) ->
    if e.keyCode is 40 # downarrow
      return

    if e.keyCode is 38 # uparrow
      return

    if e.keyCode is 32 # spacebar
      if @props.detect
        @detectSpecial()

  handleValueChange: (e) ->
    @setState
      value: e.target.value
      options: @filterOptions()

  handleKeyDown: (e) ->

    if e.keyCode is 40 # downarrow
      @incrementFocusedRow()
      return

    if e.keyCode is 38 # uparrow
      @decrementFocusedRow()
      return

    if e.keyCode is 8 # backspace
      @handleDelete()
      return

    if e.keyCode is 9 # tab
      @handleToggle()
      return

    if e.keyCode is 13 # enter
      e.preventDefault()
      @handleEnter()
      return

    @setState focusedPill: -1 # unfocus any pill after typing

  detectSpecial: ->
    if @props.detect
      detect = @props.detect.split('|')
      if 'email' in detect
        @detectEmail()
        return

    if @props.allowAdd and @state.value isnt ''
      @handleAdd()

  clearValue: ->
    @setState value: ''

  detectEmail: ->
    if @state.value.replace(/\s+/g, "").match @emailPattern
      @handleSelect
        title: @state.value
        value: @state.value

  handleDelete: ->
    if @state.value is ''
      if @state.focusedPill >= 0
        @handleRemove(@state.chosen[@state.focusedPill], @state.focusedPill)
        @setState focusedPill: -1
      else
        @setState focusedPill: @state.chosen.length - 1

  handleEnter: ->
    if @state.focusedRow >= 0
      @handleSelect(@state.options[@state.focusedRow])
    else
      @detectSpecial()

  filterOptions: ->

    if not @props.store

      # Remove already selected options from search
      chosenValues = _.pluck @state.chosen, 'value'

      list = _.filter @props.options, (option) ->
        option.value not in chosenValues

      # String search on option.title
      results = Fuzzy.filter(@state.value, list, extract: (el) -> el.title).map((res) -> res.original)

      # Order alphabetically
      results.sort(@compare)

      # Return filtered, ordered list
      return results

    else

      @handleSearchDebounced()

      return []

  handleBlur: ->
    @setState
      focusedRow: -1
      focusedPill: -1

    setTimeout @clearValue, 200

  handleToggle: (e) ->
    if e and e.target.nodeName is 'INPUT' and @state.open
      return

    @setState({open: !@state.open}, => # setting state is not instant
      if !@state.open
        window.removeEventListener('click', @handleToggle)
      else
        window.addEventListener('click', @handleToggle)
    )

  handleInputFocus: (e) ->
    @props.onFocus()
    @handleToggle(e)

  handleDropdownClick: (e) ->
    e.stopPropagation()

  handleFooterClick: (e) ->
    e.preventDefault()
    @props.onFooterClick()
    @handleToggle()



  render: ->

    classes = ['twd twd-short autocomplete l-full-width', @props.className]

    if @state.open
      if @state.options.length > 0 or @state.value isnt ''
        classes.push('is-open')
    if @props.limit is 1
      classes.push('is-single')

    <div className={classes.join(' ')}>

      <input
        onBlur={@handleBlur}
        onFocus={@handleInputFocus}
        value={@state.value}
        className="txt l-full-width twd_input"
        placeholder={if @state.chosen.length >= @props.limit then '' else @props.placeholder}
        onKeyUp={@handleKeyUp}
        onKeyDown={@handleKeyDown}
        onChange={@handleValueChange}
        disabled={@state.chosen.length >= @props.limit}
        ref="input"/>

      <div className="twd_dropdown ddn" ref="dropdown" onClick={@handleDropdownClick}>
        <div className="twd_dropdown_scroll" ref="scroll">
          <ul className="autocomplete_options lst #{if @props.compact then 'lst-compact' else ''}">

            {if @state.options.length is 0 and !@props.allowAdd and @state.value isnt ''
              <li className="lst_row l-half-padded deemphasized">No matching results.</li>
            }

            {for option, index in @state.options
              <AutoCompleteRow
                key={if option instanceof BaseModel then option.get('id') else option.value}
                data={option}
                isFocused={@state.focusedRow is index}
                onClick={@handleSelect.bind(@, option)}
                type={@props.type} />
            }

            {if @state.chosen.length and @props.limit is 1
              <li className="lst_row lst_row-divider-above is-deletable">
                <a href="#" onClick={@handleRemoveAll}>Clear selection</a>
              </li>
            }
          </ul>
        </div>
        {if @props.allowAdd and @state.value isnt ''
          <div className="twd_footer">
            <a href="#" onClick={@handleClickAdd} className="twd_footer_link">{@props.formatAddMessage(@state.value)}</a>
          </div>
        else
          <div>
          {if @props.footerTitle
            <div className="twd_footer">
              <a href="#" tabIndex="-1" className="twd_footer_link" onClick={@handleFooterClick}>{@props.footerTitle}</a>
            </div>
          }
          </div>
        }
      </div>
      <div className="autocomplete_chosen" ref="tags" onClick={@handleTagContainerClick}>
        {for chosen, i in @state.chosen
          <div
            className="autocomplete_chosen_item"
            key={if chosen instanceof BaseModel then chosen.get('id') else chosen.value}
          >
            <Pill
              closable={if (@props.limit isnt 1) then true else false}
              name={if chosen instanceof BaseModel then chosen.get('name') else chosen.title}
              color={if chosen instanceof TrackModel then chosen.get('color') else null}
              onClose={@handleRemove.bind(@, chosen)}
              className="#{if @state.focusedPill is i then 'is-focused' else ''} autocomplete_chosen_item_pill" />
          </div>
        }
      </div>
    </div>
