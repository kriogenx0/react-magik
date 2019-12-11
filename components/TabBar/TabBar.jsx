import { Link } from 'react-router';

import './TabBar.scss';

export default class TabBar extends React.Component {

  constructor(props) {
    super(...arguments);

    this.state = {
      selectedTabIndex: props.selectedTabIndex || 0
    };

    this.handleTabSelect = this.handleTabSelect.bind(this);
  }

  handleTabSelect(selectedTabIndex, label) {
    this.setState({ selectedTabIndex });
    if (this.props.onChange) this.props.onChange(selectedTabIndex, label);
  }

  render() {
    return (
      <div className='c-tab_bar'>
        { _.map(this.props.tabs, (tab, i) => {
          const tabProps = {
            key: i,
            active: this.state.selectedTabIndex === i
          };
          if (tab instanceof React.Component) {
            tabProps.label = tabComponent.props.label;
          }
          else if (typeof tab == 'string') {
            tabProps.label = tab;
          }

          return (
            <TabBar.Link {...tabProps} onClick={this.handleTabSelect.bind(this, i, tabProps.label)} />
          );
        })}
      </div>
    );
  }
}

TabBar.propTypes = {
  tabs: PropTypes.array,
  onChange: PropTypes.func,
  selectedTabIndex: PropTypes.number
};

TabBar.Link = class TabLink extends React.Component {
  render() {
    return (
      <Link className={`c-tab_bar-link${this.props.active ? ' tab-active' : ''}`} key={this.props.label} activeClassName='tab-active' onClick={this.props.onClick}>{this.props.label}</Link>
    );
  }
}
