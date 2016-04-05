import React from 'react';
//import Tabs from 'material-ui/lib/tabs/tabs';
import Toolbar from 'material-ui/lib/toolbar/toolbar';
import RaisedButton from 'material-ui/lib/raised-button';
import Popover from 'material-ui/lib/popover/popover';
import Checkbox from 'material-ui/lib/checkbox';
import DropdownIcon from 'material-ui/lib/svg-icons/navigation/arrow-drop-down-circle';

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
        <RaisedButton className='button' label='Statuses' primary={true} icon={<DropdownIcon color='white'/>} onTouchTap={this.handleStatusButtonTap} />
        <Popover
          open={this.state.popoverOpen}
          anchorEl={this.state.popoverTarget}
          onRequestClose={this.handlePopoverClose}
          className='status-list-popover'
        >
          {this.props.statuses.map(s => <Checkbox key={s.id} checked={s.checked} label={`${s.name} (${s.flightCount})`} style={{ margin: '1rem' }} onCheck={this.props.getToggleHandler(s.real)}></Checkbox>)}
        </Popover>
      </Toolbar>
    );
  }
}

export default StatusList;
