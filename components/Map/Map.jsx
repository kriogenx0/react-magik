export default class Map extends React.Component {

  constructor() {
    super(...arguments);

    this.googleMap = null;
    this.geocoder = null;
    this.marker = null;
    this.initialized = false;
    this.initializeGoogleMap = this.initializeGoogleMap.bind(this);

    // generateCallback
    this.initializeGoogleMapCallbackName = 'initializeGoogleMap' + (Math.random() + '').split('.')[1];
  }

  componentDidMount() {
    // Must wait til loaded to run googles callback
    // Must also wait for refs to be available
    if (window.google && google.maps) {
      this.initializeGoogleMap();
    } else {
      this.loadGoogleMapLibrary();
    }
  }

  componentWillReceiveProps(props) {
    // console.log('props.value', props.value);

    if (!props.value)
      this.removeValue();
    else if (props.value && this.props.value !== props.value)
      this.search(props.value);

    if (props.lat && this.props.lat !== props.lat && props.lng && this.props.lng !== props.lng && this.initialized)
      this.markerOnCoordinates(props.lat, props.lng);
  }

  /*
  shouldComponentUpdate(props, state) {
    return props.height && props.height !== !props.height;
  }
  */

  removeGoogleMaps() {
    document.body.removeChild(this.script);
    delete window[this.initializeGoogleMapCallbackName];
    // for now
    if (_.has(window, 'google.maps')) delete window.google.maps;
  }

  loadGoogleMapLibrary() {
    window[this.initializeGoogleMapCallbackName] = this.initializeGoogleMap;
    this.script = document.createElement('script');
    this.script.type = 'text/javascript';
    // script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=places&callback=initializeGoogleMap';

    const apiKey = 'AIzaSyBtXh92k6n0kuzaePg_wfqzqkVs4o3qUzE';

    this.script.src = 'https://maps.googleapis.com/maps/api/js?libraries=places&callback=' + this.initializeGoogleMapCallbackName + '&key=' + apiKey
    document.body.appendChild(this.script);
  }

  initializeGoogleMap() {
    this.geocoder = new google.maps.Geocoder();

    const initialPosition = {
      zoom: this.props.zoom,
      center: new google.maps.LatLng(this.props.lat, this.props.lng)
    };

    this.googleMap = new google.maps.Map(this.refs.map, initialPosition);
    this.googleMap.setMapTypeId(google.maps.MapTypeId.ROADMAP);
    this.marker = new google.maps.Marker({ map: this.googleMap });

    // if (this.props.lat && this.props.lng)
    //   this.markerOnCoordinates(this.props.lat, this.props.lng);

    this.initialized = true;

    if (this.props.autocomplete) this.configureAutoComplete();
    if (this.props.value) this.search(this.props.value);
  }

  configureAutoComplete() {
    const addressInput = this.refs.address || this.props.addressInput;

    if (!this.autocomplete)
      this.autocomplete = new google.maps.places.Autocomplete(addressInput, { types: ['geocode'] });

    google.maps.event.addListener(this.autocomplete, 'place_changed', () => {
      const address = addressInput.value;
      this.search(address);
    });
  }

  // MOVE & CENTER
  markerOnCoordinates(lat, lng) {
    const location = new google.maps.LatLng(lat, lng);
    this.markerOnLocation(location);
  }

  markerOnLocation(location) {
    if (this.googleMap) this.googleMap.setCenter(location);
    if (this.marker) {
      this.marker.setMap(this.googleMap);
      this.marker.setPosition(location);
    }
  }

  setLoading(isLoading) {
    if (this.props.onLoading) this.props.onLoading(isLoading);
  }

  search(address) {
    if (!this.geocoder) return;

    this.value = address;
    this.setLoading(true);

    this.geocoder.geocode({ address }, (results, status) => {
      if (!google || !google.maps) return;

      let message, messageStatus;
      // Location Found
      if (status == google.maps.GeocoderStatus.OK) {
        // console.log('results[0].geometry.location', results[0].geometry.location);
        this.markerOnLocation(results[0].geometry.location);

        this.props.onChange({
          results,
          address: results[0].formatted_address,
          lat: results[0].geometry.location.lat(),
          lng: results[0].geometry.location.lng()
        });

        message = null;
        messageStatus = null;
      } else {
        message = 'Location not found.';
        messageStatus = false;
      }

      this.setLoading(false);
    });
  }

  removeValue() {
    if (this.marker)
      this.marker.setMap(null);
  }

  render() {
    return (
      <div className='c-map'>
        {/* <input type='text' ref='address' /> */}
        <div ref="map" style={{height: this.props.height}} className="l-v-top-half-spaced l-bordered" />
      </div>
    );
  }
}

Map.propTypes = {
  value: PropTypes.string,
  markers: PropTypes.array,
  autocomplete: PropTypes.bool,
  // for autocomplete
  addressInput: PropTypes.oneOfType([PropTypes.element, PropTypes.object])
}

Map.defaultProps = {
  onChange: (location) => {},
  // Lebanon, Kansas (Geographic Center of US)
  // http://www.kansastravel.org/geographicalcenter.htm
  lat: 39.8097343,
  lng: -98.5556199,
  zoom: 4,
  height: 300,
  autocomplete: true
}
