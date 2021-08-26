// Privileges for sponsor user
export const SPONSOR_ACCESSLEVELS = {
  id: 3,
  type: 'sponsor',
  name: 'SPONSOR',
  action: false,
  permissions: {
    applications: {
      name: 'Applications',
      action: false,
      create: false,
      view: false,
      update: false,
      delete: false,
    },
    'sponsor-view': {
      name: 'BioLabs Network',
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
      action: false,
      create: false,
      view: false,
      update: false,
      delete: false,
    },
    user: {
      name: 'Manage Users',
      action: false,
      create: false,
      view: false,
      update: false,
      delete: false,
      child: {
        'management': {
          name: 'Admin',
          action: false,
          create: false,
          view: false,
          update: false,
          delete: false,
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
          action: false,
          create: false,
          view: false,
          update: false,
          delete: false,
        }
      }
    },
    'invoice-waitlist': {
      name: 'Invoice/Waitlist',
      action: false,
      create: false,
      view: false,
      update: false,
      delete: false,
      child: {
        'invoice-summary': {
          name: 'Invoice Summary',
          action: false,
          create: false,
          view: false,
          update: false,
          delete: false,
        },
        'waitlist': {
          name: 'Waitlist',
          action: false,
          create: false,
          view: false,
          update: false,
          delete: false,
        }
      }
    },
    sites: {
      name: 'Sites',
      action: false,
      create: false,
      view: false,
      update: false,
      delete: false,
    },
    directory: {
      name: 'Directory',
      action: false,
      create: false,
      view: false,
      update: false,
      delete: false,
    },
    configurations: {
      name: 'Configurations',
      action: false,
      create: false,
      view: false,
      update: false,
      delete: false,
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
          action: false,
          create: false,
          view: false,
          update: false,
          delete: false,
        },
      },
    },
    profile: {
      name: 'My Profile',
      action: false,
      create: false,
      view: true,
      update: true,
      delete: false,
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
          action: false,
          create: false,
          view: false,
          update: false,
          delete: false
        },
        'companyadmin': {
          name: 'Admin',
          action: false,
          create: false,
          view: false,
          update: false,
          delete: false
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
          action: false,
          create: false,
          view: false,
          update: false,
          delete: false
        },
        'planchange': {
          name: 'Change Request',
          action: false,
          create: false,
          view: false,
          update: false,
          delete: false
        }
      }
    },
  }
}
