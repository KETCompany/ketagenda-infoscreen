import React from 'react';
import { withStyles } from 'material-ui/styles';

import cookie from 'react-cookies';

import Overview from '../components/Overview';
import Register from '../components/Register';
// Api files
import withRoot from '../withRoot';

require('moment/locale/nl.js');

require('dotenv').config();

const styles = theme => ({

});

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.now = new Date();
    this.state = {
      displayKey: cookie.load('displayKey'),
      roomName: '',
      roomSlogan: 'KET-Agenda - Key for electronic technolgies in agenda\'s',
      maintMess: 'System planned for maintenance from 7th of Juni to 1th of August. Sorry for the inconvenience.',
      name: '',
      id: '',
      agendaItems: [],
    };
  }

  render = () => {
    if (cookie.load('displayKey') === undefined) {
      return (
        <Register
          state={this.state} 
        />
      )
    } else {
      return (
        <Overview 
          state={this.state}
        />
      )
    }
  }
}

export default withRoot(withStyles(styles)(Index));