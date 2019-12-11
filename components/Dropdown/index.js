import PropTypes from 'prop-types';

import Overlay from '../Overlay';

import './Dropdown.scss';

export default class Dropdown extends React.Component {

  constructor(props) {
    super(...arguments);

    this.state = {
      isOpen: props.isOpen
    };

    this.hide = this.hide.bind(this);
  }

  componentWillReceiveProps(props) {
    this.handleToggle(props.isOpen);
  }

  handleToggle(state) {
    const isOpen = typeof state !== 'undefined' ? state : !this.state.isOpen;
    this.setState({ isOpen });
  }

  hide() {
    this.setState({ isOpen: false });
  }

  render() {
    const className = 'c-dropdown' + (this.props.className ? ` ${this.props.className}` : '') + (this.state.isOpen ? ' is-open' : '');

    return (
      <div className={className}>
        <a href="javascript: void(0)"
           className='toggle form-input'
           onClick={this.handleToggle.bind(this)}>{this.props.label}</a>
        <div className="dropdown-contents">
          {this.props.children}
        </div>
        <Overlay showing={this.state.isOpen} onClick={this.hide} />
      </div>
    );
  }

}

Dropdown.propTypes = {
  // TODO
  allowTyping: PropTypes.bool
};

Dropdown.defaultProps = {
  attachToTop: false,
  isOpen: false,
  label: 'Select an item'
};
