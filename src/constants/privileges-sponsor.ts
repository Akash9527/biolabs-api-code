export const SPONSOR_ACCESSLEVELS = {
    id:3,
    type: "sponsor",
    name: "SPONSOR",
    action: false,
    permissions: {
        "Resident-Company": {
            name: "Resident Company",
            action: false,
            create: false,
            view: false,
            update: false,
            delete: false,
            submenu: {
                "All": {
                    name: "All",
                    create: false,
                    view: false,
                    update: false,
                    delete: false,
                    action: false
                },
                "Review": {
                    name: "Review",
                    create: false,
                    view: false,
                    update: false,
                    delete: false,
                    action: false
                },
                "Approved": {
                    name: "Approved",
                    create: false,
                    view: false,
                    update: false,
                    delete: false,
                    action: false
                },
                "Published": {
                    name: "Published",
                    create: false,
                    view: false,
                    update: false,
                    delete: false,
                    action: false
                },
              
                "Reject": {
                    name: "Reject",
                    create: false,
                    view: false,
                    update: false,
                    delete: false,
                    action: false,
                },
                "Graduate": {
                    name: "Graduate",
                    create: false,
                    view: false,
                    update: false,
                    delete: false,
                    action: false
                }
            }
        },
        "Resident-Company-Page": {
            name: "Resident Company Page",
            create: false,
            view: true,
            update: false, //Edit
            delete: false,
            action: false// Approve, reject, comment
        },
        "User-Management": {
            name: "User Management",
            create: false,
            view: false,
            update: false,
            delete: false,
            action: false,
            submenu: {
                "Admin": {
                    name: "Admin",
                    create: false,
                    view: false,
                    update: false,
                    delete: false,
                    action: false
                },
                "Sponsor": {
                    name: "Sponsor",
                    create: false,
                    view: false,
                    update: false,
                    delete: false,
                    action: false
                },
                "Resident": {
                    name: "Resident",
                    create: false,
                    view: false,
                    update: false,
                    delete: false,
                    action: false
                }
            }
        },
        "Site-Directory": {
            name: "Site Directory",
            create: false,
            view: false,
            update: false,
            delete: false,
            action: false,
            submenu: {
                "Members": {
                    name: "Members",
                    create: false,
                    view: false,
                    update: false,
                    delete: false,
                    action: false
                },
                "Site-Admins": {
                    name: "Site Admins",
                    create: false,
                    view: false,
                    update: false,
                    delete: false,
                    action: false
                },
                "Companies": {
                    name: "Companies",
                    create: false,
                    view: false,
                    update: false,
                    delete: false,
                    action: false
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
            create: false,
            view: false,
            update: false,
            delete: false,
            action: false,
            
        }
    }
};
