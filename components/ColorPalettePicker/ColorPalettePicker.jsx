import './ColorPalettePicker.scss';

export default class ColorPalettePicker extends React.Component {

  constructor(props) {
    super(...arguments);
    this.state = {
      showing: false
    };

    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.dontBlur = this.dontBlur.bind(this);
    this.toggle = this.toggle.bind(this);
  }

  componentWillMount() {
    this.loadProps(this.props);
  }

  componentWillReceiveProps(props) {
    this.loadProps(props);
  }

  loadProps(props) {
    if (props.value !== null) {
      this.setState({ value: props.value });
    }
  }

  selectColor(color) {
    this.setState({ value: color, showing: false });
    this.props.onChange(color);
  }

  handleTextChange(e) {
    this.setState({ value: e.target.value });
  }

  handleFocus() {
    this.setState({ showing: true });
  }

  handleBlur() {
    this.blurring = setTimeout(() => {
      this.setState({ showing: false });
    }, 200);
  }

  dontBlur() {
    setTimeout(() => {
      clearTimeout(this.blurring);
    }, 10);
  }

  toggle() {
    // TODO focus on input if showing
    this.setState({ showing: !this.state.showing });
  }

  render() {
    return (
      <div className='c-color_palette_picker'>
        <ui.TextBox value={this.state.value} onFocus={this.handleFocus} onBlur={this.handleBlur} onChange={this.handleTextChange} />
        <div className='color-current' style={{backgroundColor: this.state.value}} onClick={this.toggle} />
        <div className={`colors clearfix${this.state.showing ? ' showing' : ''}`} onMouseDown={this.dontBlur}>
          {_.map(ColorPalettePicker.colors, (color) => {
            return (
              <div key={color} style={{backgroundColor: color}} title={color} onClick={this.selectColor.bind(this, color)} />
            );
          })}
        </div>
      </div>
    );
  }
}

ColorPalettePicker.defaultProps = {
  value: null,
  onChange: () => {}
};

ColorPalettePicker.colors = [
  '#ff0000',
  '#F06060',
  '#ffa500',
  '#F0B460',
  '#ffff00',
  '#60F06E',
  '#008000',
  '#50E3C2',
  '#60D8F0',
  '#60AAF0',
  '#0011dd',
  '#4A90E2',
  '#9060F0',
  '#800080',
  '#fc5bca',
  '#ffffff',
  '#CCCCCC',
  '#9B9B9B',
  '#444444',
  '#000000'
];
