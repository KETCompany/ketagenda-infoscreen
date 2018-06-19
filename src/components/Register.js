import React from 'react';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import cookie from 'react-cookies';

import * as randomstring from 'randomstring';

// Api files
import withRoot from '../withRoot';
import * as RoomAPI from '../api/roomApi';

import { Button } from '@material-ui/core';

require('moment/locale/nl.js');

require('dotenv').config();

const styles = theme => ({
  root: {
    textAlign: 'center',
  },
  formRoot: {
    display: 'flex',
    flexWrap: 'wrap',
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
  formControl: {
    margin: theme.spacing.unit,
    minWidth: '100%',
  },
  select: {
    minWidth: 150,
  }
});

class Overview extends React.Component {
  constructor(props) {
    super(props);
    const { roomSlogan } = props.state;
    this.state = {
      rooms: [],
      room: '',
      roomSlogan: roomSlogan,
    };

    this.loadRoom();
  }

  loadRoom = () =>
    RoomAPI.list()
      .then((res) => {
        if (res === [] || res === undefined) {
          return Promise().reject('No rooms could be found!');
        }
        this.setState({ rooms: res });
      })
      .catch(error => console.log(error));

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit = () => {
    const rdm = randomstring.generate();
    const { room } = this.state;
    if (!room.displayKeys) {
      room.displayKeys = [];
    }
    room.displayKeys.push(rdm);
    this.setState({
      room: room
    });
    RoomAPI.put(this.state.room._id, this.state.room)
      .then(res => {
        if (res._id) {
          cookie.save('displayKey', rdm, { path: '/' })
          window.location.reload();
        }
      })
  }

  renderForm = () => {
    const { rooms, room } = this.state;
    const { classes } = this.props;

    if (rooms.length === 0) {
      return (
        <div>No rooms found</div>
      )
    }

    return (
      <form autoComplete="off">
      <FormControl className={classes.formControl}>
        <InputLabel htmlFor="room-select">Room</InputLabel>
        <Select
          className={classes.select}
          value={room}
          onChange={this.handleChange}
          inputProps={{
            name: 'room',
            id: 'room-select',
          }}
        >
          {rooms.map(room => (
            <MenuItem key={room._id} value={room} >{room.name}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <br />
      <br />
      <Button color={'primary'} onClick={this.onSubmit} >Save</Button>
      </form>
    );
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
          <Grid container spacing={8}>
            <Grid item xs={4}>
              &nbsp;
            </Grid>
            <Grid item xs={4}>
              <Paper className={classes.paper}>
                <Typography variant="display1" gutterBottom>
                  Setup
                </Typography>
                <this.renderForm onSubmit={this.onSubmit} />
                <br />
                <div></div>
              </Paper>
            </Grid>
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