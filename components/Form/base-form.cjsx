# Renders a modular, re-usable base form that abstracts
# boilerplate logic and UI patterns.
#
# Usage:
#
# BaseForm = require './base-form'
# module.exports = React.createClass
#   getDefaultProps: ->
#     formURL: "#{Config.urls.API_URL}auth/login/"
#     fields: [
#       {fieldName: 'username', inputType: 'text', displayName: 'Username'},
#     ]
#   # Custom 200 response logic.
#   handle200: (response) ->
#     # Do something custom here.
#   render: ->
#       <h1>Log In</h1>
#       <BaseForm
#         action={@props.formURL}
#         handle200={@handle200}
#         fields={@props.fields}
#         submitValue="Log In"
#       />
ErrorList = require './error-list'
BaseInput = require './base-input'
asyncUtils = require '../../../utils/async'
BaseActions = require '../../../actions/base-actions'

module.exports = React.createClass
  getDefaultProps: ->
    fields: []
    submitValue: 'Submit'
    submittingValue: 'Submitting...'
    handle200: null
    handle201: null
    handle400: null
    autoSelectFirst: false
    showSubmit: true
    shouldSubmit: false
    onSubmit: ->

  componentWillReceiveProps: (newProps) ->
    if newProps.shouldSubmit is true
      if !@state.isSubmitting
        @handleSubmit()

  getInitialState: ->
    formErrors: []
    isSubmitting: false

  # Handle a response with `status_code` 200 (success)
  handle200: (response) ->
    # Always clear the form errors
    this.setState formErrors: []

    # Call the optional callback to further process the response
    if @props.handle200
      @props.handle200 response

  # Handle a response with `status_code` 201 (success: new object)
  handle201: (response) ->
    # Always clear the form errors
    this.setState formErrors: []

    # Call the optional callback to further process the response
    if @props.handle201
      @props.handle201 response

  # Handle a response with `status_code` 400 (error)
  handle400: (response) ->
    # Always set the form errors
    this.setState formErrors: response.responseJSON

    # Call the optional callback to further process the response
    if @props.handle400
      @props.handle400 response

  # Handle a response with `status_code` 404 (page not found)
  handle404: (response) ->
    # Set the form errors
    this.setState formErrors: {'SERVER ERROR': '404 - Page not found.'}

  handleSubmit: (e) ->
    if e
      e.preventDefault()

    @setState isSubmitting: true, =>

      @props.onSubmit()

      # Make an async call to gears to create a new account
      asyncUtils.BaseAsync.request
        url: $(@refs.form.getDOMNode()).attr("action")
        data: $(@refs.form.getDOMNode()).serialize()
        type: "post"
        crossDomain: true
        xhrFields:
          withCredentials: true
        complete: (jqXHR, textStatus, response) =>

          @setState isSubmitting: false

          if jqXHR.status is 200
            @handle200 jqXHR
          else if jqXHR.status is 201
            @handle201 jqXHR
          else if jqXHR.status is 400
            @handle400 jqXHR
          else if jqXHR.status is 404
            @handle404 jqXHR
          else if jqXHR.status >= 500 or jqXHR.status is 0
            BaseActions.internalServerError()

  render: ->
    <form
      method="POST"
      ref="form"
      action={@props.action}
      onSubmit={@handleSubmit}
    >
      <ErrorList errors={@state.formErrors} />

      <div className="form">
        {for field, i in @props.fields
          <BaseInput
            displayName={field.displayName}
            inputType={field.inputType}
            fieldName={field.fieldName}
            key={field.fieldName}
            autoSelect={(i is 0 and @props.autoSelectFirst)}
            centered={@props.centered || false}
          />
        }
        {if @props.children
          @props.children
        }
        <div style={display: if @props.showSubmit then 'block' else 'none'}>
          {if @state.isSubmitting
            <button className="btn btn-primary #{@props.submitButtonClass} l-full-width is-disabled">{@props.submittingValue}</button>
          else
            <input type="submit" value={@props.submitValue} className="btn btn-primary l-full-width #{@props.submitButtonClass}" ref="submit" />
          }
        </div>
      </div>
    </form>
