export default class Label extends React.Component {

  render() {
    if (this.props.text && this.props.children) {
      return (
        <div className="c-label">
          <label>
            <div>{this.props.text}</div>
            <div>{this.props.children}</div>
          </label>
        </div>
      );
    } else {
      return (
        <div className="c-label">
          <label>
            {this.props.children}
          </label>
        </div>
      );
    }
  }
}

Label.propTypes = {
  text: PropTypes.string
};
