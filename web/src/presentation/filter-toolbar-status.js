import React from 'react';
import Popover from 'material-ui/lib/popover/popover';
import Checkbox from 'material-ui/lib/checkbox';
import DropdownIcon from 'material-ui/lib/svg-icons/navigation/arrow-drop-down-circle';

class FilterToolbarStatus extends React.Component {
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
    return (
      <div>
        <button onClick={this.handleStatusButtonTap}><DropdownIcon color='white'/> Statuses</button>
        <Popover
          open={this.state.popoverOpen}
          anchorEl={this.state.popoverTarget}
          onRequestClose={this.handlePopoverClose}
          className='status-list-popover'
          style={{ padding: '1rem' }}
        >
          <fieldset className='usa-fieldset-inputs'>
            <legend className='usa-sr-only'>Available flight statuses</legend>
            {this.props.statuses.map(s => <span key={s.id} style={{ margin: '1rem' }}><input type='checkbox' name={`status-toggle-${s.name}`} value={s.name} checked={s.checked} onChange={this.props.getToggleHandler(s.real)}/><label htmlFor={`status-toggle-${s.name}`}>{s.name} ({s.flightCount} projects)</label></span>)}
          </fieldset>
        </Popover>
      </div>
    );
  }
}

export default FilterToolbarStatus;
