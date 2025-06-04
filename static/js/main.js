/**
 * @typedef {Number} Integer
 */


document.addEventListener("DOMContentLoaded", function() {
    const drawingAreaElement = document.getElementById("drawing-area"); 
    const fillAreaButton = document.getElementById("fill-area-button"); 
    const resetAreaButton = document.getElementById("reset-area-button"); 
    const sizeInputElement = document.getElementById("grid-size-input"); 
    
    const modalDialogElement = document.getElementById("warning-modal"); 
        const modalFormElement = document.querySelector(".form--modal");
            const modalHeadingElement = document.querySelector(".form--modal .modal-heading");
            const modalDescriptionElement = document.querySelector(".form--modal .modal-description");
            const modalSuccessButton = document.getElementById("modal-accept");
            const modalAbortButton = document.getElementById("modal-abort");
    
    // Warning 1 for promptWarningModal()
    const warningDestructiveAction = {
        heading: "Drawing will be deleted",
        description: "Are you sure you want to reset your canvas?",
        confirmation_text: 'Delete Grid',
        abort_text: 'Abort',
    }
    
    // Warning 2 for promptWarningModal()
    const warningGridSizeHigh = {
        heading: "Grid length high",
        description: `
            A grid size of
            {0}x{1}
            may cause performance issues.
        `,
        confirmation_text: 'Create Grid',
        abort_text: 'Abort',
    }
    
    /**
     * Interpolates variables into a string.
     * Taken from: https://www.geeksforgeeks.org/javascript-string-formatting/
     * Will replace even if the user wants to have a string with a {<digit>} literal,
     * where <digit> is equal to an item's index within the passed ...values.
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

    /**
     * Invoked when a drawing area tile is moused over.
     * * @param {Event} event - Event provided by the event listener.
     */
    function tileHoverCallback(event) {        
        const tile = event.target;
        
        const newBrightnessValue = tile.dataset.brightness - 0.1;
        tile.style.filter = 'brightness(' + newBrightnessValue + ')';
        
        // Store brightness in a data attribute so we don't need to parse
        //  the style string for later reference.
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
    
    /**
     * Open animation for the modal window.
     */
    // function openModal() {
    //     for (const animation of modalElement.getAnimations()) {
    //         if (
    //             animation.effect instanceof KeyframeEffect &&
    //             modalElement.contains(animation.effect.target)
    //         ) {
    //         animation.cancel();
    //         }
    //     }
  
    //     modalElement.classList.remove('modal-overlay--closed');
        
    //     modalElement.offsetWidth;
        
    //     modalElement.classList.add('modal-overlay--opened');
        
    //     modalElement.offsetWidth; // force reflow
    // }
    
    /**
     * Close animation for the modal window.
     */
    // function closeModal() {
    //     for (const animation of modalElement.getAnimations()) {
    //         if (
    //             animation.effect instanceof KeyframeEffect &&
    //             modalElement.contains(animation.effect.target)
    //         ) {
    //         animation.cancel();
    //         animation.play();
    //         }
    //     }
        
    //     modalElement.classList.remove('modal-overlay--opened');
        
    //     void modalElement.offsetWidth;
        
    //     modalElement.classList.add('modal-overlay--closed');
        
    //     for (const animation of modalElement.getAnimations()) {
    //         if (
    //             animation.effect instanceof KeyframeEffect &&
    //             modalElement.contains(animation.effect.target)
    //         ) {
    //         animation.cancel();
    //         animation.play();
    //         }
    //     }
        
    //     modalElement.offsetWidth; // force reflow
    // }
    
    /**
     * Prompt the user to confirm their action.
     *  1- User's chosen grid size may cause performance issues.
     *  2- User must confirm that they want to perform a destructive canvas action (requires description_vars).
     * @param {Integer} warning_type - Type of warning to display
     * @param {Array} modal_contents - A warning_type dependent array of strings to format into the warning's description placeholder values.
     * @param {Function} callback_confirm - A callback function to invoke when the user presses the dialog's confirmation button.
     * @param {Function} callback_abort - A callback function to invoke when the user presses the dialog's abort button. 
    */
    function promptWarningModal(
        warning_type, modal_contents = null,
        callback_confirm = null, callback_abort = null
    ) {
        switch (warning_type) {
            case 1:
                modalHeadingElement.textContent = "Warning: " + warningDestructiveAction.heading;
                modalDescriptionElement.textContent = warningDestructiveAction.description;
                modalSuccessButton.textContent = warningDestructiveAction.confirmation_text;
                modalAbortButton.textContent = warningDestructiveAction.abort_text;
                
                break;
            case 2:
                modalHeadingElement.textContent = "Warning: " + warningGridSizeHigh.heading;
                
                if (modal_contents == null)
                    throw new Error("Parameter modal_contents required for warning_type 1.");
                if (modal_contents.length != 2)
                    throw new Error("Parameter modal_contents must contain exactly two items.");

                modalDescriptionElement.textContent = format(
                    warningGridSizeHigh.description,
                    modal_contents[0],
                    modal_contents[1]
                );
                
                modalSuccessButton.textContent = warningGridSizeHigh.confirmation_text;
                modalAbortButton.textContent = warningGridSizeHigh.abort_text;
                
                break;
            default:
                throw new Error(`Invalid warning type: ${warning_type}`);   
        }
        
        modalDialogElement.showModal();
        
        modalAbortButton.addEventListener('click', function(event) {
            // Prevent .close() from running
            // Play closing animation (requires JS given that it's just before .close())
            modalDialogElement.setAttribute('closing', '');
            modalDialogElement.addEventListener('animationend', () => {
                modalDialogElement.removeAttribute('closing');
                modalDialogElement.close();
            }, { once: true });
        });
        
        modalFormElement.addEventListener('submit', function(event) {
            // Don't submit form if method is GET or POST
            event.preventDefault()
            
            // Forms with method="dialog" don't send input data.
            // To circumvent this, we can pass the
            // ... submission button the user clicked to FormData().
            const formData = new FormData(modalFormElement, event.submitter);
            console.log(formData);
            
            for (const key of formData.keys()) {
                if (key == 'confirm') {
                    if (isFunction(callback_confirm)) {
                        callback_confirm();
                        return; // exit submission function
                    }
                }
                
                else if (key == 'abort') {
                    if (isFunction(callback_abort)) {
                        callback_abort();
                        return; // exit submission function
                    }
                }
            }
        });
    }
    
    // Event handlers
    
    fillAreaButton.addEventListener('click', function() {
        // User passed invalid input
        if (sizeInputElement.value < 1) return;
        // Don't remove and refill tiles if the desired size is already filled
        if (drawingAreaElement.childElementCount == sizeInputElement.value * sizeInputElement.value)
            return;
        
        if (sizeInputElement.value > 50) {
            promptWarningModal(
                warning_type = 2,
                modal_contents = [sizeInputElement.value, sizeInputElement.value],
                callback_confirm = function() { fillDrawingArea(sizeInputElement.value); }
            );
        }
        else {
            fillDrawingArea(sizeInputElement.value);
        }
    });
    
    // to learn: js has some weird behavior when skipping args
    //  and using keyword args.
    resetAreaButton.addEventListener('click', function() {
        if (drawingAreaElement.childElementCount == 0) return;
        

        promptWarningModal(
            warning_type = 1,
            modal_contents = null,
            callback_confirm = function() { resetDrawingArea(); }
        );
    });
    
    // Remove for production: //
    // Debug buttons
    document.getElementById('debug-close').addEventListener('click', function() {
       modalDialogElement.close();
    });
    
    document.getElementById('debug-open').addEventListener('click', function() {
        promptWarningModal(
            warning_type = 1,
            modal_contents = null,
            callback_confirm = function() { resetDrawingArea(); },
            callback_abort = null
        );
    });
});