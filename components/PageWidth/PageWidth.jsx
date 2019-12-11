import './PageWidth.scss';

export default class PageWidth extends React.Component {
  render() {
    let className = 'c-page_width';
    if (this.props.className) className += ' ' + this.props.className;

    return (
      <div className={className}>
        {this.props.children}
      </div>
    );
  }
}
