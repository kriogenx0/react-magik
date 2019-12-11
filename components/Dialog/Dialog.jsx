// Dialog
// Interactive Modal with header and buttons

import PopOver from 'lib/PopOver/PopOver';

import './Dialog.scss';

export default class Dialog extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      saveEnabled: props.saveEnabled
    };
  }

  componentWillReceiveProps(props) {
    this.setState({
      isOpen: props.isOpen,
      saveEnabled: props.saveEnabled,
      hideSaveButton: props.hideSaveButton,
      inlineMode: props.inlineMode
    });
  }

  closeDialog() {
    this.setState({
      isOpen: false
    });
  }

  handleSave() {
    if (this.props.handleSave) {
      this.props.handleSave();
    }

    this.closeDialog();
  }

  handleClose() {
    if (this.props.handleClose) {
      this.props.handleClose();
    }

    this.closeDialog();
  }

  render() {
    var dialogClass = 'eegul ' + (this.props.hideHeader ? ' hide-header' : '') + (this.state.inlineMode ? ' inline-mode' : '');
    if (this.props.className) dialogClass += " " + this.props.className;
    var saveButtonClass =  "btn btn-primary save-button" + (this.state.saveEnabled ? '' : ' disabled');
    var saveButton = this.state.hideSaveButton ? null : (<button type="button"
      className={saveButtonClass}
      onClick={this.handleSave.bind(this)}>{this.props.titleSave}</button>);

    let basicModalProps = {
      isOpen: this.state.isOpen,
      className: dialogClass,
      closeOnOverlayClick: this.props.closeOnOverlayClick,
      handleClose: this.props.handleClose
    };

    return (
      <BasicModal {...basicModalProps}>
      {(()=>{
        if (this.props.hideHeader || !this.props.title) return null;
        return (
          <div className="dialog-header">
            <button type="button"
                    className="close"
                    data-dismiss="dialog"
                    aria-label="Close"
                    onClick={this.handleClose.bind(this)}>
            <span aria-hidden="true">&times;</span>
            </button>
            <h4 className="dialog-title">{this.props.title}</h4>
          </div>
        );
      })()}
      <div className="dialog-body">
        {this.props.children}
      </div>
      <div className="dialog-footer">
        {saveButton}
        <button type="button"
                className="btn btn-default cancel-button"
                data-dismiss="modal"
                onClick={this.handleClose.bind(this)}>{this.props.titleCancel}</button>
      </div>
      </BasicModal>
    );
  }
}

Dialog.defaultProps = {
  isOpen: false,
  closeOnOverlayClick: false,
  title: null,
  titleCancel: 'Cancel',
  titleSave: 'Save Changes',
  saveEnabled: true,
  hideSaveButton: false,
  hideHeader: false,
  inlineMode: false
};

Dialog.propTypes = {
  handleSave: React.PropTypes.func,
  handleClose: React.PropTypes.func
};
