# FileUploadInput
# Basic file upload input component

Formsy = require 'formsy-react'
FormRow = require "components/lib/forms/form-row"

FilePickerMixin = require 'mixins/file-picker-mixin'

module.exports = React.createClass
  displayName: 'FileUploadField'

  mixins: [Formsy.Mixin, FilePickerMixin]
  propTypes:
    label: PropTypes.string
    optionalText: PropTypes.string

  getDefaultProps: ->
    label: null
    optionalText: null

  handleFile: (file) ->
    @setValue file

  changeValue: (event) ->
    event.preventDefault()
    @selectFile @handleFile,
      accept: @props.accept
      multiple: false

  render: ->
    <FormRow label={@props.label} optionalText={@props.optionalText} errors={@getErrorMessages()} showError={@showError()}>
      <a onClick={@changeValue} href="#" className="btn">Upload New File</a>
    </FormRow>
