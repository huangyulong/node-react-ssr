export const topicPrimaryStyle = theme => (
  {
    root: {
      display: 'flex',
      alignItems: 'center',
    },
    title: {
      color: '#666',
    },
    tab: {
      backgroundColor: theme.palette.primary[500],
      textAlign: 'center',
      display: 'inline-block',
      padding: '0 6px',
      color: '#fff',
      borderRadius: 3,
      marginRight: 10,
      fontSize: '12px',
    },
    top: {
      backgroundColor: 'red',
    },
  }
)

export const topicSecondaryStyle = theme => (
  {
    root: {
      display: 'flex',
      alignItems: 'center',
      padding: 3,
    },
    count: {
      textAlign: 'center',
      marginRight: 20,
    },
    username: {
      marginRight: 20,
      color: '#999',
    },
    accentColor: {
      color: theme.palette.accent[300],
    },
  }
)
