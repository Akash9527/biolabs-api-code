export const SITE_ADMIN_ACCESSLEVELS = {
    id:2,
    type: "siteadmin",
    name: "SITE ADMIN",
    action: true,
    permissions:  {
        "applications": {
            name: "Applications",
            action: true,
            create: true,
            view: true,
            update: true,
            delete: true
        },
        "sponsor-view": {
            name: "Sponsor View",
            action: true,
            create: true,
            view: true,
            update: true,
            delete: true
        },
        "application-form": {
            name: "Application Form",
            action: true,
            create: true,
            view: true,
            update: true,
            delete: true
        },
        "user": {
            name: "Manage Users",
            action: true,
            create: true,
            view: true,
            update: true,
            delete: true
        },
        "sites": {
            name: "Sites",
            action: true,
            create: true,
            view: true,
            update: true,
            delete: true
        },
        "directory": {
            name: "Directory",
            action: true,
            create: true,
            view: true,
            update: true,
            delete: true
        },
        "configurations": {
            name: "Configurations",
            action: true,
            create: true,
            view: true,
            update: true,
            delete: true,
            child: {
                "application-form": {
                    name: "Application Form",
                    action: false,
                    create: false,
                    view: false,
                    update: false,
                    delete: false
                },
                "item-cost": {
                    name: "Item Cost",
                    action: true,
                    create: true,
                    view: true,
                    update: true,
                    delete: true
                }
            }
        },
        "profile": {
            name: "My Profile",
            action: true,
            create: true,
            view: true,
            update: true,
            delete: true
        },
        "resident-companies": {
            name: "Resident Companies",
            action: true,
            create: true,
            view: true,
            update: true,
            delete: true
        }
    }
};
