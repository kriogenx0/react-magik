// import 'ckeditor';

export default class CKEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fieldName: this.props.fieldName,
      fieldValue: this.props.fieldValue,
      showWYSIWYG: false
    };
    this.beginEdit = this.beginEdit.bind(this);
    this.initEditor = this.initEditor.bind(this);
  }

  beginEdit() {
    this.setState({showWYSIWYG:true});
  }

  initEditor(field) {
    var self = this;

    function toggle() {
      CKEDITOR.replace("editor", { toolbar: "Basic", width: 870, height: 150 });
      CKEDITOR.instances.editor.on('blur', function() {
        let data = CKEDITOR.instances.editor.getData();
        self.setState({
          fieldValue: escape(data),
          showWYSIWYG: false
        });
        self.value = data;
        CKEDITOR.instances.editor.destroy();
      });
    }
    window.setTimeout(toggle, 100);
  }


  render() {
    if ( this.state.showWYSIWYG  ) {
      var field = this.state.fieldName;
      this.initEditor(field);
      return (
        <textarea name='editor' cols="100" rows="6" defaultValue={unescape(this.state.fieldValue)}></textarea>
      );
    } else {
      return (
        <p className='description_field' onClick={this.beginEdit}>{unescape(this.state.fieldValue)}</p>
      );
    }
  }
}
