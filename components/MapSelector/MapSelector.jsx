import Button from '../Button/Button';
import Map from '../Map/Map';

import './MapSelector.scss';

export default class MapSelector extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      searchTextField: false,
      mapValue: '',
      value: props.value,
      searchBoxValue: props.value || '',
      searching: false
    };

    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleAddressKeyPress = this.handleAddressKeyPress.bind(this);
    this.search = this.search.bind(this);
    this.clearAddress = this.clearAddress.bind(this);
    this.handleMapLoading = this.handleMapLoading.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.removeValue = this.removeValue.bind(this);
    this.inputRef = this.inputRef.bind(this);
  }

  componentWillMount() {
    if (this.props.defaultValue !== null)
      this.searchFor(this.props.defaultValue);
    else if (this.props.value !== null)
      this.searchFor(this.props.value);
  }

  componentWillReceiveProps(props) {
    this.loadProps(props);
  }

  loadProps(props) {
    if (props.value !== null && this.props.value !== props.value)
      this.searchFor(props.value);
  }

  // componentWillUnmount() {
    // if (this.autocomplete) this.autocomplete.unbindAll();
  // }

  searchFor(searchValue) {
    if (searchValue === undefined) return;
    this.setState({
      searchBoxValue: searchValue,
      mapValue: searchValue
    });
  }

  search() {
    this.setState({
      mapValue: this.state.searchBoxValue
    });
  }

  clearAddress() {
    this.setState({ searchBoxValue: '' });
    if (this.searchBox) this.searchBox.focus();
  }

  removeValue() {
    this.setState({ value: null, mapValue: '' });
  }

  handleAddressKeyPress(event) {
    if (event.which == 13) { // Enter
      event.preventDefault();
      event.stopPropagation();
      this.search();
    }
  }

  handleSearchChange(e) {
    const searchBoxValue = e.target.value;
    this.setState({ searchBoxValue });
  }

  handleMapLoading(loading) {
    // console.log('LOADING', loading);
    this.setState({ loading, message: loading ? 'Loading...' : null });
  }

  handleChange(location) {
    // console.log('handleChange location', location);
    this.setState({ value: location });
    this.props.onChange(location, this.state.searchBoxValue);
  }

  inputRef(input) {
    this.searchBox = input;
    if (!this.state.searchTextField)
      this.setState({ searchTextField: input });
  }

  render() {
    // onClick={/this.state.searchBoxValue ? this.clearAddress : () => {}}
    return (
      <div className='c-map_selector'>
        <div className='clearfix'>
          <div className='l-r'>
            <Button onClick={this.search}>Search</Button>
          </div>
          <div className='map_selector-search_box'>
            <input
              type='text'
              ref={this.inputRef}
              className="l-width-full"
              onKeyPress={this.handleAddressKeyPress}
              onChange={this.handleSearchChange}
              value={this.state.searchBoxValue}
              placeholder={this.props.placeholder}
            />
          </div>
        </div>
        {(() => {
          const locationAddress = _.get(this.state.value, 'address');
          if (locationAddress) {
            return (
              <div className='map_selector-location_found clearfix l-space-quarter-v'>
                <span>{locationAddress}</span>
                <Button onClick={this.removeValue}>X</Button>
              </div>
            );
          }
        })()}
        {(() => {
          if (this.state.message) {
            return (
              <div className="l-space-v-half">
                <span>{this.state.message}</span>
              </div>
            );
          }
        })()}

        {(() => {
          if (this.state.searchTextField)
            return (
              <Map
                value={this.state.mapValue}
                onLoading={this.handleMapLoading}
                onChange={this.handleChange}
                addressInput={this.state.searchTextField}
              />
            );
        })()}
      </div>
    );
  }
}

MapSelector.propTypes = {
  // value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  onChange: PropTypes.func
};

MapSelector.defaultProps = {
  defaultValue: null,
  value: null,
  placeholder: 'Enter a street address...',
  onChange: ()=>{}
};
