// Privileges for resident company admin user
export const RESIDENT_ACCESSLEVELS = {
  id: 4,
  type: 'resident',
  name: 'RESIDENT',
  action: true,
  permissions: {
    applications: {
      name: 'Applications',
      action: false,
      create: false,
      view: false,
      update: false,
      delete: false
    },
    'sponsor-view': {
      name: 'BioLabs Network',
      action: false,
      create: false,
      view: false,
      update: false,
      delete: false
    },
    'application-form': {
      name: 'Application Form',
      action: false,
      create: false,
      view: false,
      update: false,
      delete: false
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
          delete: false
        },
        'waitlist': {
          name: 'Waitlist',
          action: false,
          create: false,
          view: false,
          update: false,
          delete: false
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
          delete: true
        },
        'directory-site': {
          name: 'Site Employee',
          action: true,
          create: true,
          view: true,
          update: true,
          delete: true
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
          delete: false
        },
        'configure': {
          name: 'Cost Configuration',
          action: false,
          create: false,
          view: false,
          update: false,
          delete: false
        },
      },
    },
    profile: {
      name: 'My Profile',
      action: true,
      create: true,
      view: true,
      update: true,
      delete: true
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
          action: false,
          create: false,
          view: false,
          update: false,
          delete: false
        },
        'growth': {
          name: 'Company Growth',
          action: false,
          create: false,
          view: false,
          update: false,
          delete: false
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
  }
};
