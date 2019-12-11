// npm install draft-js
import {Editor, EditorState} from 'draft-js';

export default class RichText extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty()
    };
    this.onChange = this.onChange.bind(this);
  }

  onChange(editorState) {
    this.setState({editorState});
  }

  render() {
    const {editorState} = this.state;
    return <Editor editorState={editorState} onChange={this.onChange} />;
  }
}
