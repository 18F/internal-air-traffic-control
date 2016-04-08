import React from 'react';
import Popover from 'material-ui/lib/popover/popover';
import Checkbox from 'material-ui/lib/checkbox';
import DropdownIcon from 'material-ui/lib/svg-icons/navigation/arrow-drop-down-circle';

class FilterToolbarStatus extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      membersPopoverOpen: false,
      statusPopoverOpen: false,
      popoverTarget: null
    };

    this.handleStatusButtonTap = (event) => {
      this.setState({
        membersPopoverOpen: false,
        statusPopoverOpen: true,
        popoverTarget: event.currentTarget
      });
    };

    this.handleMembersButtonTap = (event) => {
      this.setState({
        membersPopoverOpen: true,
        statusPopoverOpen: false,
        popoverTarget: event.currentTarget
      })
    };

    this.handlePopoverClose = () => {
      this.setState({
        membersPopoverOpen: false,
        statusPopoverOpen: false,
        popoverTarget: null
      });
    };
  }

  render() {
    return (
      <div>
        <button onClick={this.handleStatusButtonTap}><DropdownIcon color='white'/> Statuses</button>
        <button onClick={this.handleMembersButtonTap}><DropdownIcon color='white'/> Members</button>

        <Popover
          open={this.state.statusPopoverOpen}
          anchorEl={this.state.popoverTarget}
          onRequestClose={this.handlePopoverClose}
          className='status-list-popover'
          style={{ padding: '1rem' }}
        >
          <fieldset className='usa-fieldset-inputs'>
            <legend className='usa-sr-only'>Available flight statuses</legend>
            {this.props.statuses.map(s => <span key={s.id}><input type='checkbox' id={`status-toggle-${s.name}`} title={`Toggle ${s.name}`} value={s.name} checked={s.checked} onChange={this.props.getStatusToggleHandler(s.real)}/><label htmlFor={`status-toggle-${s.name}`}>{s.name} ({s.flightCount} projects)</label></span>)}
          </fieldset>
        </Popover>

        <Popover
          open={this.state.membersPopoverOpen}
          anchorEl={this.state.popoverTarget}
          onRequestClose={this.handlePopoverClose}
          className='status-list-popover'
          style={{ padding: '1rem' }}
        >
          <fieldset className='usa-fieldset-inputs'>
            <legend className='usa-sr-only'>Air Traffic Control members</legend>
            {this.props.members.map(m => <span key={m.id}><input type='checkbox' id={`member-toggle-${m.name}`} title={`Toggle ${m.name}`} value={m.name} checked={m.checked} onChange={this.props.getMemberToggleHandler(m.real)}/><label htmlFor={`status-toggle-${m.name}`}>{m.name} ({m.flightCount} projects)</label></span>)}
          </fieldset>
        </Popover>
      </div>
    );
  }
}

export default FilterToolbarStatus;
