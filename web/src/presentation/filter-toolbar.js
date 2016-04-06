import React from 'react';
import Toolbar from 'material-ui/lib/toolbar/toolbar';
import Status from '../containers/filter-toolbar-status';

class StatusList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      popoverOpen: false,
      popoverTarget: null
    };

    this.handleStatusButtonTap = (event) => {
      this.setState({
        popoverOpen: true,
        popoverTarget: event.currentTarget
      });
    };

    this.handlePopoverClose = () => {
      this.setState({
        popoverOpen: false,
        popoverTarget: null
      });
    };
  }

  render() {
    return(
      <Toolbar className='status-toolbar'>
        <Status/>
      </Toolbar>
    );
  }
}

export default StatusList;
