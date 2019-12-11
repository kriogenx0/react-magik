export default class Message extends React.Component {
  render() {
    return (
      <div className={`c-message ${Message.typeDetails[this.props.type].className}`}>
        <i className={`fa fa-${Message.typeDetails[this.props.type].icon}`} aria-hidden="true"></i>
        {this.props.message || this.props.children}
      </div>
    );
  }
}

Message.typeDetails = {
  success: {
    className: 'ui-message-success',
    icon: 'check-circle'
  },
  error: {
    className: 'ui-message-error',
    icon: 'times-circle'
  }
};
