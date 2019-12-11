export default class DropdownMenuItem extends React.Component {
  handleClick(e) {
    if (this.props.onClose) {
      this.props.onClose(e, true);
    }

    if (this.props.action) {
      this.props.action(this);
    }
  }

  render() {
    var item = this.props.isDivider ? (<li className="divider"></li>) :
        (<li onClick={ this.handleClick.bind(this) }><a href="javascript: void(0)">{this.props.label}</a></li>);

    return item;
  }
}

DropdownMenuItem.propTypes = {
  action: PropTypes.func,
  isDivider: PropTypes.bool,
  label: PropTypes.string,
  onClose: PropTypes.func
};
