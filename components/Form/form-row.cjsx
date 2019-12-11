# Re-usable form row element to be used in the builder.
module.exports = React.createClass

  displayName: 'FormRow'

  propTypes:
    label: PropTypes.string
    optionalText: PropTypes.string
    helperText: PropTypes.string
    isFlush: PropTypes.bool
    errors: PropTypes.array
    showError: PropTypes.bool
    isValid: PropTypes.bool
    className: PropTypes.string

  getDefaultProps: ->
    label: null
    optionalText: null
    helperText: null
    errors: []
    showError: false
    isValid: true
    className: ''

  render: ->
    <div className="frm_row #{if @props.showError then 'is-error' else ''} #{@props.className}">
      <div className="frm_row_description">
        <p className="frm_label #{if @props.isFlush then 'frm_label-flush' else ''}">{@props.label}</p>
        {if @props.optionalText
          <p className="frm_details deemphasized">{@props.optionalText}</p>
        }
      </div>
      <div className="frm_row_body">
        {@props.children}
        {if @props.showError
          for error, index in @props.errors
            <p className="frm_error" key={index}><i/>{error}</p>
        }
        {if @props.helperText
          <p className="l-v-top-half-spaced">{@props.helperText}</p>
        }
      </div>

    </div>
