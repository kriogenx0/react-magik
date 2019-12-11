// # Scale Slider Component
// # UI for changing the scale of an image to crop. Mimics input[type=range]

export default class ScaleSlider extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      moving: false
    };
  }

  componentDidUpdate(props, state) {
    var moveStarted, moveStopped;
    moveStarted = this.state.moving && !state.moving;
    moveStopped = !this.state.moving && state.moving;
    if (moveStarted) {
      document.addEventListener('mousemove', this.handleMouseMove);
      return document.addEventListener('mouseup', this.handleMouseUp);
    } else if (moveStopped) {
      document.removeEventListener('mousemove', this.handleMouseMove);
      return document.removeEventListener('mouseup', this.handleMouseUp);
    }
  }

  handleMouseDown(event) {
    if (event.button !== 0) {
      return;
    }
    this.setState({
      moving: true
    });
    this.handleMove(event);
    event.stopPropagation();
    return event.preventDefault();
  }

  handleMouseMove(event) {
    if (!this.state.moving) {
      return;
    }
    this.handleMove(event);
    event.stopPropagation();
    return event.preventDefault();
  }

  handleMove(event) {
    var percent, slideNode, slideOffset, slideWidth;
    slideNode = this.refs.slide.getDOMNode();
    slideOffset = $(slideNode).offset().left;
    slideWidth = slideNode.offsetWidth;
    percent = (event.pageX - slideOffset) / slideWidth;
    percent = Math.min(percent, 1);
    percent = Math.max(percent, 0);
    return this.props.onChange(percent * this.props.max);
  }

  handleMouseUp(event) {
    this.setState({
      moving: false
    });
    event.stopPropagation();
    return event.preventDefault();
  }

  render() {
    const markerStyle = { left: this.props.value / this.props.max * 100 + "%" };

    return (
      <div className="icr_slide_wrap">
        <div className="icr_slide" ref="slide" onMouseDown={this.handleMouseDown}>
          <div className="icr_tick is-left"></div>
          <div className="icr_tick is-mid"></div>
          <div className="icr_tick is-right"></div>
          <div className="icr_slide_marker" style={markerStyle}></div>
        </div>
      </div>
    );
  }
}


ScaleSlider.propTypes = {
  value: React.PropTypes.number,
  max: React.PropTypes.number,
  min: React.PropTypes.number,
  onChange: React.PropTypes.func
};

ScaleSlider.defaultProps = {
  value: 1,
  max: 2,
  min: 0,
  onChange: function() {}
};
