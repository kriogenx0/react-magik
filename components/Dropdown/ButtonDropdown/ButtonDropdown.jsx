import ClassNames from 'classnames';

import Button from 'controls/Button/Button';
import DropdownMenu from './DropdownMenu';

export default class ButtonDropdown extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false
    }

    this.$document = $(document);
    this.handleClose = this.handleClose.bind(this);
  }

  componentDidMount() {
    this.$document.on('click', this.handleClose);
  }

  componentWillUnmount() {
    this.$document.unbind('click', this.handleClose);
  }

  handleClick() {
    var isOpen = !this.state.isOpen;
    this.setState({ isOpen: isOpen });

    if (!isOpen && this.refs.buttonCaret) {
      this.refs.buttonCaret.refs.buttonElement.blur();
    }
  }

  handleClose(e, forceClose) {
    var $target = $(e.target);
    var isClickingOutside = !($target.hasClass('btn-group') || $target.parents('.btn-group').length);

    if (isClickingOutside || forceClose) {
      this.setState({ isOpen: false });
    }
  }

  render() {
    var cls = ClassNames({
      'btn-group': true,
      'open' : this.state.isOpen
    });

    var buttons = [];

    if (this.props.isSplit) {
      buttons.push((<Button className="btn"
                            label={this.props.label}
                            key="label" />));
      buttons.push((<Button className="btn dropdown-toggle"
                            hasCaret={true}
                            onClick={this.handleClick.bind(this)}
                            ref="buttonCaret"
                            key="caret" />));
    } else {
      buttons.push((<Button className="btn btn-default dropdown-toggle"
                            hasCaret={true}
                            label={this.props.label}
                            onClick={this.handleClick.bind(this)} key="label" />));
    }

    return (
        <div className={cls}>
          {buttons}
          <DropdownMenu items={this.props.items} onClose={this.handleClose.bind(this)} />
        </div>
    );
  }
}


ButtonDropdown.propTypes = {
  label: PropTypes.string,
  isSplit: PropTypes.bool,
  items: PropTypes.array
};

ButtonDropdown.defaultProps = {
  isSplit: false,
  label: 'Select an item'
};
