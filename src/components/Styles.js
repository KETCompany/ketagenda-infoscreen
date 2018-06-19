
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