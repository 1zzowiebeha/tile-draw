document.addEventListener("DOMContentLoaded", function() {
    const gridAreaElement = document.getElementById("grid-cells"); 
    const createButtonElement = document.getElementById("create-grid-button"); 
    const resetButtonElement = document.getElementById("reset-grid-button"); 
    const sizeInputElement = document.getElementById("grid-size-input"); 
    
    const modalElement = document.getElementById("modal-overlay"); 
    const popupElement = document.querySelector(".form--modal");
    const popupHeadingElement = document.querySelector(".form--modal .modal-heading");
    const popupDescriptionElement = document.querySelector(".form--modal .modal-description");
    const popupSuccessElement = document.getElementById("modal-accept");
    const popupAbortElement = document.getElementById("modal-abort");
    
    const warningGridSizeHigh = {
        heading: "Grid length high",
        description: `
            A grid size of
            {1}x{1}</span>
            may cause performance issues.
        `
    }
    
    const warningDesctructiveAction = {
        heading: "Drawing will be deleted",
        description: "Are you sure you want to reset your canvas?"
    }
    
    /* todo: callbacks for modal popups... ooof */
    
    /**
     * Prompt the user to confirm their action
     * @param {number} warning_type - Type of warning to display
     */
    function warn(warning_type) {
        /*
        1- User's chosen grid size may cause performance issues.
        2- User must confirm that they want to perform a destructive canvas action.
        */
        switch (warning_type) {
            case 1:
                popupHeadingElement.textContent = warningGridSizeHigh.heading;
                popupDescriptionElement.textContent = warningGridSizeHigh.description;
                break;
            case 1:
                popupHeadingElement.textContent = warningDesctructiveAction.heading;
                popupDescriptionElement.textContent = warningDesctructiveAction.description;
                break;
            default:
                throw new Error(`Invalid warning type: ${warning_type}`);   
        }
        
        let success = false;
        
        popupSuccessElement.addEventListener('click', function() {
            success = true;
            
            // close the modal window
        });
        popupSuccessElement.addEventListener('click', function() {
            success = false;
            
            // close the modal window
        })
        
        return success;
    }
    
    createButton.addEventListener('click', function() {
        // User passed invalid input
        if (sizeInputElement.value < 1) {
            return;
        }
        
        if (sizeInputElement.value > 1000) {
            let createBigGrid = warn(1);
            
            if (createBigGrid) {
                // proceed with creation
            }
        }
        else {
            // proceed with creation
        }
    });
    resetButton.addEventListener('click', function() {
        let destructionConfirmed = warn(2);
        
        if (destructionConfirmed) {
            // proceed with destruction
        }
    });
});