import './LoaderClock.scss';

export default class LoaderClock extends React.Component {
  render() {
    return (
      <div className='c-loader_clock'>
        <div className={'clock-clock ' + (this.props.className || '')}>
        </div>
      </div>
    );
  }
}
