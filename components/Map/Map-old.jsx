import Button from '../Button/Button';

export default class Map extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      address: props.address,
      textSearch: props.address,
      searching: false
    };

    this.googleMap = null;
    this.geocoder = null;
    this.marker = null;
    this.initialized = false;

    this.initializeGoogleMap = this.initializeGoogleMap.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleAddressKeyPress = this.handleAddressKeyPress.bind(this);
    this.searchCurrentText = this.searchCurrentText.bind(this);
    this.clearAddress = this.clearAddress.bind(this);
  }

  componentWillMount() {
    this.loadGoogleMapLibrary();
  }

  componentWillReceiveProps(props) {
    if (props.lat && props.lng && this.initialized)
      this.markerOnCoordinates(props.lat, props.lng);

    this.setState({ textSearch: props.address || this.state.textSearch });
  }

  componentWillUnmount() {
    // if (this.autocomplete) this.autocomplete.unbindAll();
  }

  loadGoogleMapLibrary() {
    if (window.google) {
      this.initializeGoogleMap();
    } else {
      window.initializeGoogleMap = this.initializeGoogleMap;

      const script = document.createElement('script');
      script.type = 'text/javascript';
      // script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=places&callback=initializeGoogleMap';

      script.src = ' https://maps.googleapis.com/maps/api/js?key=AIzaSyBtXh92k6n0kuzaePg_wfqzqkVs4o3qUzE&callback=initializeGoogleMap'
      document.body.appendChild(script);
    }
  }

  initializeGoogleMap() {
    this.geocoder = new google.maps.Geocoder();

    const gobj = {
      zoom: 10,
      center: new google.maps.LatLng(this.props.lat, this.props.lng)
    };

    this.googleMap = new google.maps.Map(this.refs.map, gobj);
    this.marker = new google.maps.Marker({ map: this.googleMap });

    // if (this.props.lat && this.props.lng)
    //   this.markerOnCoordinates(this.props.lat, this.props.lng);

    // if (!this.autocomplete)
      // this.autocomplete = new google.maps.places.Autocomplete(this.refs.address, { types: ['geocode'] });

    // google.maps.event.addListener(this.autocomplete, 'place_changed', () => {
    //   this.setState(
    //     {
    //       address: this.refs.address.getDOMNode().value,
    //       textSearch: this.refs.address.getDOMNode().value
    //     },
    //     () => {
    //       this.geocode(this.state.address);
    //     }
    //   );
    // });
    this.initialized = true;
  }

  // MOVE & CENTER
  markerOnCoordinates(lat, lng) {
    location = new google.maps.LatLng(lat, lng);
    this.markerOnLocation(location);
  }

  markerOnLocation(location) {
    if (this.googleMap) this.googleMap.setCenter(location);
    if (this.marker) this.marker.setPosition(location);
  }

  search(address) {
    if (!this.geocoder) return;

    console.log('finding', address);

    this.setState({
      message: 'Finding address...',
      searching: true
    });

    this.geocoder.geocode({ address: address }, (results, status) => {
      console.log('results', results);

      let message, messageStatus;
      // Location Found
      if (status == google.maps.GeocoderStatus.OK) {
        console.log('results[0].geometry.location', results[0].geometry.location);
        this.markerOnLocation(results[0].geometry.location);

        this.props.onLocationChange({
          address: results[0].formatted_address,
          lat: results[0].geometry.location.lat(),
          lng: results[0].geometry.location.lng()
        });

        message = null;
        messageStatus = null;
      } else {
        message = 'Address not found.';
        messageStatus = false;
      }

      this.setState({
        lastResult: results[0],
        searching: false,
        message: message,
        status: messageStatus
      });
    });
  }

  searchCurrentText() {
    this.search(this.state.textSearch);
  }

  clearAddress() {
    this.setState({ textSearch: '' });
    this.refs.address.focus();
  }

  handleAddressKeyPress(event) {
    if (event.which == 13) { // Enter
      event.preventDefault();
      event.stopPropagation();
      this.searchCurrentText();
    }
  }

  handleSearchChange(e) {
    const textSearch = e.target.value;
    this.setState({ textSearch });
  }

  render() {
    // onClick={/this.state.textSearch ? this.clearAddress : () => {}}
    return (
      <div className='c-map'>
        <div className='clearfix'>
          <input
            type='text'
            ref="address"
            className="txt l-full-width"
            onKeyPress={this.handleAddressKeyPress}
            onChange={this.handleSearchChange}
            value={this.state.textSearch}
            placeholder={this.props.placeholder}
          />
          {/* TODO right align  <div className='l-r'> */ }
          <div style={{display: 'inline-block'}}>
            {!this.state.textSearch ?
              (<Button onClick={this.searchCurrentText}>Search</Button>)
            :
              (<Button onClick={this.clearAddress}>Change</Button>)
            }
          </div>
        </div>
        {(() => {
          if (this.state.message) {
            return (
              <div className="l-space-v-half">
                <span>{this.state.message}</span>
              </div>
            );
          }
        })()}

        <div ref="map" style={{height: this.props.height}} className="l-v-top-half-spaced l-bordered" />
      </div>
    );
  }
}


Map.defaultProps = {
  onLocationChange: (location) => {},
  lat: 37.7749295,
  lng: -122.41941550000001,
  address: '',
  height: 300,
  placeholder: 'Enter a street address...'
}
