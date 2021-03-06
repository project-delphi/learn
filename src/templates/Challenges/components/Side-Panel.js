import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ReactDom from 'react-dom';
import { createSelector } from 'reselect';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

// import HelpModal from './Help-Modal.jsx';
import ToolPanel from './Tool-Panel';
import ChallengeTitle from './Challenge-Title';
import ChallengeDescription from './Challenge-Description';
import TestSuite from './Test-Suite';
import Output from './Output';
import Spacer from '../../../components/util/Spacer';

import {
  consoleOutputSelector,
  challengeTestsSelector,
  executeChallenge,
  initConsole,
  openModal
} from '../redux';

const mapStateToProps = createSelector(
  consoleOutputSelector,
  challengeTestsSelector,
  (output, tests) => ({ output, tests })
);

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      executeChallenge,
      initConsole,
      openHelpModal: () => openModal('help'),
      openResetModal: () => openModal('reset')
    },
    dispatch
  );

const propTypes = {
  description: PropTypes.arrayOf(PropTypes.string),
  executeChallenge: PropTypes.func.isRequired,
  guideUrl: PropTypes.string,
  initConsole: PropTypes.func.isRequired,
  openHelpModal: PropTypes.func.isRequired,
  openResetModal: PropTypes.func.isRequired,
  output: PropTypes.string,
  tests: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string,
      testString: PropTypes.string
    })
  ),
  title: PropTypes.string
};

export class SidePanel extends PureComponent {
  constructor(props) {
    super(props);
    this.bindTopDiv = this.bindTopDiv.bind(this);
  }

  componentDidMount() {
    this.props.initConsole('');
  }

  componentDidUpdate(prevProps) {
    const { title, initConsole } = this.props;
    if (title !== prevProps.title) {
      initConsole('');
      const node = ReactDom.findDOMNode(this.descriptionTop);
      setTimeout(() => {
        node.scrollIntoView({ behavior: 'smooth' });
      }, 0);
    }
  }

  bindTopDiv(node) {
    this.descriptionTop = node;
  }

  render() {
    const {
      title,
      description,
      tests = [],
      output = '',
      guideUrl,
      executeChallenge,
      openResetModal,
      openHelpModal
    } = this.props;
    return (
      <div className={'instructions-panel'} ref='panel' role='complementary'>
        <div ref={this.bindTopDiv} />
        <div>
          <ChallengeTitle>{title}</ChallengeTitle>
          <ChallengeDescription description={description} />
        </div>
        <ToolPanel
          executeChallenge={executeChallenge}
          guideUrl={guideUrl}
          openHelpModal={openHelpModal}
          openResetModal={openResetModal}
        />
        <Spacer />
        <Output
          defaultOutput={`/**
  * Your output will go here.
  * Any console.log() statements
  * will appear in here as well.
  */`}
          output={output}
        />
        <br />
        <TestSuite tests={tests} />
      </div>
    );
  }
}

SidePanel.displayName = 'SidePanel';
SidePanel.propTypes = propTypes;

export default connect(mapStateToProps, mapDispatchToProps)(SidePanel);
