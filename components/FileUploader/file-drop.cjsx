# Simple component for dropping files
# Adds three states to the component
# @state.fileOverComponent (bool) - true if user is dragging a file on top of the component
# @state.fileOverComponent (bool) - true if user is dragging a file on top of the viewport
# @state.files (array) - array of files dropped onto component by user
# Uses one prop from component
# @props.accept (string) - comma separated list of accepted mime-types ex: image/*

module.exports = React.createClass
  displayName: 'FileDrop'

  propTypes:
    accept: PropTypes.string
    className: PropTypes.string
    style: PropTypes.object
    onDrop: PropTypes.func
    onDrop: PropTypes.func
    onFileOverComponent: PropTypes.func
    onFileOverWindow: PropTypes.func

  getDefaultProps: ->
    accept: null
    className: null
    style: null
    onDrop: (files) ->
    onFileOverComponent: (bool) ->
    onFileOverWindow: (bool) ->

  componentDidMount: ->
    document.addEventListener 'dragenter', @handleDragEnterWindow
    document.addEventListener 'dragover', @handleDragOverWindow
    document.addEventListener 'dragleave', @handleDragLeaveWindow
    document.addEventListener 'drop', @handleDropWindow

    @getDOMNode().addEventListener 'dragenter', @handleDragEnter
    @getDOMNode().addEventListener 'dragover', @handleDragOver
    @getDOMNode().addEventListener 'dragleave', @handleDragLeave
    @getDOMNode().addEventListener 'drop', @handleDrop

  componentWillUnmount: ->
    document.removeEventListener 'dragenter', @handleDragEnterWindow
    document.removeEventListener 'dragover', @handleDragOverWindow
    document.removeEventListener 'dragleave', @handleDragLeaveWindow
    document.removeEventListener 'drop', @handleDropWindow

    @getDOMNode().removeEventListener 'dragenter', @handleDragEnter
    @getDOMNode().removeEventListener 'dragover', @handleDragOver
    @getDOMNode().removeEventListener 'dragleave', @handleDragLeave
    @getDOMNode().removeEventListener 'drop', @handleDrop

  windowDragEnterCount: 0

  handleDragEnterWindow: (event) ->
    event.preventDefault()
    @windowDragEnterCount++
    @props.onFileOverWindow true

  handleDragOverWindow: (event) ->
    event.preventDefault()

  handleDragLeaveWindow: (event) ->
    event.preventDefault()
    @windowDragEnterCount--
    if @windowDragEnterCount == 0
      @props.onFileOverWindow false

  handleDropWindow: (event) ->
    event.preventDefault()
    @windowDragEnterCount = 0
    @props.onFileOverWindow false

  componentDragEnterCount: 0

  handleDragEnter: (event) ->
    event.preventDefault()
    @componentDragEnterCount++
    @props.onFileOverComponent true

  handleDragOver: (event) ->
    event.preventDefault()
    event.dataTransfer.dropEffect = "copy"

  handleDragLeave: (event) ->
    event.preventDefault()
    @componentDragEnterCount--
    if @componentDragEnterCount == 0
      @props.onFileOverComponent false

  handleDrop: (event) ->
    event.preventDefault()
    @props.onFileOverComponent false
    @componentDragEnterCount = 0
    files = @pruneFiles event.dataTransfer.files
    if files.length
      @props.onDrop files

  pruneFiles: (fileList) ->

    files = []

    if !@props.accept
      for file in fileList
        files.push file
      return files

    # Patterns should match the following patterns
    # image/png
    # image/*
    # image/*,video/*

    patterns = @props.accept.split ','

    for file in fileList

      match = false
      for pattern in patterns

        pattern = pattern.trim()

        # image/png
        if pattern == file.type
          files.push file
          continue

        typeSplit = file.type.split '/'
        patternSplit = pattern.split '/'

        # image/*
        if patternSplit[1] == "*" and patternSplit[0] == typeSplit[0]
          files.push file
          continue

    return files

  render: ->
    <div className={@props.className} style={@props.style}>{@props.children}</div>
