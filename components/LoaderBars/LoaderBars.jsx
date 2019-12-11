import './LoaderBars.scss';

export default class LoaderBars extends React.Component {
  render() {
    return (
      <div {...this.props} className='c-load_bars'>
        <div className='spinner'>
          <div className='rect1'></div>
          <div className='rect2'></div>
          <div className='rect3'></div>
          <div className='rect4'></div>
          <div className='rect5'></div>
        </div>
      </div>
    );
  }
}
