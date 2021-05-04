export const SPONSOR_ACCESSLEVELS = {
    id:3,
    type: "sponsor",
    name: "SPONSOR",
    action: false,
    permissions:  {
        "applications": {
            name: "Applications",
            action: false,
            create: false,
            view: false,
            update: false,
            delete: false
        },
        "sponsor-view": {
            name: "Sponsor View",
            action: false,
            create: false,
            view: false,
            update: false,
            delete: false
        },
        "application-form": {
            name: "Application Form",
            action: false,
            create: false,
            view: false,
            update: false,
            delete: false
        },
        "user": {
            name: "Manage Users",
            action: false,
            create: false,
            view: false,
            update: false,
            delete: false
        },
        "sites": {
            name: "Sites",
            action: false,
            create: false,
            view: false,
            update: false,
            delete: false
        },
        "directory": {
            name: "Directory",
            action: false,
            create: false,
            view: false,
            update: false,
            delete: false
        },
        "configurations": {
            name: "Configurations",
            action: false,
            create: false,
            view: false,
            update: false,
            delete: false,
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
                    action: false,
                    create: false,
                    view: false,
                    update: false,
                    delete: false
                }
            }
        },
        "profile": {
            name: "My Profile",
            action: false,
            create: false,
            view: false,
            update: false,
            delete: false
        },
        "bioLabs-network": {
            name: "BioLabs Network",
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
