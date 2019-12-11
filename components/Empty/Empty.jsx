import './Empty.scss';

export default class Empty extends React.Component {

  render() {
    let inside;
    if (!this.props.children) {
      inside = this.props.title ? this.props.title : 'Empty';
    }

    return (
      <div className="c-empty ${this.props.className}">
        <div className='empty-contents'>
          {(() => {
            return (
              this.props.children || (<div className='empty-title'>{inside}</div>)
            );
          })()}
        </div>
      </div>
    );
  }
}
