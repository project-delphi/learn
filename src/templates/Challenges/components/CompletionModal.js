import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { Button, Modal } from 'react-bootstrap';

import GreenPass from './icons/GreenPass';

import {
  closeModal,
  submitChallenge,
  isCompletionModalOpenSelector,
  successMessageSelector
} from '../redux';

const mapStateToProps = createSelector(
  isCompletionModalOpenSelector,
  successMessageSelector,
  (isOpen, message) => ({
    isOpen,
    message
  })
);

const mapDispatchToProps = function(dispatch) {
  const dispatchers = {
    close: () => dispatch(closeModal('completion')),
    handleKeypress: e => {
      if (e.keyCode === 13 && (e.ctrlKey || e.metaKey)) {
        dispatch(submitChallenge());
      }
    },
    submitChallenge: () => {
      dispatch(submitChallenge());
    }
  };
  return () => dispatchers;
};

const propTypes = {
  close: PropTypes.func.isRequired,
  handleKeypress: PropTypes.func.isRequired,
  isOpen: PropTypes.bool,
  message: PropTypes.string,
  submitChallenge: PropTypes.func.isRequired
};

export class CompletionModal extends PureComponent {
  render() {
    const {
      close,
      isOpen,
      submitChallenge,
      handleKeypress,
      message
    } = this.props;
    return (
      <Modal
        animation={false}
        dialogClassName={'challenge-success-modal'}
        keyboard={true}
        onHide={close}
        onKeyDown={isOpen ? handleKeypress : noop}
        show={isOpen}
        >
        <Modal.Header className={'challenge-list-header'} closeButton={true}>
          <Modal.Title>{message}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className='text-center'>
            <div className='row'>
              <div>
                <GreenPass />
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            block={true}
            bsSize='large'
            bsStyle='primary'
            onClick={submitChallenge}
            >
            Submit and go to next challenge (Ctrl + Enter)
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

CompletionModal.displayName = 'CompletionModal';
CompletionModal.propTypes = propTypes;

export default connect(mapStateToProps, mapDispatchToProps)(CompletionModal);
