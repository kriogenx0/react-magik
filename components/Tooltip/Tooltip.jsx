import './Tooltip.scss';

export default class ToolTip extends React.Component {

  // propTypes:
  //   title: React.PropTypes.string.isRequired
  //   gravity: React.PropTypes.oneOf(['n', 'w', 'e', 's'])
  //   className: React.PropTypes.string
  //
  //
  // getInitialState: ->
  //   title: this.props.title

  // tip: null
  // el: null

  componentDidMount() {
    this.tip = $('.ttp');
    this.el = $(this.refs.el.getDOMNode());
    this.el.removeAttr('title'); // remove title so it doesnt show the native tooltip
  }

  componentWillReceiveProps(newProps) {
    this.loadProps(newProps);
  }

  loadProps(props) {
    if (props.title) this.setState({ title: props.title });
  }

  positionTip(callback) {
    let tipWidth = this.tip.innerWidth();
    let tipHeight = this.tip.innerHeight();
    let elWidth = this.el.innerWidth();
    let elHeight = this.el.innerHeight();
    let elLeft = this.el.offset().left;
    let elTop = this.el.offset().top;

    if (this.props.gravity == 'up') {
      left = elLeft + (elWidth / 2) - (tipWidth / 2);
      top = elTop - tipHeight - this.props.margin;
    } else if (this.props.gravity == 'down') {
      left = elLeft + (elWidth / 2) - (tipWidth / 2);
      top = elTop + elHeight + this.props.margin;
    } else if (this.props.gravity == 'left') {
      left = elLeft - tipWidth - this.props.margin;
      top = elTop + (elHeight / 2) - (tipHeight / 2);
    } else if (this.props.gravity == 'right') {
      left = elLeft + elWidth + this.props.margin;
      top = elTop + (elHeight / 2) - (tipHeight / 2);
    }

    this.tip.css({
      left: left,
      top: top
    });

    this.tip.addClass(`ttp-${this.props.gravity}`);
  }

  handleMouseOver() {
    if (this.state.title && this.state.title != '')
      this.tip.find('.ttp_body').append(this.state.title);
      this.positionTip();
      this.tip.show();
  }

  handleMouseOut() {
    this.tip.hide();
    this.tip.find('.ttp_body').html('');
    this.tip.removeClass("ttp-#{this.props.gravity}");
  }

  componentWillUnmount() {
    this.tip.hide();
    this.tip.find('.ttp_body').html('');
    this.tip = null;
  }

  render() {
    return (
      <span
        {...this.props}
        className="#{this.props.className}"
        onMouseOver={this.handleMouseOver}
        onMouseOut={this.handleMouseOut}
        ref="el">{this.props.children}</span>
    );
  }
}

Tooltip.defaultProps = {
  title: null,
  gravity: 'n',
  className: null,
  margin: 5
};

Tooltip.propTypes = {
  title: React.PropTypes.string.isRequired,
  gravity: React.PropTypes.oneOf(['up', 'down', 'left', 'right']),
  className: React.PropTypes.string
};
