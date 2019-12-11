# Tooltip component
#

module.exports = React.createClass
  displayName: "Tooltip"

  propTypes:
    title: React.PropTypes.string.isRequired
    gravity: React.PropTypes.oneOf(['n', 'w', 'e', 's'])
    className: React.PropTypes.string

  getDefaultProps: ->
    title: null
    gravity: 'n'
    className: null
    margin: 5

  getInitialState: ->
    title: @props.title

  tip: null
  el: null

  componentDidMount: ->
    @tip = $('.ttp')
    @el = $(@refs.el.getDOMNode())
    @el.removeAttr('title') # remove title so it doesnt show the native tooltip

  componentWillReceiveProps: (newProps) ->
    if newProps.title
      @setState title: newProps.title

  positionTip: (callback) ->
    tipWidth = @tip.innerWidth()
    tipHeight = @tip.innerHeight()
    elWidth = @el.innerWidth()
    elHeight = @el.innerHeight()
    elLeft = @el.offset().left
    elTop = @el.offset().top

    if @props.gravity is 'n'
      left = elLeft + (elWidth / 2) - (tipWidth / 2)
      top = elTop - tipHeight - @props.margin
    else if @props.gravity is 's'
      left = elLeft + (elWidth / 2) - (tipWidth / 2)
      top = elTop + elHeight + @props.margin
    else if @props.gravity is 'w'
      left = elLeft - tipWidth - @props.margin
      top = elTop + (elHeight / 2) - (tipHeight / 2)
    else if @props.gravity is 'e'
      left = elLeft + elWidth + @props.margin
      top = elTop + (elHeight / 2) - (tipHeight / 2)

    @tip.css
      left: left
      top: top

    @tip.addClass("ttp-#{@props.gravity}")

  handleMouseOver: ->
    if @state.title and @state.title isnt ''
      @tip.find('.ttp_body').append(@state.title)
      @positionTip()
      @tip.show()

  handleMouseOut: ->
    @tip.hide()
    @tip.find('.ttp_body').html('')
    @tip.removeClass("ttp-#{@props.gravity}")

  componentWillUnmount: ->
    @tip.hide()
    @tip.find('.ttp_body').html('')
    @tip = null

  render: ->
    <span {...@props} className="#{@props.className}" onMouseOver={@handleMouseOver} onMouseOut={@handleMouseOut} ref="el">{@props.children}</span>
