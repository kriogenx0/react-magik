//
// # This is ported by Pete from https://github.com/Khan/react-components/blob/master/js/layered-component-mixin.jsx
//
// # From http://jsfiddle.net/LBAr8/
//
// # Create a new "layer" on the page, like a modal or overlay.
// #
// # var LayeredComponent = React.createClass({
//  #   mixins: [LayeredComponentMixin],
//  #   render: function() {
//  #     // render like usual
//  #   },
//  #   renderLayer: function() {
//  #     // render a separate layer (the modal or overlay)
//  #   }
//  # });
//  #

export default class Layer extends React.Component {

  // contextTypes() {
  //   router: PropTypes.func
  // }
  //
  // childContextTypes:
  //   router: PropTypes.func
  //
  // getChildContext: ->
  //   router: @context.router

  componentDidMount() {
    // # Appending to the body is easier than managing the z-index of
    // # everything on the page.  It's also better for accessibility and
    // # makes stacking a snap (since components will stack in mount order).
    this.layer = document.createElement('div');
    document.body.appendChild(this.layer);
    this.renderLayer();
  }

  componentDidUpdate() {
    this.renderLayer();
  }

  componentWillUnmount() {
    this.unrenderLayer()
    document.body.removeChild(this.layer);
  }

  renderLayer() {
    // # By calling this method in componentDidMount() and
    // # componentDidUpdate(), you're effectively creating a "wormhole" that
    // # funnels React's hierarchical updates through to a DOM node on an
    // # entirely different part of the page.

    const layer = this.props.children; // public renderLayer

    const clonedChildren = React.cloneElement(layer, {onClose: this.handleClose})
    // # Renders can return null, but React.render() doesn't like being asked
    // # to render null. If we get null back from renderLayer(), just render
    // # a noscript element, like React does when an element's render returns
    // # null.

    noScript = <noscript />

    if (!layerElement) {
      React.render(noScript, this.layer);
    } else {
      React.render(clonedChildren, this.layer);
    }

    // if (this.layerDidMount) this.layerDidMount(this.layer);
  }

  unrenderLayer() {
    React.unmountComponentAtNode(this.layer);
  }

  handleClose() {
    this.unrenderLayer();
  }

  render() {
    return null;
  }
}

Layer.defaultProps = {
  showing: false,
  handleClose: () => {}
};
