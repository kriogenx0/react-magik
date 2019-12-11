import ReactDOM from 'react-dom';

import './Modal.scss';

export default class Modal extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isOpen: props.isOpen
    };

    this.handleClose = this.handleClose.bind(this);
  }

  componentWillMount() {
    this.loadProps(this.props);
    if (this.props.outterOverlay) this.buildOverlay();
  }

  componentWillReceiveProps(props) {
    this.loadProps(props);
  }

  loadProps(props) {
    if (props.isOpen !== null) {
      props.isOpen ? this.show() : this.hide();
    }
  }

  componentWillUnount() {
    this.removeOverlay();
  }

  buildOverlay() {
    this.overlay = document.createElement('div');
    this.overlay.className = 'modal-overlay';
    document.body.appendChild(this.overlay);

    if (this.props.closeOnOverlayClick) {
      $(this.overlay).click(()=>{
        this.hide();
      });
    }
  }

  removeOverlay() {
    if (!this.overlay) return;
    ReactDOM.unmountComponentAtNode(this.overlay);
    document.body.removeChild(this.overlay);
    delete this.overlay;
  }

  show() {
    if (this.state.isOpen) return;
    this.setState({ isOpen: true });
    if (this.overlay)
      this.overlay.className = 'modal-overlay';
  }

  hide() {
    if (this.state.isOpen === false) return;
    this.setState({ isOpen: false });
    if (this.overlay)
      this.overlay.className = 'modal-overlay hidden';
    // this.removeOverlay();
  }

  handleClose() {
    if (this.props.onClose) {
      this.props.onClose();
    }
    this.hide();
  }

  render() {
    const modalClass = `c-modal ${this.state.isOpen ? ' modal-open' : ''} ${this.props.className}`;

    return (
      <div className={modalClass} tabIndex="-1" role="dialog">
        <div className='modal-inner-overlay' onClick={this.handleClose}></div>
        <div className="modal-box" role="document">
          <div className="modal-content">
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}

Modal.defaultProps = {
  outterOverlay: false,
  // Start open or closed
  isOpen: null,
  // Clone when clicking overlay
  closeOnOverlayClick: true,
  // Callback for closing dialog
  onClose: null,
  className: null
};
