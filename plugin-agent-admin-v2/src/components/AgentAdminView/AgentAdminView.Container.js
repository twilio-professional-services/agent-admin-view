import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Actions } from '../../states/WorkerListState';
import AgentAdminView from './AgentAdminView';

const mapStateToProps = (state) => ({
  workers: state['agent-admin'].workerList.workers || [],
});

// No need for dispatch, will use functions to update worker via API
// const mapDispatchToProps = (dispatch) => ({
//   updateWorker: bindActionCreators(Actions.handleWorkerUpdated, dispatch),
// });

export default connect(mapStateToProps)(AgentAdminView);
