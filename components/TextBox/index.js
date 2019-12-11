import './TextBox.scss';

export default class TextBox extends React.Component {

  componentWillMount() {
    this.loadProps(this.props);
  }

  componentWillReceiveProps(props) {
    this.loadProps(props);
  }

  loadProps(props) {
    this.setState({
      value: props.value || ''
    });
  }

  handleChange(e) {
    if (e && e.target && this.props.onChange) {
      this.props.onChange(e);
    }
  }

  render() {
    let props = Object.assign({}, this.props, {
      onChange: this.handleChange.bind(this),
      value: this.state.value
    });
    delete props.multiline;
    console.log('props', props);

    const { multiline } = this.props;

    return (
      <div className="c-text_box">
        {multiline ?
          <textarea {...props}></textarea>
          :
          <input type="text" {...props} />
        }
      </div>
    );
  }
}

TextBox.defaultProps = {
  multiline: false
};
