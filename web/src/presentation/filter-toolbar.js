import React from 'react';
import Toolbar from 'material-ui/lib/toolbar/toolbar';
import Popover from 'material-ui/lib/popover/popover';
import Checkbox from 'material-ui/lib/checkbox';
import DropdownIcon from 'material-ui/lib/svg-icons/navigation/arrow-drop-down-circle';
//import Status from '../containers/filter-toolbar-status';

class StatusList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      statusPopoverOpen: false,
      typesPopoverOpen: false,
      membersPopoverOpen: false,
      popoverTarget: null
    };

    this.setPopoverState = popoverName => event => {
      const newState = {
        statusPopoverOpen: false,
        typesPopoverOpen: false,
        membersPopoverOpen: false,
        popoverTarget: null
      };

      if(popoverName) {
        newState[`${popoverName}PopoverOpen`] = true;
        newState.popoverTarget = event.currentTarget;
      }

      this.setState(newState);
    };
  }

  render() {
    return(
      <Toolbar className='filter-toolbar'>
        <button onClick={this.setPopoverState('status')}><DropdownIcon color='white'/> Statuses</button>
        <button onClick={this.setPopoverState('types')}><DropdownIcon color='white'/> Types</button>
        <button onClick={this.setPopoverState('members')}><DropdownIcon color='white'/> Members</button>
        <input type='text' />

        <Popover
          open={this.state.statusPopoverOpen}
          anchorEl={this.state.popoverTarget}
          onRequestClose={this.setPopoverState()}
          className='filter-toolbar-popover'
          style={{ padding: '1rem' }}
        >
          <fieldset className='usa-fieldset-inputs'>
            <legend className='usa-sr-only'>Available flight statuses</legend>
            {this.props.statuses.map(s => <span key={s.id}><input type='checkbox' id={`status-toggle-${s.name}`} title={`Toggle ${s.name}`} value={s.name} checked={s.checked} onChange={this.props.getStatusToggleHandler(s.real)}/><label htmlFor={`status-toggle-${s.name}`}>{s.name} ({s.flightCount} projects)</label></span>)}
          </fieldset>
        </Popover>

        <Popover
          open={this.state.typesPopoverOpen}
          anchorEl={this.state.popoverTarget}
          onRequestClose={this.setPopoverState()}
          className='filter-toolbar-popover'
          style={{ padding: '1rem' }}
        >
          <fieldset className='usa-fieldset-inputs'>
            <legend className='usa-sr-only'>Flight types</legend>
            {this.props.labels.map(l => <span key={l.id}><input type='checkbox' id={`status-toggle-${l.name}`} title={`Toggle ${l.name}`} value={l.name} checked={l.checked} onChange={this.props.getLabelToggleHandler(l.real)}/><label htmlFor={`status-toggle-${l.name}`}>{l.name} ({l.flightCount} projects)</label></span>)}
          </fieldset>
        </Popover>

        <Popover
          open={this.state.membersPopoverOpen}
          anchorEl={this.state.popoverTarget}
          onRequestClose={this.setPopoverState()}
          className='filter-toolbar-popover'
          style={{ padding: '1rem' }}
        >
          <fieldset className='usa-fieldset-inputs'>
            <legend className='usa-sr-only'>Air Traffic Control members</legend>
            {this.props.members.map(m => <span key={m.id}><input type='checkbox' id={`member-toggle-${m.name}`} title={`Toggle ${m.name}`} value={m.name} checked={m.checked} onChange={this.props.getMemberToggleHandler(m.real)}/><label htmlFor={`status-toggle-${m.name}`}>{m.name} ({m.flightCount} projects)</label></span>)}
          </fieldset>
        </Popover>
      </Toolbar>
    );
  }
}

export default StatusList;
