import { Link }  from 'react-router';

import './TabsRouted.scss';

export default class TabsRouted extends React.Component {
  render() {
    return (
      <ul className='c-tabs_routed'>
        {_.map(this.props.tabs, (tab, i) => {
          return (
            <li key={i}>
              <Link to={tab.path} activeClassName='is-active'>{tab.name}</Link>
            </li>
          );
        })}
      </ul>
    );
  }
}

TabsRouted.propTypes = {
  // path, name
  tabs: PropTypes.array
};
