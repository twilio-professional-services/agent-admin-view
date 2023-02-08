import { connect } from 'react-redux';

import AgentAdminView from './AgentAdminView';

const mapStateToProps = (state) => ({
  workers: state['agent-admin'].workerList.workers || [],
});

export default connect(mapStateToProps)(AgentAdminView);
