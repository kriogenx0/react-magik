import './Loader.scss';

export default class Loader extends React.Component {

  render() {

    var content, self = Loader;
    if (self.styles[this.props.loaderStyle]) {
      content = self.styles[this.props.loaderStyle];
    } else {
      content = self.styles['spinner'];
    }

    return (
      <div className="component-loader">
        {content}
      </div>
    );
  }

}

Loader.defaultProps = {
  loaderStyle: 'spinner'
};
Loader.styles = {
  bouncing: (<div className="bouncing">
    <div className="bounce1"></div>
    <div className="bounce2"></div>
  </div>),
  spinner: (<div className="spinner">
    <div className="circle1"></div>
    <div className="circle2"></div>
    <div className="circle3"></div>
    <div className="circle4"></div>
    <div className="circle5"></div>
    <div className="circle6"></div>
    <div className="circle7"></div>
    <div className="circle8"></div>
    <div className="circle9"></div>
    <div className="circle10"></div>
    <div className="circle11"></div>
    <div className="circle12"></div>
  </div>)
};
