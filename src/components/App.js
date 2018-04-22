import React from 'react';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';

import withRoot from '../withRoot';
import * as RoomAPI from '../api/roomApi';
import * as QRCode from 'qrcode.react';

import BigCalendar from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css';
require('moment/locale/nl.js');

BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment))
var agendastartTime = new Date();
agendastartTime.setHours(7,0,0,0);
var agendaEndTime = new Date();
agendaEndTime.setHours(20,0,0,0);

const styles = theme => ({
  root: {
    textAlign: 'center'
  },
  search: {
    width: '100%',
  },
  paper: {
    paddingTop: 16,
    paddingBottom: 16,
    marginTop: theme.spacing.unit * 3,
    width: 600,
    margin: '0 auto',
  },
  green: {
    backgroundColor: 'green',
  },
  red: {
    backgroundColor: 'red'
  },
  heading: {
    fontSize: theme.typography.pxToRem(10),
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(10),
    color: theme.palette.text.secondary,
  },
  verticalAlign: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  icon: {
    verticalAlign: 'bottom',
    height: 20,
    width: 20,
  },
  helper: {
    borderLeft: `2px solid ${theme.palette.divider}`,
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
  },
  link: {
    color: theme.palette.primary.main,
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  expansionPanelRoot: {
    flexGrow: 1,
    marginTop: theme.spacing.unit * 3,
  },
  expandeds: false,
  table: {
    minWidth: 700,
    overflowX: 'auto',
    height: '100%'
  },
  row: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.background.default,
    },
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
    this.state = {
      roomId: "5ac606c46fda06c8055b101b",
      roomName: '',
      roomSlogan: 'KET-Agenda - Key for electronic technolgies in agenda\'s',
      maintMess: 'System planned for maintenance from 7th of Juni to 1th of August. Sorry for the inconvenience.',
      name: '',
      agendaItems: [],
      noAgendaItems: true,
    };
    this.loadRoomData();
  }

  loadRoomData = () => {
    RoomAPI.get(this.state.roomId).then((json) => {
      this.setState({
        name: json.name,
        agendaItems: json.booked.map((val) => {
          return {
            id: val._id,
            start: new Date(val.start),
            end: new Date(val.end),
            allDay: false,
            title: ''//val.class + val.subjectCode
          }
        }),
        noAgendaItems: false
      })
    })
  }
  renderAgenda = () => {
    const { agendaItems, noAgendaItems } = this.state;
    if (!noAgendaItems) {
      return (
        <div>
            <BigCalendar
              events={agendaItems}
              step={12}
              timeslots={10}
              defaultView="week"
              defaultDate={new Date()}
              min={agendastartTime}
              end={agendaEndTime}
              toolbar={true}
            />
        </div>
      );
    } else {
      return (<div></div>)
    }
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
              <QRCode className={classes.qrcode} value="5ac606c46fda06c8055b1019" level='M' /*'Q' 'H'*/ renderAs="svg" />
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
