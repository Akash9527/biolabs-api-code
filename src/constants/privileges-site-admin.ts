// Privileges for site admin user
export const SITE_ADMIN_ACCESSLEVELS = {
  id: 2,
  type: 'siteadmin',
  name: 'SITE ADMIN',
  action: true,
  permissions: {
    applications: {
      name: 'Applications',
      action: true,
      create: true,
      view: true,
      update: true,
      delete: true,
    },
    'sponsor-view': {
      name: 'Sponsor View',
      action: true,
      create: true,
      view: true,
      update: true,
      delete: true,
      child: {
        'sponsor': {
          name: 'Sponser',
          action: true,
          create: true,
          view: true,
          update: true,
          delete: true,
        },
      }
    },
    'application-form': {
      name: 'Application Form',
      action: true,
      create: true,
      view: true,
      update: true,
      delete: true,
    },
    user: {
      name: 'Manage Users',
      action: true,
      create: true,
      view: true,
      update: true,
      delete: true,
      child: {
        'management': {
          name: 'Admin',
          action: true,
          create: true,
          view: true,
          update: true,
          delete: true,
        },
        'sponsor': {
          name: 'Sponsors',
          action: false,
          create: false,
          view: false,
          update: false,
          delete: false,
        },
        'resident': {
          name: 'Resident Admin',
          action: true,
          create: true,
          view: true,
          update: true,
          delete: true,
        }
      }
    },
    'invoice-waitlist': {
      name: 'Invoice/Waitlist',
      action: true,
      create: true,
      view: true,
      update: true,
      delete: true,
      child: {
        'invoice-summary': {
          name: 'Invoice Summary',
          action: true,
          create: true,
          view: true,
          update: true,
          delete: true,
        },
        'waitlist': {
          name: 'Waitlist',
          action: true,
          create: true,
          view: true,
          update: true,
          delete: true,
        }
      }
    },
    sites: {
      name: 'Sites',
      action: true,
      create: true,
      view: true,
      update: true,
      delete: true,
    },
    directory: {
      name: 'Directory',
      action: true,
      create: true,
      view: true,
      update: true,
      delete: true,
      child: {
        'directory-members': {
          name: 'Members',
          action: true,
          create: true,
          view: true,
          update: true,
          delete: true,
        },
        'directory-site': {
          name: 'Site Employee',
          action: true,
          create: true,
          view: true,
          update: true,
          delete: true,
        },
        'directory-companies': {
          name: 'Companies',
          action: true,
          create: true,
          view: true,
          update: true,
          delete: true,
        }
      }
    },
    configurations: {
      name: 'Configurations',
      action: true,
      create: true,
      view: true,
      update: true,
      delete: true,
      child: {
        'application-configure': {
          name: 'Application Configuration',
          action: false,
          create: false,
          view: false,
          update: false,
          delete: false,
        },
        'configure': {
          name: 'Cost Configuration',
          action: true,
          create: true,
          view: true,
          update: true,
          delete: true,
        },
      },
    },
    profile: {
      name: 'My Profile',
      action: true,
      create: true,
      view: true,
      update: true,
      delete: true,
    },
    'resident-companies': {
      name: 'Resident Companies',
      action: true,
      create: true,
      view: true,
      update: true,
      delete: true,
    },
  },
};
