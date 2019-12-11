// REQUIRES PACKAGE
// "react-tinymce": "^0.5.1"

import TinyMCE from 'react-tinymce';

export default class RichTextTinyMCE extends React.Component {

  constructor(props) {
    super(props);

    this.handleEditorChange = this.handleEditorChange.bind(this);
  }

  handleEditorChange(e) {
    this.props.onChange(e.target.getContent());
  }

  render() {
    return (
      <TinyMCE
        content={this.props.value}
        config={{
          plugins: 'link image code',
          toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | code'
        }}
        onChange={this.handleEditorChange}
      />
    );
  }
}

RichTextTinyMCE.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func
}
