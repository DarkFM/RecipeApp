export default class Modal {
    constructor(config) {
        this.modalElement = config.DOMNode; // HtmlElement/Node
        this.parentElement = config.parentElement;
        this.options = config.options; // Array [{}]
        this.windowEventListenerAdded = false;
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


        // adding event listeners once
        if (!this.windowEventListenerAdded) {
            // add onclick to modal close button
            this._DOMAccess('#modal-close').onclick = this.closeModal();
            // allow for clicking background to close modal (only allows for left click)
            window.addEventListener('click', ev => {
                if (ev.target.id === 'modal-container' && ev.which === 1) {
                    this.closeModal()();
                }
            });
            this.windowEventListenerAdded = true;
        }
        return this;
    }

    showModal() {
        console.log(this.parentElement, 'parent element');
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