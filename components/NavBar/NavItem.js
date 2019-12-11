export default class NavItem {
  constructor(title, linkTo, key, extraClass, subHeading) {
    this.title = title || "untitled";
    this.subHeading = subHeading || this.title;
    this.linkTo = linkTo || "";
    this.key = key || this.title;
    this.extraClass = extraClass || "";
    this.query = {};

    this.children = [];
    this._isExpanded = true;
  }

  add(navItem) {
    this.children.push(navItem);
  }

  hasChildren() {
    return this.children.length !== 0;
  }

  hasLink() {
    return _.isPresent(this.linkTo);
  }

  isExpanded() {
    return this._isExpanded;
  }

  setExpanded(expanded) {
    this._isExpanded = expanded;
  }
}
