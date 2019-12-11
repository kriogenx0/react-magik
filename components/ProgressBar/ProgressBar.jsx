import './ProgressBar.scss';

export default class ProgressBar extends React.Component {
  render() {
    return (
      <div className='c-progress_bar'>
        <div className='percent' style={{width: this.props.percent + '%'}} />
      </div>
    );
  }
}

ProgressBar.defaultProps = {
  percent: 0
};
