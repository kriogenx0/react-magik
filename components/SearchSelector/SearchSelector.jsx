import TextBox from 'lib/TextBox/TextBox';
import PopOver from 'lib/PopOver/PopOver';

import './SearchSelector.scss';

export default class SearchSelector extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    this.loadProps(this.props);
  }

  componentWillReceiveProps(props) {
    this.loadProps(props);
  }

  loadProps(props) {
    this.setState({ open: props.open });
    if (props.open) {
      // FOCUS ON TEXTBOX
    }
  }

  handleOnType(e) {
    if (!e.target) return;
    let resultItems;
    let val = e.target.value;
    if (this.props.onType)
      resultItems = this.props.onType(val);

    // console.log('resultItems', resultItems);

    this.setState({ query: val, resultItems: resultItems });
  }

  handleResultItemClick(val) {
    let tags = this.state.tags;
    if (tags instanceof Array) {
      if (tags.indexOf(val) == -1)
        tags.push(val);
    } else {
      tags = [val];
    }

    this.setState({ tags: tags });
    // console.log('tags', tags);
  }

  renderResultItems(items) {
    if (this.state.inside) {
      return this.state.inside;
    } else if (this.state.resultItems) {
      return _.map(this.state.resultItems, (item, index) => {
        return (
          <div className='result_item no_select' key={index} onClick={(() => { return this.handleResultItemClick(item); })}>{item}</div>
        );
      });
    }
  }

  render() {
    return (
      <div className='c-search_selector'>
        <PopOver open={this.state.open}>
          <div className='search_selector-query'>
            <TextBox value={this.state.query} onChange={this.handleOnType.bind(this)} />
          </div>
          <div className='search_selector-tags'>
            {_.map(this.state.tags, (tag, index) => {
              return (
                <div className='tag' key={index}>{tag}</div>
              );
            })}
          </div>
          <div className='search_selector-content'>
            {this.renderResultItems()}
          </div>
        </PopOver>
      </div>
    );
  }
}

SearchSelector.defaultProps = {
  open: false,
  multipleItems: true,
  uniqueItems: true
}
