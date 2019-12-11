# this creates an alert dialog. It requires the `alert-mixin` mixin to function properly
# check out the `alert-mixin` docstring for usage

module.exports = React.createClass
  displayName: 'Alert'

  getDefaultProps: ->
    confirmTitle: 'Confirm'
    cancelTitle: 'Cancel'
    type: 'text'
    onCancel: ->
    onConfirm: (value) ->

  componentDidMount: ->
    @bindKeys()
    if @props.type is 'input'
      @refs.input.getDOMNode().focus()

  componentWillUnmount: ->
    @unBindEsc()

  bindKeys: ->
    $(document).on 'keyup.closeAlert', (e) =>
      if e.keyCode is 27
        @handleCancel()
      if e.keyCode is 13
        @handleConfirm()

  unBindEsc: ->
    $(document).off 'keyup.closeAlert'

  handleCancel: (e) ->
    if e
      e.preventDefault()
    @unBindEsc()
    @props.onCancel()

  handleConfirm: (e) ->
    if e
      e.preventDefault()
    @unBindEsc()
    if @props.type is 'input'
      @props.onConfirm(@refs.input.getDOMNode().value)
    else
      @props.onConfirm(null)

  render: ->
    <div className={"lrt l-v-spaced v-centered-fixed-canvas"}>
      <div className="lrt_container">
        <h2 className="lrt_title l-v-bottom-spaced">{@props.title}</h2>
        <p className="lrt_message l-v-bottom-spaced">{@props.message}</p>
        {if @props.type is 'input'
          <input className="txt l-full-width l-v-bottom-spaced" ref="input"/>
        }
        <div className="lrt_buttons">
          <a href="#" className="btn btn-primary" onClick={@handleConfirm}>{@props.confirmTitle}</a>
          <a href="#" className="btn" onClick={@handleCancel}>{@props.cancelTitle}</a>
        </div>
      </div>
    </div>
