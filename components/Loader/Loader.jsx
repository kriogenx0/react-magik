import './Loader.scss';

export default class Loader extends React.Component {
  static defaultProps = {
    size: null,
    block: false,
    fullScreen: false
  };

  static propTypes = {
    block: PropTypes.bool
  }

  render() {
    return (
      <div className={`c-loader ${this.props.blocking ? 'loader-full' : 'loader-block'}`}>
        <div className='loader-container'>
          <div className='loader-message-ctn'>
            <i className='fa fa-spinner fa-spin fa-4x' />
            {(() => {
              if (this.props.children) {
                return (
                  <span className='loader-message'>{this.props.children}</span>
                );
              }
            })()}
          </div>
        </div>
      </div>
    );
  }
}
