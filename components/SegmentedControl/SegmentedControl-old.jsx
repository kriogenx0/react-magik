export default class SegmentedControl extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      selectedIndex: props.selectedIndex
    };
  }

  componentWillReceiveProps(props) {
    if (props.selectedIndex)
      this.setState({ selectedIndex: props.selectedIndex });
  }

  handleClick(selectedIndex, e) {
    e.preventDefault();
    this.setState({ selectedIndex });
    this.props.onIndexChange(selectedIndex);
  }

  render() {
    return (
      <div className="c-tabs">
        <ul className="#{this.props.className}">
          {_.each(this.props.tabs, (tab, i) => {
            const selected = i is this.state.selectedIndex;
            return (
              <Tab name={tab.name} content={tab.content} alert={tab.alert} selected={selected} onClick={this.handleClick.bind(this.,i)} key={i}/>
            );
          }}
        </ul>
        <div>
          {for tab, i in this.props.tabs
            <div key={i} className="#{if i != this.state.selectedIndex then 'l-hidden' else ''}">{tab.content}</div>
          }
        </div>
      </div>
    );
  }

}

SegmentedControl.propTypes {
  tabs: PropTypes.array,
  initialIndex: PropTypes.number,
  onIndexChange: PropTypes.func,
  className: PropTypes.string
};

SegmentedControl.defaultProps = {
  tabs: [],
  selectedIndex: 0,
  onIndexChange: ->,
  className: ''
};
