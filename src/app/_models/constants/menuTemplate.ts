export const menuList = [
  {
    link: 'dashboard', title: 'Dashboard', icon: 'fas fa-tachometer-alt', right: false, groupCode: 'DASHBOARD',
    codeEdit: [], rightEdit: false, codeShow: ['DASHBOARD_SHOW'], rightShow: false, codeImport: [], rightImport: false
  },
  {
    link: 'it-support', title: 'Technical Support', icon: 'fas fa-headset', right: false, groupCode: 'KY_THUAT',
    codeEdit: [], rightEdit: false, codeShow: [], rightShow: false, codeImport: [], rightImport: false,
    list: [
      {
        link: 'it-support/info', title: 'Overview', icon: '', right: false, groupCode: 'KY_THUAT',
        codeEdit: [], rightEdit: false, codeShow: ['TICKET_SUPPORT'], rightShow: false, codeImport: [], rightImport: false
      },
      {
        link: 'it-support/report', title: 'Ticket Report', icon: '', right: false, groupCode: 'KY_THUAT',
        codeEdit: ['TRANSFER_TICKET'], rightEdit: false, codeShow: ['VIEW_TICKET_REPORT'], rightShow: false, codeImport: [], rightImport: false
      },
    ],
  },
  {
    link: 'hr', title: 'HR Utilities', icon: 'fas fa-user-cog', right: false, groupCode: '',
    codeEdit: [], rightEdit: false, codeShow: [], rightShow: false, codeImport: [], rightImport: false,
    list: [
      {
        link: 'hr/emp', title: 'Employee Management', icon: '', right: false, groupCode: 'NHAN_VIEN',
        codeEdit: ['EMP_EDIT'], rightEdit: false, codeShow: ['EMP_SHOW'], rightShow: false, codeImport: ['EMP_IMPORT'], rightImport: false
      },
    ],
  },
  {
    link: 'library', title: 'Library', icon: 'fas fa-book', right: false, groupCode: 'THU_VIEN',
    codeEdit: [], rightEdit: false, codeShow: ['LIBRARY_MANAGE'], rightShow: false, codeImport: [], rightImport: false
  },
  {
    link: 'permission', title: 'Permission Management', icon: 'fas fa-user-lock', right: false, groupCode: '',
    codeEdit: [], rightEdit: false, codeShow: [], rightShow: false, codeImport: [], rightImport: false,
    list: [
      {
        link: 'permission/history', title: 'Permission History', icon: '', right: false, groupCode: '',
        codeEdit: [], rightEdit: false, codeShow: [], rightShow: false, codeImport: [], rightImport: false
      },
    ],
  },
  {
    link: 'activity-log', title: 'Activity Log', icon: 'fas fa-file-signature', right: false, groupCode: 'LOG_USER',
    codeEdit: [], rightEdit: false, codeShow: ['VIEW_LOG_USER'], rightShow: false, codeImport: [], rightImport: false
  },
  {
    link: 'logout', title: 'Logout', icon: 'fas fa-sign-out-alt', right: true, groupCode: '',
    codeEdit: [], rightEdit: false, codeShow: [], rightShow: false, codeImport: [], rightImport: false
  },
];
