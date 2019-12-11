// ModalDialog
// Interactive Modal with header and buttons

import Modal from '../Modal/Modal';

import './ModalDialog.scss';

export default class ModalDialog extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      isOpen: props.isOpen
    };

    this.handleCancel = this.handleCancel.bind(this);
    this.handleOkay = this.handleOkay.bind(this);
  }

  componentWillMount() {
    this.loadProps(this.props);
  }

  componentWillReceiveProps(props) {
    this.loadProps(props);
  }

  loadProps(props) {
    if (props.isOpen !== null) {
      this.setState({ isOpen: props.isOpen });
    }
  }

  close() {
    this.setState({
      isOpen: false
    });
  }

  handleOkay() {
    if (this.props.onOkay) {
      this.props.onOkay();
    }

    this.close();
  }

  handleCancel() {
    if (this.props.onCancel) {
      this.props.onCancel();
    }

    this.close();
  }

  render() {
    const dialogClass = 'c-modal_dialog ' + (this.props.hideHeader ? ' hide-header' : '') + (this.props.inlineMode ? ' inline-mode' : '') + (this.props.className ? " " + this.props.className : '');

    const okayButtonClass =  "btn btn-primary okay-button" + (this.props.okayEnabled ? '' : ' disabled');
    const okayButton = (
      <button type="button"
        className={okayButtonClass}
        onClick={this.handleOkay}
      >
        {this.props.okayButtonLabel}
      </button>
    );

    const modalProps = {
      isOpen: this.state.isOpen,
      className: dialogClass,
      closeOnOverlayClick: this.props.closeOnOverlayClick
    };

    return (
      <Modal {...modalProps}>
        {(()=>{
          if (this.props.hideHeader || !this.props.title) return null;
          return (
            <div className="modal_dialog-header">
              {(()=>{
                if (this.props.closeX) {
                  return (
                    <a className='modal-x' aria-label="Close" onClick={this.onCancel}>
                      <i class="fa fa-times" aria-hidden="true"></i>
                    </a>
                  );
                }
              })()}
              <h4 className="modal_dialog-title">{this.props.title}</h4>
            </div>
          );
        })()}
        <div className="modal_dialog-body">
          {this.props.children}
        </div>
        <div className="modal_dialog-footer">
          {(() => {
            if (!this.props.hideOkayButton) {
              return okayButton;
            }
          })()}
          <button type="button"
                  className="btn btn-default cancel-button"
                  data-dismiss="modal"
                  onClick={this.handleCancel}>{this.props.cancelButtonLabel}</button>
        </div>
      </Modal>
    );
  }
}

ModalDialog.defaultProps = {
  isOpen: null,
  closeX: false,
  closeOnOverlayClick: true,
  title: null,
  cancelButtonLabel: 'Cancel',
  okayButtonLabel: 'OK',
  okayEnabled: true,
  hideOkayButton: false,
  hideHeader: false,
  inlineMode: false
};

ModalDialog.propTypes = {
  onOkay: PropTypes.func,
  onCancel: PropTypes.func
};
