import './CheckboxField.scss';

export default class CheckboxField extends React.Component {

  componentWillMount() {
    this.loadProps(this.props);
  }

  componentWillReceiveProps(props) {
    this.loadProps(props);
  }

  loadProps(props) {
    this.setState({
      checked: props.checked
    });
  }

  handleChange() {
    var value = !this.state.checked;
    this.setState({ 'checked': value });
    if (this.props.onChange)
      this.props.onChange(value);
  }

  render() {
    return (
      <label className="component-checkboxfield">
        <input type="checkbox" {...this.props} onChange={this.handleChange.bind(this)} checked={(this.state.checked ? 'checked' : false)} />
        <span>{this.props.label}</span>
      </label>
    );
  }

}

CheckboxField.defaultProps = {
  checked: false,
  onChange: null
};
