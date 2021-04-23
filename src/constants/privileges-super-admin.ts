export const SUPER_ADMIN_ACCESSLEVELS = {
    id:1,
    type: "superadmin",
    name: "SUPER ADMIN",
    action: true,
    permissions: {
        "Resident-Company": {
            name: "Resident Company",
            action: true,
            create: true,
            view: true,
            update: true,
            delete: true,
            submenu: {
                "All": {
                    name: "All",
                    create: true,
                    view: true,
                    update: true,
                    delete: true,
                    action: true
                },
                "Review": {
                    name: "Review",
                    create: true,
                    view: true,
                    update: true,
                    delete: true,
                    action: true
                },
                "Approved": {
                    name: "Approved",
                    create: true,
                    view: true,
                    update: true,
                    delete: true,
                    action: true
                },
                "Published": {
                    name: "Published",
                    create: true,
                    view: true,
                    update: true,
                    delete: true,
                    action: true
                },
              
                "Reject": {
                    name: "Reject",
                    create: true,
                    view: true,
                    update: true,
                    delete: true,
                    action: true,
                },
                "Graduate": {
                    name: "Graduate",
                    create: true,
                    view: true,
                    update: true,
                    delete: true,
                    action: true
                }
            }
        },
        "Resident-Company-Page": {
            name: "Resident Company Page",
            create: true,
            view: true,
            update: true, //Edit
            delete: true,
            action: true// Approve, reject, comment
        },
        "User-Management": {
            name: "User Management",
            create: true,
            view: true,
            update: true,
            delete: true,
            action: true,
            submenu: {
                "Admin": {
                    name: "Admin",
                    create: true,
                    view: true,
                    update: true,
                    delete: true,
                    action: true
                },
                "Sponsor": {
                    name: "Sponsor",
                    create: true,
                    view: true,
                    update: true,
                    delete: true,
                    action: true
                },
                "Resident": {
                    name: "Resident",
                    create: true,
                    view: true,
                    update: true,
                    delete: true,
                    action: true
                }
            }
        },
        "Site-Directory": {
            name: "Site Directory",
            create: true,
            view: true,
            update: true,
            delete: true,
            action: true,
            submenu: {
                "Members": {
                    name: "Members",
                    create: true,
                    view: true,
                    update: true,
                    delete: true,
                    action: true
                },
                "Site-Admins": {
                    name: "Site Admins",
                    create: true,
                    view: true,
                    update: true,
                    delete: true,
                    action: true
                },
                "Companies": {
                    name: "Companies",
                    create: true,
                    view: true,
                    update: true,
                    delete: true,
                    action: true
                }
            }
        },
        "Sponsor-Connect": {
            name: "Sponsor-Connect",
            create: true,
            view: true,
            update: true,
            delete: true,
            action: true
        },
        "Resident-Company-Invoicing": {
            name: "Resident Company Invoicing",
            create: true,
            view: true,
            update: true,
            delete: true,
            action: true,
            
        }
    }
};
