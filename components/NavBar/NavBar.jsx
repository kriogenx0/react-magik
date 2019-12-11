import NavBarItem from "./NavBarItem.jsx";

import './NavBar.scss';

export default class NavBar extends React.Component {
  componentWillMount() {
    this.loadProps(this.props);
  }

  componentWillReceiveProps(props) {
    this.loadProps(props);
  }

  loadProps(props) {
    this.setState({
      navItems: props.navItems
    });
  }

  handleToggle(navItem) {
    navItem.setExpanded(!navItem.isExpanded());

    // force to render
    this.setState({});
  }

  buildNavItemElements(navItems, navLevel) {
    var navItemElements = [];
    navLevel = navLevel || 0;

    _.each(navItems, (navItem) => {
      var navBarItem = (<NavBarItem navLevel={navLevel}
                                    navItem={navItem}
                                    key={navItem.key}
                                    onToggle={this.handleToggle.bind(this)}
                                    onActiveState={this.props.onActiveState} />);

      navItemElements.push(navBarItem);

      // Build children
      if (navItem.isExpanded() && navItem.hasChildren()) {
        navItemElements = navItemElements.concat(this.buildNavItemElements(navItem.children, ++navLevel))
        navLevel--;
      }
    });

    return navItemElements;
  }

  render() {
    var navItemElements = this.buildNavItemElements(this.state.navItems);

    return (
      <div className="component-navbar no-select">
        {navItemElements}
      </div>
    );
  }
};

NavBar.propTypes = {
  navItems: PropTypes.array,
  onActiveState: PropTypes.func
};

NavBar.defaultProps = {
  navItems: []
};
