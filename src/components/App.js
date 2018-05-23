import React from 'react';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';

import cookie from 'react-cookies';

import * as randomstring from 'randomstring';

// Qrcode
import * as QRCode from 'qrcode.react';

// Api files
import withRoot from '../withRoot';
import * as RoomAPI from '../api/roomApi';

// import Websocket from 'react-websocket';

// Calendar
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

require('moment/locale/nl.js');

require('dotenv').config();

const styles = theme => ({
  root: {
    textAlign: 'center'
  },
  paper: {
    paddingTop: 16,
    paddingBottom: 16,
    marginTop: theme.spacing.unit * 3,
    width: 600,
    margin: '0 auto',
  },
  heading: {
    fontSize: theme.typography.pxToRem(10),
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(10),
    color: theme.palette.text.secondary,
  },
  qrcode: {
    width: "80%",
    height: "80%"
  }
});

class Index extends React.Component {
  constructor() {
    super();
    this.now = new Date();
    if (cookie.load('displayKey') === undefined) {
      cookie.save('displayKey', randomstring.generate(), { path: '/' });
    }
    this.state = {
      displayKey: cookie.load('displayKey'),
      roomName: '',
      roomSlogan: 'KET-Agenda - Key for electronic technolgies in agenda\'s',
      maintMess: 'System planned for maintenance from 7th of Juni to 1th of August. Sorry for the inconvenience.',
      name: '',
      agendaItems: [],
    };
    
    this.loadSocket();
    this.loadRoom();
  }

  loadSocket = () => {
    const webSocket = new WebSocket(process.env.REACT_APP_SOCKET_ADDRESS);
    webSocket.onopen = (evt) => {
      console.log(evt);
      if (evt.isTrusted === true) {
        webSocket.send(JSON.stringify({
          msgType: 'register',
          displayKey: this.state.displayKey,
        }));
      } else {
        return false;
      }
      return webSocket;
    };
    webSocket.onmessage = (evt) => {
      if (evt.isTrusted === true) {
        this.processSocketMessage(JSON.parse(evt.data));
      } else {
        return false;
      }
      return webSocket;
    };
    webSocket.onclose = (evt) => {
      setTimeout(() => { this.loadSocket(); console.log('tried to connect'); }, 5000);
    };
  }

  processSocketMessage = (res) => {
    if (res.bookings) {
      console.log(res.bookings);
      this.setState({
        agendaItems: res.bookings,
      });
      this.renderAgenda();
    }
  }

  loadRoom = () => {
    return RoomAPI.get(this.state.displayKey)
      .then((json) => {
        if (json === []) {
          return false;
        }
        this.setState({
          name: json.name,
          agendaItems: json.bookings
            .map((val) => {
              return {
                // id: val._id,
                start: new Date(val.start),
                end: new Date(val.end),
                title: val.name,
              }
            })
        })
      })
      .catch(error => console.log(error));
  }

  agendaTime = (date, hours) => { 
    date.setHours(hours,0,0,0); 
    return date 
  }

  renderAgenda = () => {
    const { agendaItems } = this.state;
    BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment))

    return (
      <div>
          <BigCalendar
            events={agendaItems}
            step={12}
            timeslots={10}
            defaultView="week"
            defaultDate={new Date()}
            min={this.agendaTime(new Date(), 7)}
            end={this.agendaTime(new Date(), 20)}
            toolbar={true}
          />
      </div>
    );
  }

  renderSideInformation = () => {
    const { classes } = this.props;
    return (
      <Grid container spacing={16}>
        <Grid item xs={12}>
          <Paper>
            <Typography variant="title">
              NFC instructions
            </Typography>
            <Typography component="p">
              <img src={require("../assets/images/nfcInstruction.png")} width="80%" height="80%" alt="" />
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper>
            <Typography variant="title">
              Scan the QR code
            </Typography>
            <Typography component="p">
              <QRCode className={classes.qrcode} value={this.state.displayKey} level='M' /*'Q' 'H'*/ renderAs="svg" />
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    )
  }

  render = () => {
    const { classes } = this.props;
    return (
      <div className={classes.root} style={{ padding: 5, overflowX: 'hidden' }}>
        <Grid container spacing={8}>
          <Grid item xs={2}>
            <img src={require("../assets/images/logohr.png")} width="125px" height="125px" alt="" />
          </Grid>
          <Grid item xs={10} className={classes.verticalAlign}>
            <Typography variant="display1" gutterBottom>
              {this.state.roomSlogan}
            </Typography>
          </Grid>
        </Grid>
        <Grid container spacing={16}>
          <Grid item xs={9}>
            <Grid container spacing={16}>
              <Grid item xs={6}>
                <Paper elevation={4}>
                  <Typography variant="headline">
                    Room {this.state.name}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper elevation={4}>
                  <Typography variant="body2">
                    {this.state.maintMess}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12}>
                {this.state.agendaItems ? this.renderAgenda() : ''}
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={3}>
            { this.renderSideInformation()}
          </Grid>
        </Grid>
      </div>
    );
  }
}

Index.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRoot(withStyles(styles)(Index));