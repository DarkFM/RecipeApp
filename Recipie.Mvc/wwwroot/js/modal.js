let windowEventListenerAdded = false;

export default class Modal {
    constructor(config) {
        this.modalElement = config.DOMNode; // HtmlElement/Node
        this.parentElement = config.parentElement;
        this.options = config.options; // Array [{}]
    }

    _DOMAccess(cssSelector) {
        return this.modalElement.querySelector(cssSelector);
    }

    /* 
     eg of options
     [
        { selector: '.test', nodeProperty: 'src', value: 'jsjs'},
        { selector: '.test', nodeProperty: 'src', value: 'jsjs'},
     ]
     */

    populateNode() {
        this.options.forEach(option => {
            const { selector: cssSelector, nodeProperty, value } = option;
            this._DOMAccess(cssSelector)[nodeProperty] = value;
        });

        this._DOMAccess('#modal-close').onclick = this.closeModal();
        // adding event listeners once
        if (!windowEventListenerAdded) {
            // add onclick to modal close button
            // allow for clicking background to close modal (only allows for left click)
            window.addEventListener('click', ev => {
                if (ev.target.id === 'modal-container' && ev.which === 1) {
                    this.closeModal()();
                }
            });
            windowEventListenerAdded = true;
        }
        return this;
    }

    showModal() {
        this.parentElement.innerHTML = '';
        this.parentElement.appendChild(this.modalElement);
        this.parentElement.classList.add('modal-active');
        document.querySelector('body').classList.add('modal-open');
    }

    closeModal() {
        return () => {
            this.modalElement.remove();
            this.parentElement.classList.remove('modal-active');
            document.querySelector('body').classList.remove('modal-open');
        };

    }
}