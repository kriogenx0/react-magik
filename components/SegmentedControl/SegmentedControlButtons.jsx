import './SegmentedControlButtons.scss';

export default class SegmentedControlButtons extends React.Component {

  constructor(props) {
    super(props);

    this.renderButtonsFromObjects = this.renderButtonsFromObjects.bind(this);
    this.renderButtonsFromStrings = this.renderButtonsFromStrings.bind(this);
  }

  handleButtonClick(button) {
    // TODO MAKE SELECTED
    this.props.buttonAction(button);
  }

  renderButtonsFromObjects(button, i) {
    return (
      <div className='btn' key={i} onClick={this.handleButtonClick.bind(this, button)}>
        {button.label}
      </div>
    );
  }

  renderButtonsFromStrings(button, i) {
    return (
      <div className='btn' key={i} onClick={this.handleButtonClick.bind(this, button)}>
        {button}
      </div>
    );
  }

  render() {
    const buttonsAreObjects = typeof(_.get(this.props.buttons, '0')) != 'string';

    return (
      <div className='c-segmented_control_buttons clearfix'>
        {_.map(this.props.buttons, buttonsAreObjects ? this.renderButtonsFromObjects : this.renderButtonsFromStrings)}
      </div>
    );
  }

}

SegmentedControlButtons.propTypes = {
  buttons: PropTypes.array,
  buttonAction: PropTypes.func
};

SegmentedControlButtons.defaultProps = {
  buttons: [],
  selectedIndex: 0,
  buttonAction: () => {}
};
