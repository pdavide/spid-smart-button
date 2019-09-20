/* eslint-disable indent */
window.AgidSpidEnter.prototype.tpl = {
    spidMainContainers: function () {
        return [
            '<div id="agid-spid-enter">', '</div>',
            '<div id="agid-infomodal" class="spid-modal" aria-live="assertive" tabindex="0" hidden>', '</div>'
        ].join('');
    },

    svgWithPngFallback: function (imagePath, altText) {
        return [
            '<img aria-hidden="true"',
                'src="', this.config.assetsBaseUrl, imagePath, '.svg"',
                'onerror="this.src=\'', this.config.assetsBaseUrl, imagePath, '.png\'; this.onerror=null;"',
                'alt="', altText, '" />'
        ].join('');
    },

    spidProviderChoiceModal: function (spidProvidersButtons) {
        return [
            '<div id="agid-spid-enter-anim"></div>',
            '<section id="agid-spid-panel-select" aria-labelledby="agid-spid-enter-title-page" tabindex="0">',
                '<header id="agid-spid-panel-header">',
                    '<nav class="agid-spid-panel-back agid-spid-panel-element" aria-controls="agid-spid-panel-select">',
                        '<button tabindex="0" id="agid-spid-panel-close-button" class="agid-spid-button agid-navigable" aria-labelledby="agid-cancel-access-button">',
                            this.tpl.svgWithPngFallback.call(this, 'img/x-icon', this.getI18n('naviga_indietro')),
                        '</button>',
                    '</nav>',
                    '<div class="agid-spid-panel-logo agid-spid-panel-element">',
                        this.tpl.svgWithPngFallback.call(this, 'img/spid-logo-c-lb', this.getI18n('alt_logo_SPID')),
                    '</div>',
                '</header>',
                '<div id="agid-spid-panel-content">',
                    '<div class="agid-spid-panel-content-center">',
                        '<div id ="agid-spid-enter-title-container">',
                            '<h1 id="agid-spid-enter-title-page" class="agid-font">', this.getI18n('scegli_provider_SPID'), '</h1>',
                        '</div>',
                        '<div id="agid-spid-idp-list" class="agid-spid-row">',
                            spidProvidersButtons,
                        '</div>',
                        '<div id="agid-cancel-access-container">',
                            '<button id="agid-cancel-access-button" class="agid-transparent-button agid-font agid-navigable">',
                                '<span>', this.getI18n('annulla_accesso'), '</span>',
                            '</button>',
                        '</div>',
                        '<div id="agid-logo-container" aria-hidden="true">',
                            this.tpl.svgWithPngFallback.call(this, 'img/agid-logo-bb-short'),
                        '</div>',
                    '</div>',
                '</div>',
                '<footer id="agid-spid-panel-footer">',
                    '<div id="agid-action-button-container">',
                        '<button id="nospid" class="agid-action-button agid-font agid-navigable">',
                            '<span>', this.getI18n('non_hai_SPID'), '</span>',
                        '</button>',
                        '<button id="cosaspid" class="agid-action-button agid-font agid-navigable">',
                            '<span>', this.getI18n('cosa_SPID'), '</span>',
                        '</button>',
                    '</div>',
                '</footer>',
            '</section>'
        ].join('');
    },

    hiddenField: function (name, value) {
        return ['<input type="hidden" name="', name, '" value="', value, '" />'].join('');
    },

    spidProviderButton: function (providerData) {
        var providerHiddenName    = 'provider',
            providerPayloadInputs = '',
            property,
            providerTitle         = (providerData.isActive) ?
                                    this.getI18n('accedi_con_idp', providerData.title) :
                                    this.getI18n('idp_disabled');
        // Crea gli input field chiave=valore dall'oggetto
        if (providerData.payload) {
            // Imposta il name dell'identity provider o fallback su un default
            providerHiddenName = providerData.payload.providerHiddenName || providerHiddenName;
            delete providerData.payload.providerHiddenName;

            providerPayloadInputs += this.tpl.hiddenField(providerHiddenName, providerData.provider);

            for (property in providerData.payload) {
                providerPayloadInputs += this.tpl.hiddenField(property, providerData.payload[property]);
            }
        }

        return [
            '<span class="agid-spid-col l3 m6 s6 xs12">',
                '<form id="agid-spid-provider-', providerData.provider, '"',
                    'action="', this.formActionUrl, '" method="', this.formSubmitMethod, '">',
                    '<button type="submit"',
                        'class="agid-spid-idp-button agid-spid-idp-', providerData.provider, '"',
                        'title="', providerTitle, '"',
                        'style="background-image: url(', this.config.assetsBaseUrl, 'img/idp-logos/', providerData.logo, ')"',
                        (providerData.isActive) ? '' : 'disabled', '>',
                    '</button>',
                    providerPayloadInputs,
                '</form>',
            '</span>'
        ].join('');
    },

    spidButton: function (sizeClass) {
        return [
            '<!-- AGID - SPID BUTTON ', sizeClass.toUpperCase(), ' * begin * -->',
            '<button class="agid-spid-enter agid-font agid-spid-enter-size-', sizeClass, '" hidden>',
                '<span aria-hidden="true" class="agid-spid-enter-icon">',
                    this.tpl.svgWithPngFallback.call(this, 'img/spid-ico-circle-bb', this.getI18n('entra_con_SPID')),
                '</span>',
                '<span class="agid-spid-enter-text">', this.getI18n('entra_con_SPID'), '</span>',
            '</button>',
            '<!-- AGID - SPID BUTTON ', sizeClass.toUpperCase(), ' * end * -->'
        ].join('');
    },

    infoModalContent: function (htmlContent) {
        return [
                '<div class="spid-modal-content agid-font">',
                    '<button id="closemodalbutton"',
                        'class="close agid-navigable"',
                        'tabindex="0"',
                        'aria-label="', this.getI18n('aria_chiudi_modale'), '">',
                        '<b aria-hidden="true">&times;</b>',
                    '</button>',
                    '<div id="agid-infomodal-content" role="main" tabindex="0" aria-labelledby="agid-infomodal-title">',
                        htmlContent,
                    '</div>',
                '</div>'
        ].join('');
    },

    // Fake content, Lipsum HTML, rimpiazzare con contenuti/etichette reali
    nonHaiSpid: function () {
        return [
            '<div class="Prose">',
				'<h2 class="u-text-h2 u-margin-bottom-xxs" id="agid-infomodal-title">Richiedi SPID</h2>',
                '<p>',
                    'Per richiedere e ottenere le tue credenziali SPID, il Sistema Pubblico di Identità Digitale, devi esser maggiorenne.',
                '</p>',
                '<h3 class="u-text-h3">Di cosa hai bisogno</h3>',
                '<ul>',
                    '<li>un indirizzo e-mail</li>',
                    '<li>il numero di telefono del cellulare che usi normalmente</li>',
                    '<li>un documento di identità valido (uno tra: carta di identità, passaporto, patente, permesso di soggiorno)*</li>',
                    '<li>la tua tessera sanitaria con il codice fiscale*</li>',
                '</ul>',
                '<p class="u-textSecondary"><small>',
                    '* Durante la registrazione può esser necessario fotografarli e allegarli al form che compilerai.',
                '</small></p>',
				'<p class="Prose">',
                    '<a role="button" class="Button Button--default Button--shadow Button--round u-text-r-xs" href="https://www.spid.gov.it/richiedi-spid" target="_blank">',
                       'Richiedi SPID',
                    '</a>',
				'</p>',
			'</div>'
        ].join('');
    },

    // Fake content, Lipsum HTML, rimpiazzare con contenuti/etichette reali
    cosaSpid: function () {
        return [
            '<div class="Prose">',
				'<h2 class="u-text-h2 u-margin-bottom-xs" id="agid-infomodal-title">SPID</h2>',
				'<p class="u-text-r-m u-lineHeight-l u-textSecondary">',
					"SPID, il Sistema Pubblico di Identità Digitale, è la soluzione che ti permette di accedere a tutti i servizi online della Pubblica Amministrazione con un'unica Identità Digitale (username e password) utilizzabile da computer, tablet e smartphone.",
				'</p>',
				'<p class="Prose">',
					'<a role="button" class="Button Button--default Button--shadow Button--round u-text-r-xs" href="https://www.spid.gov.it/richiedi-spid" target="_blank">',
	                   'Richiedi SPID',
					'</a>',
				'</p>',
			'</div>'
        ].join('');
    }
};
/* eslint-enable indent */
