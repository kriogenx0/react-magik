// Render a spinner image (ie: loading)

import './LoaderSpinner.scss';

export default class LoaderSpinner extends React.Component {

  render() {

    const size = this.props.size ? 'spn-' + this.props.size : '';

    return (
      <div className={`c-load_spinner l-inline-block ${this.props.fullscreen ? 'spn-full-screen' : ''} ${size} ${this.props.className}`}>
        <div className="spn_spinner">
          {_.times(12, (i) => {
            return (<div className="spn_spinner_arm" key={i} />);
          })}
        </div>
      </div>
    );
  }
}

LoaderSpinner.defaultProps = {
  className: ''
};
