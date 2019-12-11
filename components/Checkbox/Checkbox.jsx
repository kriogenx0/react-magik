export default class Checkbox extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      checked: props.checked
    }
  }

  componentWillReceiveProps(props) {
    if (props.checked === !!props.checked)
      this.setState({ checked: props.checked });
  }

  handleChange(event) {
    const checked = event.target.checked;
    this.setState({ checked: checked });
    if (this.props.onChange) this.props.onChange(checked);
  }

  render() {
    let className = 'c-checkbox ' + this.props.className;
    if (this.props.flush) className += ' checkbox-flush';

    return (
      <label className={className}>
        <input type="checkbox" checked={this.state.checked} onChange={this.handleChange.bind(this)} />
        <span className="checkbox-indicator"></span>
      </label>
    );
  }
}

Checkbox.propTypes = {
  onChange: React.PropTypes.func,
  checked: React.PropTypes.bool
};

Checkbox.getDefaultProps = {
  checked: false
};
