/*
NOTHING TO TOUCH HERE!!!!
    ▄▄▄▄▀▀▀▀▀▀▀▀▄▄▄▄▄▄
    █░░░░▒▒▒▒▒▒▒▒▒▒▒▒░░▀▀▄
   █░░░▒▒▒▒▒▒░░░░░░░░▒▒▒░░█
  █░░░░░░▄██▀▄▄░░░░░▄▄▄░░░█
░▀▒▄▄▄▒░█▀▀▀▀▄▄█░░░██▄▄█░░░█
█▒█▒▄░▀▄▄▄▀░░░░░░░░█░░░▒▒▒▒▒█
█▒█░█▀▄▄░░░░░█▀░░░░▀▄░░▄▀▀▀▄▒█
 █▀▄░█▄░█▀▄▄░▀░▀▀░▄▄▀░░░░█░░█
  █░░▀▄▀█▄▄░█▀▀▀▄▄▄▄▀▀█▀██░█
   █░░██░░▀█▄▄▄█▄▄█▄████░█
    █░░░▀▀▄░█░░░█░███████░█
     ▀▄░░░▀▀▄▄▄█▄█▄█▄█▄▀░░█
       ▀▄▄░▒▒▒▒░░░░░░░░░░█
          ▀▀▄▄░▒▒▒▒▒▒▒▒▒▒░█
              ▀▄▄▄▄▄░░░░░█
unless you know what you're doing... :)

 * Indirizzi di produzione delle risorse (attualmente test), inserire indirizzi reali di CDN
 * il placeholder '{{ VERSION }}' viene sostituito con la version del package dal task string-replace, non modificare!
 */
window.AgidSpidEnter.prototype.config = {
    version: '{{ VERSION }}',
    assetsBaseUrl: '/vendor/spid-auth/',
    stylesheetUrl: '/vendor/spid-auth/css/agid-spid-enter.min.{{ VERSION }}.css',
    providersEndpoint: '/spid/providers',
    localisationEndpoint: '/vendor/spid-auth/data/spidI18n.json'
};

/*
 * Crea istanza del modulo
 */
window.agidSpidEnter = new window.AgidSpidEnter();
