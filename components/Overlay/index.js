import ReactDOM from 'react-dom';

import './Overlay.scss';

export default class Overlay extends React.Component {

  componentWillMount() {
    this.buildOverlay();
  }

  componentWillUnmount() {
    this.removeOverlay();
  }

  buildOverlay() {
    if (this.overlay) return;

    this.className = 'c-overlay';

    this.overlay = document.createElement('div');
    this.overlay.className = this.className;
    document.body.appendChild(this.overlay);

    this.overlay.addEventListener('click', () => {
      this.props.onClick();
    });
  }

  removeOverlay() {
    if (this.overlay) {
      ReactDOM.unmountComponentAtNode(this.overlay);
      document.body.removeChild(this.overlay);
    }
  }

  render() {
    if (this.props.showing !== null) this.showing = this.props.showing;
    if (this.overlay) {
      this.overlay.className = this.showing ? `${this.className} showing` : this.className;
    }

    return null;
  }

}

Overlay.defaultProps = {
  showing: null,
  onClick: () => {}
};
