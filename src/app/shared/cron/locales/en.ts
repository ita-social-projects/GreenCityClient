export default {
  parts: {
    specificTime: 'at %s:%s',
    and: 'and',
    minute: {
      every: 'at every minute',
      value: 'at minute %s',
      list: 'at minute %s',
      range: 'at every minute from %s through %s'
    },
    hour: {
      every: '',
      value: 'past hour %s',
      list: 'past hour %s',
      range: 'past every hour from %s through %s'
    },
    dayOfMonth: {
      every: '',
      value: 'on day-of-month %s',
      list: 'on day-of-month %s',
      range: 'on every day-of-month from %s through %s'
    },
    month: {
      every: '',
      value: 'in %s',
      list: 'in %s',
      range: 'in every month from %s through %s'
    },
    dayOfWeek: {
      every: '',
      value: 'on %s',
      list: 'on %s',
      range: 'on every day-of-week from %s through %s'
    }
  },
  months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  daysOfWeek: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
};
