import { Link } from 'react-router';

import './Tabs.scss';

export default class Tabs extends React.Component {
  constructor() {
    super(...arguments);

    this.state = {
      tabIndex: 0
    };
    // this.selectTab = this.selectTab.bind(this);
  }

  selectTab(tabIndex) {
    // console.log('tabIndex', tabIndex);
    this.setState({ tabIndex });
    if (this.props.onTabSelect) this.props.onTabSelect(tabIndex);
  }

  render() {
    // console.log('this.props.children', this.props.children);
    const tabIndex = this.state.tabIndex || 0;
    const selectedTab = this.props.children[tabIndex];

    return (
      <div className='c-tabs'>
        <div className='tabs-bar'>
          { _.map(this.props.children, (tabComponent, i) => {
            return (
              <Tabs.Link key={i} label={tabComponent.props.label} active={tabIndex === i} onClick={this.selectTab.bind(this, i)} />
            );
          })}
        </div>
        <div className='tabs-content'>
          { selectedTab }
        </div>
      </div>
    );
  }
}

Tabs.propTypes = {
  tabs: PropTypes.array,
  onTabSelect: PropTypes.func
};

Tabs.Item = class TabItem extends React.Component {
  render() {
    return (
      <div className='tabs-tab_item'>
        {this.props.children}
      </div>
    );
  }
}
