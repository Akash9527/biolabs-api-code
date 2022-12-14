// Privileges for super admin user
export const SUPER_ADMIN_ACCESSLEVELS = {
  id: 1,
  type: 'superadmin',
  name: 'SUPER ADMIN',
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
          name: 'Sponsor',
          action: true,
          create: true,
          view: true,
          update: true,
          delete: true,
        },
        'search': {
          name: 'Resident Companies',
          action: true,
          create: true,
          view: true,
          update: true,
          delete: true,
        },
        'explore': {
          name: 'Explore Page',
          action: true,
          create: true,
          view: true,
          update: true,
          delete: true,
          dynamic: {
            name: 'Dynamic Numeric Value',
            action: true,
            create: true,
            view: true,
            update: true,
            delete: true
          }
        }
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
          action: true,
          create: true,
          view: true,
          update: true,
          delete: true,
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
          action: true,
          create: true,
          view: true,
          update: true,
          delete: true,
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
      dynamic: {
        'company': {
          name: 'Company Profile',
          action: true,
          create: true,
          view: true,
          update: true,
          delete: true
        },
        'onboarding': {
          name: 'Onboarding Information',
          action: true,
          create: true,
          view: true,
          update: true,
          delete: true
        },
        'companyadmin': {
          name: 'Admin',
          action: true,
          create: true,
          view: true,
          update: true,
          delete: true
        },
        'growth': {
          name: 'Company Growth',
          action: true,
          create: true,
          view: true,
          update: true,
          delete: true
        },
        'invoicing': {
          name: 'Invoicing',
          action: true,
          create: true,
          view: true,
          update: true,
          delete: true
        },
        'planchange': {
          name: 'Change Request',
          action: true,
          create: true,
          view: true,
          update: true,
          delete: true
        }
      }
    },
  },
}

