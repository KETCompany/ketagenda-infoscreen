import React from 'react';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
import List, { ListItem, ListItemText } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import Divider from 'material-ui/Divider';
import Grid from 'material-ui/Grid';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';

import EventBusyIcon from 'material-ui-icons/EventBusy';
import EventAvailableIcon from 'material-ui-icons/EventAvailable';
import ArrowForwardIcon from 'material-ui-icons/ArrowForward';

import withRoot from '../withRoot';
// import * as RoomAPI from '../api/RoomAPI';

import { CircularProgress } from 'material-ui/Progress';
import purple from 'material-ui/colors/purple';
import * as QRCode from 'qrcode.react';
// import RoomsContainer from '../containers/RoomsContainer';

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

const CustomTableCell = withStyles(theme => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
  td: {
    margin: 4
  }
}))(TableCell);

class Index extends React.Component {
  constructor() {
    super();

    this.state = {
      agendaItems: []
    };

    this.createData = this.createData.bind(this);
  }

  componentDidMount = () => {
    this.createData(1, 'Maandag')
      .then(() => this.createData(2, 'Dinsdag'))
      .then(() => this.createData(3, 'Woensdag'))
      .then(() => this.createData(4, 'Donderdag'))
      .then(() => this.createData(5, 'Vrijdag')
    )
  }

  createData = async (id, weekDay) => {
    let rand = this.randomNumber(11)
    return this.setState({
      agendaItems: [...this.state.agendaItems, {id, weekDay, rand }],
    });
  }

  randomNumber = (times) => {
    let array = [];
    for (let count = 0; count < times; count++) {
      array.push(Math.round(1 + (Math.random() * (6 - 1))) % 2 === 0 ? 'green' : 'red')
    }
    return array;
  }

  renderRooms = () => {
    const { classes } = this.props;
    return (
        <Paper className={classes.root} style={{overflowX: 'auto'}}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <CustomTableCell>Day</CustomTableCell>
                <CustomTableCell>8:00</CustomTableCell>
                <CustomTableCell>9:00</CustomTableCell>
                <CustomTableCell>10:00</CustomTableCell>
                <CustomTableCell>11:00</CustomTableCell>
                <CustomTableCell>12:00</CustomTableCell>
                <CustomTableCell>13:00</CustomTableCell>
                <CustomTableCell>14:00</CustomTableCell>
                <CustomTableCell>15:00</CustomTableCell>
                <CustomTableCell>16:00</CustomTableCell>
                <CustomTableCell>17:00</CustomTableCell>
                <CustomTableCell>18:00</CustomTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.agendaItems.map(n => {
                console.log();
                return (
                  <TableRow className={classes.row} key={n.id}>
                    <CustomTableCell>{n.weekDay}</CustomTableCell>
                    {n.rand.map(r => {
                      return(
                        <CustomTableCell className={classes[r]}></CustomTableCell>
                      )
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Paper>
      )
  }

  sideInformation = () => {
    const { classes } = this.props;
    return (
      <Grid container spacing={16}>
        <Grid item xs={12}>
          <Paper>
            <Typography variant="title">
              NFC instructions
            </Typography>
            <Typography component="p">
              <img src={require("../assets/images/nfcInstruction.png")} width="80%" height="80%" alt=""/>
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
            <img src={require("../assets/images/logohr.png")} width="125px" height="125px" alt=""/>  
          </Grid>
          <Grid item xs={10} className={classes.verticalAlign}>
            <Typography variant="display1" gutterBottom>
              KET-Agenda - Key for electronic technolgies in agenda's
            </Typography>
          </Grid>
        </Grid>
        <Grid container spacing={16}>
          <Grid item xs={9}>
            <Grid container spacing={16}>
              <Grid item xs={6}>
                <Paper elevation={4}>
                  <Typography variant="headline">
                    Room H4.308
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper elevation={4}>
                  <Typography variant="body2">
                    System planned for maintenance from 7th of Juni to 1th of August.<br />
                    Sorry for the inconvenience.
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12}>
                {this.renderRooms()}
                {/* <Grid container spacing={8}>
                  <Grid item xs={12}>
                    <Paper>Maandag</Paper>              
                  </Grid>            
                  <Grid item xs={12}>
                    <Paper>Dinsdag</Paper>              
                  </Grid>            
                  <Grid item xs={12}>
                    <Paper>Woensdag</Paper>              
                  </Grid>            
                  <Grid item xs={12}>
                    <Paper>Donderdag</Paper>
                  </Grid>            
                  <Grid item xs={12}>
                    <Paper>Vrijdag</Paper>              
                  </Grid>            
                </Grid> */}
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={3}>            
            {this.sideInformation()}
          </Grid>
          {/* <Grid item xs={8}>
            {this.renderRooms()}
          </Grid>
          <Grid item xs={4}>
          <Paper className={classes.root} elevation={4}>
            <Typography variant="headline" component="h3">
              This is a sheet of paper.
            </Typography>
            <Typography component="p">
              Paper can be used to build surface or other elements for your application.
            </Typography>
          </Paper>
            <Paper>Information</Paper>
          </Grid> */}
        </Grid>
      </div>
    );
  }
}

Index.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRoot(withStyles(styles)(Index));
