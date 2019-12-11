import _ from 'lodash';
import examples from './examples';

import './StyleGuide.scss';

export default class StyleGuide extends React.Component {
  render() {
    return (
      <div className='v-style_guide'>
        <aside>
          <h1>Volta</h1>
          <h3>A Style Guide for the Rich and Famous</h3>

          <nav>
            {_.map(examples, (example, i) => (
              <a href="javascript: void(0)">{example.name}</a>
            ))}
          </nav>
        </aside>

        <main>
          {_.map(examples, (example, i) => (
            <section key={example.name}>
              <h2>{example.name}</h2>
              {React.createElement(example.example, { key: i })}
            </section>
          ))}
        </main>

      </div>
    );
  }

}
