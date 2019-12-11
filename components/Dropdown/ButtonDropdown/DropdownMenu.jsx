import DropdownMenuItem from './DropdownMenuItem.jsx';

export default class DropdownMenu extends React.Component {
  render() {
    var self = this;
    var items = _.map(this.props.items, function(item, key) {
      return (
          <DropdownMenuItem key={key} {...item} onClose={ self.props.onClose } />
      );
    });

    return (
        <ul className="dropdown-menu">
          { items }
        </ul>
    );
  }
}

DropdownMenu.propTypes = {
  items: PropTypes.array,
  onClose: PropTypes.func
};
