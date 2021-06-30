
var appURL = window.location.protocol + '//' + window.location.hostname;

export const urls = {
    SEARCH: '/search',
    COLLECTION: '/collection',
    REQUESTS: '/request',
    REPORTS: '/reports',
    JOBS: '/jobs',
    USER_ROLES: '/userRoles',
    ROLES: '/roles',
    BULK_REQUEST: '/bulkRequest',
    ADMIN: '/admin',
    LOGIN: '/login',
    DATA_EXPORT: '/dataExport',
    OPEN_MARC: '/openMarcRecordByBibId',
    DASHBOARD: '/validation',
    CAS_PREFIX: '/login-scsb?institution=',
    API: '/api',
    BATCH_SCHEDULE: appURL + ':9096',
    LOGOUT: '/logout?CSRF-TOKEN=',
    MONITORING: '/monitoring',
    APP_URL: appURL,
    PORT: window.location.port,
    ENTER: 'Enter'
}