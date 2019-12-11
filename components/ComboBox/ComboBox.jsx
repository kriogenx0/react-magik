import TextBox from '../TextBox/TextBox';
// import DropdownList from '../DropdownList/DropdownList';
import DropdownListItem from '../DropdownList/DropdownListItem';
// import Overlay from '../Overlay/Overlay';

import './ComboBox.scss';

export default class ComboBox extends React.Component {

  constructor(props) {
    super(...arguments);
    this.state = {
      value: null,
      open: props.open || false
    };

    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleTextPress = this.handleTextPress.bind(this);
    this.delayedHide = this.delayedHide.bind(this);
  }

  show() {
    this.setState({ open: true });
  }

  hide() {
    this.setState({ open: false });
  }

  delayedHide() {
    setTimeout(() => {
      this.hide();
    }, 50);
  }

  handleTextChange(e) {
    const value = e.target.value;
    this.setState({ value });
    this.props.onChange(value);
  }

  handleTextPress(e) {
    // ENTER
    if (e.which == 13) {
      this.handleAnySelect(e.target.value);
    }
    // ESC
    else if (e.which == 27) {
      this.hide();
    }
    else if (!this.state.open) {
      this.show();
    }
  }

  handleAnySelect(value) {
    this.setState({ value });
    this.props.onSelect(value);
    this.hide();
  }

  render() {
    /*<DropdownList onSelect={this.onSelect} items={this.props.items} open={this.state.open} /> */

    const textBoxProps = {
      value: this.state.value !== null ? this.state.value : this.props.defaultValue,
      onChange: this.handleTextChange,
      onKeyPress: this.handleTextPress,
      onClick: this.show,
      onFocus: this.show,
      onBlur: this.delayedHide
    };

    return (
      <div className={'c-combo_box' + (this.state.open ? ' is_open' : '')}>
        <TextBox {...textBoxProps} />
        <div className='contents'>
          {_.map(this.props.items, (item, key) => {
            return (
              <DropdownListItem key={key} label={item} onSelect={ this.handleAnySelect.bind(this, item) } />
            );
          })}
        </div>
      </div>
    );
  }
}

ComboBox.defaultProps = {
  defaultValue: '',
  items: [],
  onSelect: () => {},
  onChange: () => {}
};

ComboBox.propTypes = {
  items: PropTypes.array,
  // WHEN SELECTING A VALUE
  onSelect: PropTypes.func,
  // WHEN ENTERING A VALUE
  onChange: PropTypes.func
};
