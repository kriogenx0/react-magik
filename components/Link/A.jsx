// Anchor

export default class A extends React.Component {

  buildHref() {
    let href = this.props.to;

    if (this.props.params) {
      for (let param in this.props.params) {
        href = href.replace(new RegExp(":${param}\\b", 'ig'), this.props.params[param]);
      }
    }
    return href;
  }

  render() {
    return (
      <a href={this.buildHref()} {...this.props}>
        {this.props.children}
      </a>
    );
  }
}
