
Spinner = require 'components/lib/spinner'
require '../../../bower_components/leaflet-dist/leaflet'
require '../../../bower_components/leaflet-draw/dist/leaflet.draw-src'
require '../../../bower_components/Leaflet.label/dist/leaflet.label'

MapModel = require 'models/map-model'
MapRegionCollection = require 'collections/map-region-collection'

# By default the tooltip shows area in hectares.
# This shows "Release mouse to finish drawing" in the tooltip.
L.Draw.Rectangle = L.Draw.Rectangle.extend
  _getTooltipText: L.Draw.SimpleShape::_getTooltipText

module.exports = React.createClass
  displayName: 'UserMap'

  propTypes:
    onRegionCreate: PropTypes.func
    onRegionUpdate: PropTypes.func
    onRegionDelete: PropTypes.func
    onRegionClick: PropTypes.func
    onMapLoad: PropTypes.func
    map: PropTypes.instanceOf(MapModel).isRequired
    mapRegions: PropTypes.instanceOf(MapRegionCollection).isRequired
    isEditing: PropTypes.bool

  getDefaultProps: ->
    onRegionCreate: (attributes) ->
    onRegionUpdate: (attributes) ->
    onRegionDelete: (uuid) ->
    onRegionClick: (region) ->
    onMapLoad: (event) ->
    map: null
    mapRegions: null
    isEditing: false
    isAdding: false

  getInitialState: ->
    imageLoaded: false

  componentWillReceiveProps: (props) ->
    if props.isEditing isnt 'undefined' and props.isEditing isnt @props.isEditing
      if props.isEditing
        @drawControl._toolbars.edit._modes.edit.handler.enable()
      else
        @drawControl._toolbars.edit._modes.edit.handler.save()
        @drawControl._toolbars.edit._modes.edit.handler.disable()

    if props.isAdding isnt 'undefined' and props.isAdding isnt @props.isAdding
      if props.isAdding
        @drawControl._toolbars.draw._modes.rectangle.handler.enable()
      else
        @drawControl._toolbars.draw._modes.rectangle.handler.disable()

  componentDidMount: ->
    image = new Image()
    image.onload = =>
      @imageWidth = image.width
      @imageHeight = image.height
      @loadMap()
    image.src = @props.map.get 'image'

  componentWillUnmount: ->
    if @leafletMap
      @leafletMap.remove()

    @props.mapRegions.each (region) ->
      region.off 'change:location'

    @props.mapRegions.off 'add', @addRegion
    @props.mapRegions.off 'remove', @removeRegion

  imageWidth: null
  imageHeight: null

  leafletMap: null
  leafletRegions: null

  leafletRegionStyle:
    weight: 2
    color: '#439fd8'
    opacity: 1
    fillOpacity: .7
    fillColor: '#439fd8'

  drawControl: null

  loadMap: ->
    @setState imageLoaded: true

    # Initialize map
    @leafletMap = L.map @getDOMNode(),
      minZoom: 1
      maxZoom: 4
      crs: L.CRS.Simple

    @leafletMap.on 'load', @props.onMapLoad

    # zoom 3 is 100% image scaling
    @leafletMap.setView new L.LatLng(0, 0), 3

    # calculate the edges of the image, in coordinate space
    southWest = @leafletMap.unproject([0, @imageHeight], @leafletMap.getMaxZoom() - 1)
    northEast = @leafletMap.unproject([@imageWidth, 0], @leafletMap.getMaxZoom() - 1)
    bounds = new L.LatLngBounds(southWest, northEast)

    # add the image overlay,
    # so that it covers the entire map
    L.imageOverlay(@props.map.get('image'), bounds).addTo(@leafletMap)

    # tell leaflet that the map is exactly as big as the image
    @leafletMap.setMaxBounds(bounds)

    # keep track of regions on the map
    @leafletRegions = new L.FeatureGroup()

    # Initialise the draw control and pass it the FeatureGroup of editable layers
    @drawControl = new L.Control.Draw
      # we only want rectangles for now
      draw:
        polyline: false
        polygon: false
        circle: false
        marker: false
        rectangle:
          shapeOptions: @leafletRegionStyle
      edit:
        featureGroup: @leafletRegions
        edit:
          selectedPathOptions:
            # maintainColor: true
            weight: 2
            color: '#ffffff'
            opacity: 1
            fillOpacity: .7
            fillColor: '#439fd8'

    @leafletMap.addLayer(@leafletRegions)
    @leafletMap.addControl(@drawControl)

    @props.mapRegions.each @addRegion
    @props.mapRegions.on 'add', @addRegion
    @props.mapRegions.on 'remove', @removeRegion

    @leafletMap.on 'draw:created', (event) =>
      layer = event.layer
      layer.setStyle(@leafletRegionStyle)
      attributes = @getRegionAttributesFromLayer layer
      @props.onRegionCreate attributes

    @leafletMap.on 'draw:edited', (event) =>
      event.layers.eachLayer (layer) =>
        attributes = @getRegionAttributesFromLayer layer
        attributes.uuid = layer.uuid
        @props.onRegionUpdate attributes

    @leafletMap.on 'draw:deleted', (event) =>
      event.layers.eachLayer (layer) =>
        @props.onRegionDelete layer.uuid
        @leafletRegions.removeLayer layer

  getRegionAttributesFromLayer: (layer) ->
    northWest = @leafletMap.project(layer.getBounds().getNorthWest(), @leafletMap.getMaxZoom() - 1)
    southEast = @leafletMap.project(layer.getBounds().getSouthEast(), @leafletMap.getMaxZoom() - 1)
    attributes =
      relativeX: northWest.x
      relativeY: northWest.y
      relativeWidth: southEast.x - northWest.x
      relativeHeight: southEast.y - northWest.y

  bindLabel: (layer, region) ->
    if region.get('location')
      layer.bindLabel(region.get('location').get('name'))
    else
      layer.bindLabel("Click to attach this region to a location.")

  addRegion: (region) ->
    southWestOffset = [
      region.get('relativeX')
      region.get('relativeY') + region.get('relativeHeight')
    ]
    northEastOffset = [
      region.get('relativeX') + region.get('relativeWidth')
      region.get('relativeY')
    ]
    southWestCoords = @leafletMap.unproject(southWestOffset, @leafletMap.getMaxZoom() - 1)
    northEastCoords = @leafletMap.unproject(northEastOffset, @leafletMap.getMaxZoom() - 1)
    bounds = new L.LatLngBounds(southWestCoords, northEastCoords)

    layer = new L.rectangle(bounds, @leafletRegionStyle).addTo(@leafletRegions)

    # Show location name on hover
    @bindLabel layer, region

    # Update label on location change
    region.on 'change:location', @bindLabel.bind(@, layer, region)

    layer.on 'click', @props.onRegionClick.bind(null, region, layer, @leafletMap)

    layer.uuid = region.get 'uuid'

  removeRegion: (region) ->
    @leafletRegions.eachLayer (layer) =>
      if layer.uuid is region.get 'uuid'
        @leafletRegions.removeLayer layer

  render: ->
    <div className="#{if @props.className then @props.className else ''}">
      {<Spinner fullscreen="true" /> unless @state.imageLoaded}
    </div>
