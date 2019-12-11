# Component to search a store and return an array of models

Checkbox = require 'components/ui/inputs/checkbox'
ListHeader = require 'components/ui/list-header'

module.exports = React.createClass
  displayName: 'SearchStore'

  propTypes:
    stores: PropTypes.array
    headers: PropTypes.array
    placeholder: PropTypes.string
    queryParams: PropTypes.object
    selectedIds: PropTypes.array
    addResult: PropTypes.func
    removeResult: PropTypes.func
    filterResults: PropTypes.func

  getDefaultProps: ->
    stores: []
    headers: []
    placeholder: ''
    queryParams: {}
    selectedModels: []
    addResult: (resultId) ->
    removeResult: (resultId) ->
    filterResults: (results) -> results

  getInitialState: ->
    results: []
    focused: false

  componentWillMount: ->
    _.each @props.stores, (store, index) =>
      @state.results.push []
      store.addChangeListener @loadResults.bind(this, index)

    # We do not want to hammer the search API
    # Wait until user is done typing (wait 200ms), then search
    @debouncedSearch = _.debounce @search, 200

  componentWillUnmount: ->
    _.each @props.stores, (store, index) =>
      store.removeChangeListener @loadResults.bind(this, index)

    window.removeEventListener 'click', @handleToggle

  loadResults: (storeIndex) ->
    if @isMounted()
      results = @state.results
      results[storeIndex] = @props.filterResults(@props.stores[storeIndex].getCollection().models)
      @setState results: results

  search: ->
    @setState loading: true
    _.each @props.stores, (store) =>
      store.actions.objectListSearch(
        search: @refs.input.getDOMNode().value
      )

  handleInputChange: (event) ->
    event.preventDefault()
    @debouncedSearch()

  handleToggle: (event) ->
    event.stopPropagation()

    if event.target.nodeName is 'INPUT' and @state.focused
      return

    if @state.focused
      window.removeEventListener 'click', @handleToggle
    else
      window.addEventListener 'click', @handleToggle

    @setState focused: !@state.focused

  toggleResult: (result, event) ->
    event.preventDefault()
    event.stopPropagation()
    if result in @props.selectedModels
      @props.removeResult result
    else
      @props.addResult result

  handleClearClick: (event) ->
    event.preventDefault()
    event.stopPropagation()
    @refs.input.getDOMNode().value = ''
    @refs.input.getDOMNode().focus()
    @debouncedSearch()

  render: ->

    noResults = _.reduce(@state.results, ((memo, results) -> (memo + results.length)), 0) is 0

    formattedResults = []

    for store, i in @state.results
      formattedResults.push <ListHeader title={@props.headers[i]} key={i} />
      for result in store
        formattedResults.push(
          <li className="lst_row" key={result.get 'uuid'} onClick={@toggleResult.bind(this, result)}>
            <a href="#">
              {result.get 'name'}
              <Checkbox flush={true} checked={result in @props.selectedModels} className="lst_row_checkbox" />
            </a>
          </li>
        )

    <div className="twd #{if @state.focused is true then 'is-open' else ''} #{if @state.loading is true then 'is-loading' else ''}" onClick={@stopPropagation}>
      <div className="inp inp-has-clear">
        <a href="#" className="inp_clear #{if @state.value is '' then 'is-hidden' else ''}" onClick={@handleClearClick}></a>
        <input
          className="txt twd_input l-full-width inp_field"
          ref="input"
          placeholder={@props.placeholder}
          onChange={@handleInputChange}
          onFocus={@handleToggle} />
      </div>
      <div className="twd_dropdown ddn">
        <div className="twd_dropdown_scroll l-v-half-padded">
          <ul className="lst lst-multiselect lst-simple">
            {if noResults
              <li className="lst_row l-h-half-padded"><p className="deemphasized">No matches.</p></li>
            else
              formattedResults
            }
          </ul>
        </div>
      </div>
    </div>
