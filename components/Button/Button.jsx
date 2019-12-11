export default class Button extends React.Component {
  render() {
    const label = this.props.label || this.props.children;

    let className = 'btn';
    if (this.props.className)
      className += ' ' + this.props.className;

    return (
      <button className={className}
              onClick={this.props.onClick}
              ref="buttonElement">{label} {caret}</button>
    );
  }
}

Button.propTypes = {
  className: React.PropTypes.string,
  label: React.PropTypes.string
};
