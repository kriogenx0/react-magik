import ReactDOM from 'react-dom';
import $ from 'jquery';

import './PopOver.scss';

export default class PopOver extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
    this.handleClose = this.handleClose.bind(this);
  }

  componentWillMount() {
    this.loadProps(this.props);
  }

  componentWillReceiveProps(props) {
    this.loadProps(props);
  }

  loadProps(props) {
    this.setState({
      open: props.open
    });

    if (props.open !== this.props.open) {
      if (props.open) {
        this.buildOverlay();
      } else {
        this.removeOverlay();
      }
    }
  }

  buildOverlay() {
    this.overlay = document.createElement('div');
    this.overlay.className = 'overlay';
    document.body.appendChild(this.overlay);

    if (this.props.closeOnOverlayClick) {
      $(this.overlay).click(() => {
        this.closeModal();
      });
    }
  }

  removeOverlay() {
    if (!this.overlay) return;
    ReactDOM.unmountComponentAtNode(this.overlay);
    document.body.removeChild(this.overlay);
    delete this.overlay;
  }

  closeModal() {
    this.setState({
      open: false
    });
    this.removeOverlay();
  }

  handleClose() {
    if (this.props.handleClose) {
      this.props.handleClose();
    }
    this.closeModal();
  }

  handleOverlayClick() {
    if (this.props.closeOnOverlayClick)
      this.handleClose();
  }

  render() {
    let modalClass = `c-pop_over${this.props.fullSize ? ' pop_over-full' : ''}${this.state.open ? ' pop_over-open in' : ''} ${this.props.className}`;

    return (
      <div className={modalClass} tabIndex="-1" role="dialog" aria-labelledby="myModalLabel">
        {(() => {
          if (!this.props.fullSize) {
            return (
              <div className="inner-overlay" onClick={this.handleOverlayClick}></div>
            );
          }
        })()}
        <div className="dialog content" role="document">
          {this.props.children}
        </div>
      </div>
    );
  }
}

PopOver.defaultProps = {
  // Start open or closed
  open: false,
  // Full screen?
  fullSize: true,
  // Clone when clicking overlay
  closeOnOverlayClick: true,
  // Callback for closing dialog
  handleClose: null,
  className: null
};

PopOver.propTypes = {
  open: React.PropTypes.bool,
  closeOnOverlayClick: React.PropTypes.bool,
  handleClose: React.PropTypes.func,
  className: React.PropTypes.string,
  children: React.PropTypes.array
};
