import { Howl } from 'howler';

import LoaderBars from '../LoaderBars/LoaderBars';

import './AudioTrack.scss';

export default class AudioTrack extends React.Component {

  constructor(p, c) {
    super(p, c);

    this.state = {
      elapsed: null,
      elapsed_percent: 0,
      volume: true
    };

    this.step = this.step.bind(this);
    this.handleDragStart = this.handleDragStart.bind(this);
    this.handleDrag = this.handleDrag.bind(this);
    this.handleDragEnd = this.handleDragEnd.bind(this);
    this.handleTogglePlay = this.handleTogglePlay.bind(this);
  }

  componentWillMount() {
    this.loadPlayer();
    this.loadTrack(this.props.src);
  }

  componentWillUnmount() {
    this.handleDragEnd();
    cancelAnimationFrame(this.animation);
    this.player.stop();
    delete this.player;
  }

  loadTrack(trackSource) {
    const component = this;
    this.setState({ loading: true });
    this.player = new Howl({
      src: [trackSource],
      autoplay: this.props.autoplay,
      loop: this.props.loop,
      volume: this.props.volume === false ? 1 : this.props.volume,
      onend: () => {
        component.handleStop();
      },
      onplay: () => {
        component.animation = requestAnimationFrame(component.step);
      },
      onload: () => {
        // console.log('loaded!', component.formatTime(component.player.duration()));
        component.setState({
          loading: false,
          duration: component.formatTime(component.player.duration()),
          elapsed: component.formatTime(0)
        });
      },
      onloaderror: () => {
        component.setState({
          loading: false,
          error: 'Could not load audio file'
        });
      }
      // onpause
      // onstop
    });
  }

  // RUNS MULTIPLE TIMES PER SECOND
  step() {
    if (!this.state.playing || !this.player) return;
    const seek = this.player.seek() || 0;
    const elapsed = this.formatTime(seek);

    if (elapsed != this.state.elapsed) {
      this.setState({
        elapsed_percent: ((100 * seek / this.player.duration()) || 0) + '%',
        elapsed
      });
    }
    requestAnimationFrame(this.step);
  }

  loadPlayer() {
    if (this.player) return;
  }

  formatTime(secs) {
    var minutes = Math.floor(secs / 60) || 0;
    var seconds = (Math.round(secs) - minutes * 60) || 0;
    return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
  }

  handlePlay() {
    this.player.play();
    this.setState({ playing: true })
    console.log('player', this.player.state());
  }

  handlePause() {
    cancelAnimationFrame(this.animation);
    this.player.pause();
    this.setState({ playing: false });
  }

  handleStop() {
    cancelAnimationFrame(this.animation);
    this.player.stop();
    this.setState({ playing: false });
  }

  handleDragStart(e) {
    this.rail.addEventListener('mousemove', this.handleDrag);
    window.addEventListener('mouseup', this.handleDragEnd);
  }

  handleDrag(e) {
    const w = _.get(this, 'rail.offsetWidth') || 1;
    const position = e.clientX - _.get(this, 'rail.offsetLeft');
    const percent = position / w;
    if (this.player.playing()) {
      this.player.seek(percent * this.player.duration());
    }
    this.setState({ elapsed_percent: 100 * percent + '%' });
  }

  handleDragEnd() {
    window.removeEventListener('mouseup', this.handleDragEnd); // RUN ONCE
    if (this.rail) this.rail.removeEventListener('mousemove', this.handleDrag);
  }

  handleTogglePlay() {
    if (this.state.playing)
      this.handlePause();
    else
      this.handlePlay();
  }

  handleToggleVoume() {
    this.player.toggleVolume();
    this.setState({ volume: !this.state.volume });
  }

  render() {
    return (
      <div className='c-audio_track no_select'>
        {(()=>{
          if (this.state.error) {
            return (
              <div className='error'>
                <i className='fa fa-times' />
                {this.state.error}
              </div>
            );
          } else if (this.state.loading) {
            return <LoaderBars />;
          } else {
            let railStyle = {};
            if (this.props.waveform) railStyle.backgroundImage = `url('${this.props.waveform}')`;
            return (
              <div className='audio_track-controls'>
                <div className='play control' onClick={this.handleTogglePlay}>
                  <i className={`fa fa-${this.state.playing ? 'pause' : 'play'}`} />
                </div>
                <div className='time'>
                  {this.state.elapsed}
                </div>
                <div className='rail' onClick={this.handleDrag} onMouseDown={this.handleDragStart} ref={(r) => { this.rail = r; }} style={railStyle}>
                  <div className='rail-elapsed_percent' style={{width: this.state.elapsed_percent}} />
                </div>
                <div className='duration'>
                  {this.state.duration}
                </div>
                {(()=>{
                  if (this.props.volume !== false) {
                    return (
                      <div className='volume control' onClick={this.handleToggleVoume}>
                        <i className={`fa fa-volume-${this.state.volume ? 'up' : 'off'}`} />
                      </div>
                    );
                  }
                })()}
              </div>
            );
          }
        })()}
      </div>
    );
  }

}

AudioTrack.propTypes = {
  src: PropTypes.string.isRequired,
  autoplay: PropTypes.bool,
  loop: PropTypes.bool,
  volume: PropTypes.oneOfType([PropTypes.bool, PropTypes.number])
};

AudioTrack.defaultProps = {
  autoplay: false,
  loop: false,
  volume: false
};
