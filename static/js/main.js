/**
 * @typedef {Number} Integer
 */

// To learn: js has some weird behavior when skipping args
//  and using keyword args.

document.addEventListener("DOMContentLoaded", function() {
    /////////////////
    //  Variables  //
    /////////////////
    
    const drawingAreaElement = document.getElementById("drawing-area"); 
    const fillAreaButton = document.getElementById("fill-area-button"); 
    const resetAreaButton = document.getElementById("reset-area-button"); 
    const sizeInputElement = document.getElementById("grid-size-input"); 
    
    const modalDialogElement = document.getElementById("warning-modal"); 
    const modalFormElement = document.getElementById("warning-modal__form");
    const modalHeadingElement = document.querySelector("#warning-modal__form .modal-heading");
    const modalDescriptionElement = document.querySelector("#warning-modal__form .modal-description");
    const modalSuccessButton = document.getElementById("modal-accept");
    const modalAbortButton = document.getElementById("modal-abort");
    
    //////////////////////
    // Helper Functions //
    //////////////////////
    
    /**
     * Interpolates variables into a string.
     * Taken from: https://www.geeksforgeeks.org/javascript-string-formatting/
     * Will replace even if the user wants to have a string with a {<digit>} literal,
     * ... where <digit> is equal to an item's index within the passed ...values.
     * @param {String} str - String to format variables into.
     * @param {...String} values - Values to format into string.
     */
    function format(str, ...values) {
        return str.replace(/{(\d+)}/g, function(match, index) {
            return typeof values[index] !== 'undefined' ? values[index] : match;
        });
    }
    
    /**
     * Return a boolean to denote whether tha passed object is
     * ... a function type or not.
     * Taken from: https://stackoverflow.com/a/55785839/12637568
     * @param {Any} value - Any object
     */
    function isFunction(value) {
        if (value) {
            return Object.prototype.toString.call(value) === "[object Function]"
                    || "function" === typeof value
                    || value instanceof Function;
            
        }
        else {
            return false;
        }
       
    }

    ////////////////////
    // Page Functions //
    ////////////////////
    
    /**
     * Invoked when a drawing area tile is moused over.
     * * @param {Event} event - Event provided by the event listener.
     */
    function tileHoverCallback(event) {        
        const tile = event.target;
        
        const newBrightnessValue = tile.dataset.brightness - 0.1;
        tile.style.filter = 'brightness(' + newBrightnessValue + ')';
        
        // Store brightness in a data attribute so that we don't need to parse
        // ... the style string for later reference.
        tile.dataset.brightness = newBrightnessValue;
    }
    
    /**
     * Populate the drawing area with tile divs.
     * * @param {Integer} area_size - Length and width of tile area
     */
    function fillDrawingArea(area_size) {
        drawingAreaElement.innerHTML = "";
        
        for (let i = 0; i < area_size * area_size; i++) {
            const newTileElement = document.createElement('div');
            
            newTileElement.addEventListener('mouseover', tileHoverCallback);
            
            drawingAreaElement.appendChild(newTileElement);
            
            const portionOfMainAxisLength = (1 / area_size) * 100;
            newTileElement.style.flexBasis = portionOfMainAxisLength + "%";
            
            newTileElement.classList.add('drawing-area__tile');
            newTileElement.dataset.brightness = 1;
        }
    }
    
    /**
     * Reset the brightness of all tile divs in the drawing area.
     */
    function resetDrawingArea() {
        for (const tile of drawingAreaElement.children) {
            tile.style.filter = 'brightness(1)';
            tile.dataset.brightness = 1;
        }
    }
    
    function getProp(object, property) {
        // https://eslint.org/docs/latest/rules/no-prototype-builtins
        if (Object.prototype.hasOwnProperty.call(object, property)) {
            return object[property];
        }
        else {
            return null;
        }
    }
    
    /**
     * Prompt the user to select an action with a modal.
     * 
     * modal_contents properties available:
     * - modalHeader (string): the modal's header text
     * - modalDescription (string): the modal's description text
     * - modalConfirmationText (string): the modal's confirm button text
     * - modalAbortText (string): the modal's abort button text
     * 
     * @param {Array} modal_contents - A map of settings to apply to the modal.
     * @param {Function} callback_confirm - A callback function to invoke when the user presses the dialog's confirmation button.
     * @param {Function} callback_abort - A callback function to invoke when the user presses the dialog's abort button. 
    */
    function promptModal(
        modal_contents = {},
        callback_confirm = null, callback_abort = null
    ) {
        const modalHeader = getProp(modal_contents, "modalHeader") || "header not set";
        const modalDescription = getProp(modal_contents, "modalDescription") || "description not set";
        const modalConfirmationText = getProp(modal_contents, "modalConfirmationText") || "Accept";
        const modalAbortText = getProp(modal_contents, "modalAbortText") || "Abort";
         
        modalHeadingElement.textContent = modalHeader;
        modalDescriptionElement.textContent = modalDescription;
        modalSuccessButton.textContent = modalConfirmationText;
        modalAbortButton.textContent = modalAbortText;
        
        modalDialogElement.showModal();
        
        modalFormElement.addEventListener('submit', function(event) {
            // Don't .close() the dialog:
            event.preventDefault()
            
            // Forms with method="dialog" don't send input data.
            // To circumvent this, we can pass the
            // ... submission button the user clicked to FormData().
            const formData = new FormData(modalFormElement, event.submitter)
            
            for (const key of formData.keys()) {
                if (key == 'confirm') {
                    // Fire a 'cancel' (preventable) event before a 'close' (after the fact) event.
                    modalDialogElement.requestClose();
                    
                    if (isFunction(callback_confirm)) {
                        callback_confirm();
                        return; // exit submission function
                    }
                }
                
                else if (key == 'abort') {
                    // Fire a 'cancel' (preventable) event before a 'close' (after the fact) event.
                    modalDialogElement.requestClose();
                    
                    if (isFunction(callback_abort)) {
                        callback_abort();
                        return; // exit submission function
                    }
                }
            }
        });
    }
    
    ////////////////////
    // Event handlers //
    ////////////////////
    
    // Modal dialog button clicked
    modalDialogElement.addEventListener('cancel', (event) => {
        // Prevent modal from closing (available to cancel event only)
        event.preventDefault();
        
        // Play closing animation
        modalDialogElement.setAttribute('closing', '');
        
        modalDialogElement.addEventListener('animationend', () => {
            modalDialogElement.removeAttribute('closing');
            modalDialogElement.close();
        }, { once: true });
    });
    
    // Fill button clicked
    fillAreaButton.addEventListener('click', function() {
        // User altered form control and passed invalid input
        if (sizeInputElement.value < 1)
            return;
        // Don't regenerate tiles if the desired size is already filled
        if (
            drawingAreaElement.childElementCount == sizeInputElement.value * sizeInputElement.value
            && !drawingAreaElement.children[0].classList.contains('drawing-area__welcome-text')
        )
            return;
        
        if (sizeInputElement.value > 50) {
            const modalDescription = format(
                "A grid size of {0}x{1} may cause performance issues.",
                sizeInputElement.value,
                sizeInputElement.value
            )
            
            promptModal(
                modal_contents = {
                    modalHeader: "Grid length high",
                    modalDescription: modalDescription,
                    modalConfirmationText: "Delete Grid",
                },
                callback_confirm = function() { fillDrawingArea(sizeInputElement.value); }
            );
        }
        else {
            fillDrawingArea(sizeInputElement.value);
        }
    });
    
    // Reset button clicked
    resetAreaButton.addEventListener('click', function() {
        // No grid has been generated yet- nothing to reset.
        if (drawingAreaElement.children[0].classList.contains('drawing-area__welcome-text'))
            return;
                
        promptModal(
            modal_contents = {
                modalHeader: "Drawing will be deleted",
                modalDescription: "Are you sure you want to reset your canvas?",
                modalConfirmationText: "Delete Grid",
            },
            callback_confirm = () => { resetDrawingArea(); }
        );
    });
});