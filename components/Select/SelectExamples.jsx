import Select from './index';

export default class SelectExamples extends React.Component {

  render() {
    const options = _.map(SelectExamples.sampleOptions, value => ({ label: value, value }));

    return (
      <div>
        <article>
          <h3>Select</h3>
          <Select options={options} />
        </article>

        <article>
          <h3>Selected values</h3>
          <Select options={options} />
        </article>
      </div>
    );
  }

}

SelectExamples.sampleOptions = [
  'Apple',
  'Banana',
  'Strawberry',
  'Orange',
  'Grape'
];
