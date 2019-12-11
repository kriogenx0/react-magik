export default class ContentEditable extends React.Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.html !== this.getDOMNode().innerHTML;
  }

  handleChange() {
    const value = this.getDOMNode().innerHTML;
    if (this.props.onChange && value !== this.lastHtml) {

      this.props.onChange({
        target: {
          value
        }
      });
    }
    this.lastHtml = value;
  }

  render() {
    return <div
      onInput={this.handleChange}
      onBlur={this.handleChange}
      contentEditable
      dangerouslySetInnerHTML={{__html: this.props.html}} />;
  }
}
