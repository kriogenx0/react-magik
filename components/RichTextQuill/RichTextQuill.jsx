import ReactQuill from 'react-quill';

import '../../../node_modules/react-quill/dist/quill.snow.css';
import './RichTextQuill.scss';

export default class RichTextQuill extends React.Component {
  render() {
    return (<ReactQuill {...this.props} modules={RichTextQuill.modules} />);
  }
};

RichTextQuill.modules = {
	toolbar: [
		[{ font: [] }, { size: [] }],
		[{ align: [] }, 'direction' ],
		[ 'bold', 'italic', 'underline', 'strike' ],
		[{ color: [] }, { background: [] }],
		[{ script: 'super' }, { script: 'sub' }],
		['blockquote', 'code-block' ],
		[{ list: 'ordered' }, { list: 'bullet'}, { indent: '-1' }, { indent: '+1' }],
		[ 'link', 'image', 'video' ],
		[ 'clean' ]
	],
};
