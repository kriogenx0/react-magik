export default class PageHeading extends React.Component {
  render() {
    return (
      <div className='c-page_heading clearfix l-space-v'>
        <div className='l-l'>
          <h1 className='l-space-none'>{this.props.text}</h1>
        </div>
        <div className='l-r'>
          {this.props.children}
        </div>
      </div>
    );
  }
}
