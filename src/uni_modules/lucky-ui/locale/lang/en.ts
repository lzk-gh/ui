export default {
  name: 'en',
  lk: {
    common: {
      confirm: 'Confirm',
      cancel: 'Cancel',
      loading: 'Loading...',
      empty: 'No Data',
    },
    calendar: {
      title: 'Calendar',
      weekdays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      monthTitle: (year: number, month: number) => {
        const months = [
          'January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December'
        ];
        return `${months[month - 1]} ${year}`;
      },
      today: 'Today',
      tomorrow: 'Tomorrow',
      yesterday: 'Yesterday',
      thisWeek: 'This Week',
      thisMonth: 'This Month',
      last7Days: 'Last 7 Days',
      last30Days: 'Last 30 Days',
      clear: 'Clear',
      viewMonth: 'Month',
      viewWeek: 'Week',
      viewScroll: 'Scroll',
      holidayTag: 'H',
      workdayTag: 'W',
    },
    empty: {
      empty: { title: 'No Data', description: 'No content to display' },
      search: { title: 'No Results', description: 'Try different keywords' },
      network: { title: 'Network Error', description: 'Please check your connection' },
      error: { title: 'Loading Failed', description: 'Something went wrong' },
      permission: { title: 'No Permission', description: 'Permission required to view' },
      inbox: { title: 'No Messages', description: 'New messages will appear here' },
      cart: { title: 'Cart Empty', description: 'Add items you like' },
      favorite: { title: 'No Favorites', description: 'Your favorites will be here' },
    },
    picker: {
      confirm: 'Confirm',
      cancel: 'Cancel',
    },
    verifyCode: {
      send: 'Get Code',
      resend: 'Resend',
      countdown: 'Resend in {s}s',
    },
    keyboard: {
      confirm: 'Done',
      hide: 'Hide',
      abc: 'ABC',
      province: 'Province',
    },
    pullRefresh: {
      pulling: 'Pull to refresh',
      loosing: 'Release to refresh',
      loading: 'Refreshing...',
      success: 'Refresh success',
    },
    actionSheet: {
      cancel: 'Cancel',
    },
  },
};
