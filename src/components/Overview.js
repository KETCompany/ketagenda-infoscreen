import React from 'react';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Button from '@material-ui/core/Button';

// Qrcode
import * as QRCode from 'qrcode.react';

// Cookie control
import cookie from 'react-cookies';

// Api files
import withRoot from '../withRoot';
import * as RoomAPI from '../api/roomApi';

// Calendar
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import {
  Delete
} from '@material-ui/icons';

require('moment/locale/nl.js');

require('dotenv').config();

const styles = theme => ({
  root: {
    textAlign: 'center',
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
    width: '80%',
    height: '80%',
  },
  button: {
    color: theme.palette.text.primary,
    margin: theme.spacing.unit,
  },
});

class Overview extends React.Component {
  constructor(props) {
    super(props);
    this.state = props.state;
    this.loadSocket();
    this.loadRoom();
  }

  loadSocket = () => {
    const webSocket = new WebSocket(process.env.REACT_APP_SOCKET_ADDRESS);
    webSocket.onopen = (evt) => {
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
      setTimeout(() => this.loadSocket(), 5000);
    };
  }

  processSocketMessage = (res) => {
    if (res.bookings) {      
      this.loadRoom();
    } else {
      console.log(res);
    }
  }

  loadRoom = () =>
    RoomAPI.get(this.state.displayKey)
      .then((json) => {
        if (json === [] || json === undefined) {
          return new Error('No agenda data could be found!');
        }
        this.setState({
          name: json.name,
          id: json._id,
          agendaItems: json.bookings
            .map(booking => {
              return {
                id: booking._id,
                start: new Date(booking.start),
                end: new Date(booking.end),
                // event: booking.event
              }
            })
        })
      })
      .catch(error => console.log(error));

  formats = {
    timeGutterFormat: (time, culture, localizer) =>
      localizer.format(time, 'H:mm', culture),

    selectRangeFormat: ({ start, end }, culture, localizer) =>
      `${localizer.format(start, 'H:mm', culture)} - ${localizer.format(end, 'H:mm', culture)}`,

    agendaTimeFormat: (time, culture, localizer) =>
      localizer.format(time, 'H:mm', culture),

    agendaTimeRangeFormat: ({ start, end }, culture, localizer) =>
      `${localizer.format(start, 'H:mm', culture)} - ${localizer.format(end, 'H:mm', culture)}`,

    eventTimeRangeFormat: ({ start, end }, culture, localizer) =>
      `${localizer.format(start, 'H:mm', culture)} - ${localizer.format(end, 'H:mm', culture)}`,
  };

  EventAgenda = ({ event }) => {
    return (
      <span>
        <em style={{ color: 'red' }}>{event.title}</em>
        <p>{event.desc}</p>
      </span>
    )
  }

  Event = ({ event: booking }) => {
    const { event } = booking;
    if (event && event.name) {
      return (
        <span>
          <strong>{event.name}</strong>
          {event.desc && ':  ' + event.desc}
        </span>
      );
    } else {
      return (<div></div>);
    };
  }

  renderAgenda = () => {
    const { agendaItems } = this.state;
    BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment))

    return (
      <div>
          <BigCalendar
            formats={this.formats}
            min={new Date('01/01/1970 7:00')}
            max={new Date('01/01/1970 23:00')}
            defaultView="week"
            defaultDate={new Date()}
            events={agendaItems}
            step={12}
            timeslots={10}
            toolbar={true}
            components={{
              event: this.Event,
              agenda: {
                event: this.EventAgenda,
              },
            }}
          />
      </div>
    );
  }

  renderSideInformation = () => {
    const { classes } = this.props;
    return (
      <div>
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
                <QRCode className={classes.qrcode} value={this.state.id} level='M' /*'Q' 'H'*/ renderAs="svg" />
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </div>
    )
  }

  onDelete = () => {
    cookie.remove('displayKey');
    window.location.reload();
  }

  render = () => {
    const { classes } = this.props;
    return (
      <div className={classes.root} style={{ padding: 5, overflowX: 'hidden' }}>
        <Grid container spacing={8}>
          <Grid item xs={2}>
            <img src={require("../assets/images/logohr.png")} width="125px" height="125px" alt="" />
          </Grid>
          <Grid item xs={9} className={classes.verticalAlign}>
            <Typography variant="display1" gutterBottom>
              {this.state.roomSlogan}
            </Typography>
          </Grid>
          <Grid item xs={1} className={classes.verticalAlign}>
            <Button onClick={this.onDelete} variant="fab" color="primary" aria-label="add" className={classes.button}>
              <Delete />
            </Button>
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

Overview.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRoot(withStyles(styles)(Overview));