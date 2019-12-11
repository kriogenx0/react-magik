import { Link }  from 'react-router';
import ClassNames from 'classnames';

export default class NavBarItem extends React.Component {
  handleToggle(event) {
    this.props.onToggle(this.props.navItem, event);
  }

  handleLink(event) {
    // to prevent Link from processing click
    event.preventDefault();

    // Navigate to linkTo
    this.context.router.push({pathname: this.props.navItem.linkTo, query: this.props.navItem.query});
  }

  render() {
    var el = "";
    var navItem = this.props.navItem;
    var isActive = navItem.hasLink() && this.context.router.isActive({pathname: navItem.linkTo});

    if (this.props.onActiveState && isActive) {
      this.props.onActiveState(navItem);
    }

    var cls = ClassNames({
      'component-navbar-item': true,
      'has-link': navItem.hasLink(),
      'has-children': navItem.hasChildren(),
      'is-active': isActive
    });

    if (this.props.navLevel) {
      cls += " navlevel-indent-" + this.props.navLevel;
    } else {
      cls += " navlevel-indent-0";
    }

    // Add extraClass if provided
    if (_.isPresent(navItem.extraClass)) {
      cls += " " + navItem.extraClass;
    }

    if (navItem.isExpanded()) {
      cls += ' is-expanded';
    }

    if (navItem.hasLink()) {
      // Build Link
      el = (
        <div className={cls} onClick={this.handleLink.bind(this)}>
          <Link to={{pathname: navItem.linkTo, query: navItem.query}} onClick={this.handleLink.bind(this)} className="navTitle">{navItem.title}</Link>
        </div>);
    } else {
      if (navItem.hasChildren()) {
        // Build Toggle
        el = (
          <div className={cls + " toggle-expand"} onClick={this.handleToggle.bind(this)}>
            <span>{navItem.isExpanded() ? String.fromCharCode(0x25be) : String.fromCharCode(0x25b8)}</span>
            <span className="navTitle">{navItem.title}</span>
          </div>);
      } else {
        // Build Label
        el = (
          <div className={cls + " navTitle"}>
            {navItem.title}
          </div>);
      }
    }

    return (el);
  }
};

NavBarItem.defaultProps = {
  onToggle: () => {}
};

NavBarItem.propTypes = {
  onToggle: PropTypes.func,
  onActiveState: PropTypes.func,
};

NavBarItem.contextTypes = {
  router: PropTypes.object.isRequired
};
