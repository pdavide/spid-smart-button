/*
 * Modulo SPID smart button
 */
window.AgidSpidEnter = function () {
    var self = this,
        hasSpidProviders = false,
        agidSpidEnterWrapper,
        spidIdpList,
        infoModal,
        infoModalContent,
        spidPanelSelect;

    function getTpl(templateName, content) {
        return self.tpl[templateName].call(self, content);
    }

    function showElement(dom) {
        dom.removeAttribute('hidden');
    }

    function hideElement(dom) {
        var hiddenAttribute = document.createAttribute("hidden");
        dom.setAttributeNode(hiddenAttribute);
    }

    function closeInfoModal() {
        hideElement(infoModal);
        infoModalContent.innerHTML = '';
        // a11y: Restituisci il focus al modale dei providers
        spidPanelSelect.focus();
    }

    function openInfoModal(htmlContent) {
        infoModalContent.innerHTML = htmlContent;
        showElement(infoModal);
        // a11y: porta il focus sulla finestra informativa
        infoModal.focus();
        // Viene distrutto e ricreato, non necessita unbind
        document.querySelector('#closemodalbutton').addEventListener('click', closeInfoModal);
    };

    // Randomizza l'ordine dei tasti dei provider prima di mostrarli
    function shuffleIdp() {
        // eslint-disable-next-line vars-on-top
        for (var i = spidIdpList.children.length; i >= 0; i--) {
            spidIdpList.appendChild(spidIdpList.children[Math.random() * i | 0]);
        }
    }

    // Chiudi gli overlay in sequenza, prima info modal poi i providers
    function handleEscKeyEvent(event) {
        var isEscKeyHit             = event.keyCode === 27,
            isInfoModalVisible      = !infoModal.hasAttribute('hidden');

        if (isEscKeyHit) {
            if (isInfoModalVisible) {
                closeInfoModal();
            } else {
                // eslint-disable-next-line no-use-before-define
                hideProvidersPanel();
            }
        }
    }

    function showProvidersPanel() {
        shuffleIdp();
        showElement(agidSpidEnterWrapper);
        document.addEventListener('keyup', handleEscKeyEvent);
        // a11y: porta il focus sul pannello appena mostrato
        function focusSpidPanel() {
            spidPanelSelect.focus();
            spidPanelSelect.removeEventListener('animationend', focusSpidPanel);
        }
        spidPanelSelect.addEventListener('animationend', focusSpidPanel);
    }

    function hideProvidersPanel() {
        hideElement(agidSpidEnterWrapper);
        document.removeEventListener('keyup', handleEscKeyEvent);
    }

    function renderAvailableProviders(data) {
        var agid_spid_enter = document.querySelector('#agid-spid-enter'),
            spidProvidersButtonsHTML = '',
            provider,
            providerData;

        for (provider in data.spidProviders) {
            providerData = data.spidProviders[provider];

            if (!providerData.url) {
                return;
            }

            spidProvidersButtonsHTML += getTpl('spidProviderButton', providerData);
        };

        agid_spid_enter.innerHTML = getTpl('spidProviderChoiceModal', spidProvidersButtonsHTML);

        hasSpidProviders = true;
        // Vengono creati una sola volta all'init, non necessitano unbind
        document.querySelector('#agid-spid-panel-close-button').addEventListener('click', hideProvidersPanel);
        document.querySelector('#agid-spid-cancel-access-button').addEventListener('click', hideProvidersPanel);
        document.querySelector('#nospid').addEventListener('click', function () {
            openInfoModal(getTpl('nonHaiSpid'));
        });
        document.querySelector('#cosaspid').addEventListener('click', function () {
            openInfoModal(getTpl('cosaSpid'));
        });
    }

    function renderSpidButtons() {
        var spidButtonsPlaceholdersObj   = document.querySelectorAll('.agid-spid-enter-button'),
            spidButtonsPlaceholdersArray = Array.from(spidButtonsPlaceholdersObj),
            hasButtonsOnPage             = spidButtonsPlaceholdersArray.length;

        if (!hasSpidProviders) {
            console.error('Si è verificato un errore nel caricamento dei providers, impossibile renderizzare i pulsanti SPID');
            return;
        };

        if (!hasButtonsOnPage) {
            console.warn('Nessun placeholder HTML trovato nella pagina per i pulsanti SPID');
            return;
        };

        spidButtonsPlaceholdersArray.forEach(function (spidButton) {
            var foundDataSize   = spidButton.getAttribute('data-size'),
                dataSize        = foundDataSize.toLowerCase(),
                supportedSizes  = ['s', 'm', 'l', 'xl'],
                isSupportedSize = supportedSizes.indexOf(dataSize) !== -1;

            if (isSupportedSize) {
                spidButton.innerHTML = getTpl('spidButton', dataSize);
            } else {
                console.error('Le dimenioni supportate sono', supportedSizes, 'trovato invece:', foundDataSize, spidButton);
            }
        });
        // Binda gli eventi dopo aver renderizzato i pulsanti SPID
        Array.from(document.querySelectorAll('.agid-spid-enter')).forEach(function (spidButton) {
            spidButton.addEventListener('click', showProvidersPanel);
        });
    }

    /*
     * Helper function per gestire tramite promise il risultato asincrono di success/fail, come $.ajax
     */
    function ajaxRequest(method, url, payload) {
        return new Promise(function (resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.open(method, url);
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200 && xhr.responseText) {
                        resolve(JSON.parse(xhr.responseText));
                    } else {
                        reject(xhr.responseText);
                    }
                }
            }.bind(this);
            xhr.send(JSON.stringify(payload));
        });
    }

    function getLocalisedMessages() {
        var languageRequest = {
            language: self.language
        };

        return ajaxRequest('POST', self.config.localisationEndpoint, languageRequest);
    }

    function getAvailableProviders() {
        return ajaxRequest('POST', self.config.providersEndpoint);
    }

    function loadStylesheet(url) {
        var linkElement  = document.createElement('link');

        linkElement.rel  = 'stylesheet';
        linkElement.type = 'text/css';
        linkElement.href = url;
        document.head.appendChild(linkElement);
    }

    function addContainersWrapper(wrapperID) {
        agidSpidEnterWrapper = document.createElement('section');

        agidSpidEnterWrapper.id  = wrapperID;
        hideElement(agidSpidEnterWrapper);
        document.body.insertBefore(agidSpidEnterWrapper, document.body.firstChild);
        agidSpidEnterWrapper.innerHTML = getTpl('spidMainContainers');
    }

    function getSelectors() {
        spidIdpList      = document.querySelector('#agid-spid-idp-list');
        infoModal        = document.querySelector('#agid-infomodal');
        infoModalContent = document.querySelector('#agid-infomodal-content');
        spidPanelSelect  = document.querySelector('#agid-spid-panel-select');
    }

    function renderSpidModalContainers() {
        var agidSpidEnterWrapperId = 'agid-spid-enter-container',
            existentWrapper        = document.getElementById(agidSpidEnterWrapperId),
            agidSpidEnterWrapper;

        if (!existentWrapper) {
            loadStylesheet(self.config.stylesheetUrl);
            addContainersWrapper(agidSpidEnterWrapperId);
        }
    }

    function setOptions(options) {
        if (options.language) {
            self.language = options.language;
        }
    }

    function init(options) {
        var fetchData;

        if (options) {
            setOptions(options);
        }

        fetchData = [getLocalisedMessages(), getAvailableProviders()];

        return Promise.all(fetchData)
            .then(function (data) {
                self.i18n = data[0];
                renderSpidModalContainers();
                renderAvailableProviders(data[1]);
                renderSpidButtons();
                getSelectors();
                // Evita salti nella pagina sottostante causati dal cambio hash nella url
                Array.from(document.querySelectorAll('.agid-navigable')).forEach(function (link) {
                    link.addEventListener('click', function (event) {
                        event.preventDefault();
                    });
                });
            })
            .catch(function (error) {
                console.error('Si è verificato un errore nel caricamento dei dati', error);
            });
    };

    /*
     * Metodi Pubblici
     */
    return {
        init: init,
        updateSpidButtons: renderSpidButtons
    };
};
