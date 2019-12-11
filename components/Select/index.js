import Reatc from 'react';
import PropTypes from 'prop-types';

import Dropdown from '../Dropdown';
import Overlay from '../Overlay';
import TextBox from '../TextBox';

import './Select.scss';

export default class Select extends React.Component {

  constructor(props) {
    super(...arguments);

    this.state = {
      isOpen: props.isOpen,
      text: ''
    };

    this.textInput = React.createRef();

    this.hide = this.hide.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
  }

  componentWillReceiveProps(props) {
    this.handleToggle(props.isOpen);
  }

  handleToggle(state) {
    const isOpen = typeof state !== 'undefined' ? state : !this.state.isOpen;
    if (isOpen) {
      this.textInput.current.focus();
    }
    this.setState({ isOpen });
  }

  hide() {
    this.setState({ isOpen: false });
  }

  handleOptionSelect(option) {
    console.log('option', option);
  }

  handleTextChange(e) {
    this.setState({ text: e.target.value });
    this.props.onTextChange();
  }

  render() {
    const { isOpen, text } = this.state;
    const { options, allowTyping, className } = this.props;

    const containerClass = 'c-select' + (className ? ' ' + className : '') + (isOpen ? ' is-open' : '');

    return (
      <div className={containerClass}>
        <a href="javascript: void(0)"
           className='select-label toggle form-input'
           onClick={this.handleToggle}>{this.props.label}</a>
        <div className="dropdown-contents">
          { allowTyping ?
            <div>
              <TextBox autoFocus value={text} onChange={this.handleTextChange} ref={this.textInput} />
            </div>
            : null
          }
          {_.map(options, option => (
            <div key={option.value} className='select-option' onClick={this.handleOptionSelect.bind(this, option)}>
              {option.label}
            </div>
          ))}
        </div>
        <Overlay showing={isOpen} onClick={this.hide} />
      </div>
    );
  }

}

Select.propTypes = {
  // TODO
  allowTyping: PropTypes.bool,
  onTextChange: PropTypes.func,
  onSelect: PropTypes.func,
  options: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.any
  })).isRequired
};

Select.defaultProps = {
  allowTyping: true,
  attachToTop: false,
  isOpen: false,
  label: 'Select an item'
};
