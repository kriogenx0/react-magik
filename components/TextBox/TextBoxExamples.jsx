import TextBox from './index';

export default class TextBoxExamples extends React.Component {

  render() {
    const options = _.map(TextBoxExamples.sampleOptions, value => ({ label: value, value }));

    return (
      <div>
        <article>
          <h3>TextBox</h3>
          <TextBox options={options} />
        </article>
      </div>
    );
  }

}
