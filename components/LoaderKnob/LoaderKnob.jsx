import './LoaderKnob.scss';

export default class LoaderKnob extends React.Component {
  render() {
    return (
      <div className='c-loader_knob'>
        <div className={'knob-knob ' + this.props.className}>
        </div>
        {_.times(12, (i) => {
          return (<div key={i} className="knob-indicator" />);
        })}
      </div>
    );
  }
}
