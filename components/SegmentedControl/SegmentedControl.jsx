import TabBar from '../TabBar/TabBar';

import './SegmentedControl.scss';

export default class SegmentedControl extends React.Component {
  render() {
    return (
      <div className="c-segmented_control no_select">
        <TabBar {...this.props} />
      </div>
    );
  }
}
