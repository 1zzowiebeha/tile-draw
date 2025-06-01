/**
 * @typedef {Number} Integer
 */

document.addEventListener("DOMContentLoaded", function() {
    const drawingAreaElement = document.getElementById("drawing-area"); 
    const createGridButton = document.getElementById("create-grid-button"); 
    const resetGridButton = document.getElementById("reset-grid-button"); 
    const sizeInputElement = document.getElementById("grid-size-input"); 
    
    const modalElement = document.getElementById("modal-overlay"); 
    const popupElement = document.querySelector(".form--modal");
    const popupHeadingElement = document.querySelector(".form--modal .modal-heading");
    const popupDescriptionElement = document.querySelector(".form--modal .modal-description");
    const popupSuccessButton = document.getElementById("modal-accept");
    const popupAbortButton = document.getElementById("modal-abort");
    
    // 1
    const warningDesctructiveAction = {
        heading: "Drawing will be deleted",
        description: "Are you sure you want to reset your canvas?"
    }
    
    // 2
    const warningGridSizeHigh = {
        heading: "Grid length high",
        description: `
            A grid size of
            {0}x{1}</span>
            may cause performance issues.
        `
    }
    
    /**
     * Populate the grid with cells.
     * * @param {Integer} grid_size - Length and width of grid area
     */
    function createGrid(grid_size) {
        return;
    }
    
    /**
     * Remove all cells from the grid.
     */
    function destroyGrid() {
        return;
    }
    
    /**
     * Open animation for the modal window.
     */
    function openModal() {
        modalElement.classList.remove('modal-overlay--closed');
        modalElement.classList.add('modal-overlay--opened');
        
        elem.classList = "";
        elem.offsetWidth; // force reflow
    }
    
    /**
     * Close animation for the modal window.
     */
    function closeModal() {
        modalElement.classList.remove('modal-overlay--opened');
        modalElement.classList.add('modal-overlay--closed');
        
        elem.classList = "";
        elem.offsetWidth; // force reflow
    }
    
    /**
     * Prompt the user to confirm their action.
     *  1- User's chosen grid size may cause performance issues.
     *  2- User must confirm that they want to perform a destructive canvas action (requires description_vars).
     * @param {Integer} warning_type - Type of warning to display
     * @param {Array} description_vars - A warning_type dependent array of strings to interpolate into the popup description.
     * @returns {Boolean} - User's dialog choice of abort (false) or success (true)
     */
    function display_warning(warning_type, description_vars = null) {
        switch (warning_type) {
            case 1:
                popupHeadingElement.textContent = "Warning: " + warningGridSizeHigh.heading;
                popupDescriptionElement.textContent = warningGridSizeHigh.description;
                break;
            case 1:
                popupHeadingElement.textContent = "Warning: " + warningDesctructiveAction.heading;
                
                if (description_vars == null)
                    throw new Error("Parameter description_vars required for warning_type 1.")
                if (description_vars.length != 2)
                    throw new Error("Parameter description_vars must contain exactly two items.")
                
                popupDescriptionElement.textContent = format(
                    warningDesctructiveAction.description,
                    description_vars[0],
                    description_vars[1]
                );
                break;
            default:
                throw new Error(`Invalid warning type: ${warning_type}`);   
        }
        
        let success = false;
        
        // Success choice
        popupSuccessElement.addEventListener('click', function() {
            success = true;
            
            closeModal();
        });
        
        // Abort mission
        popupAbortElement.addEventListener('click', function() {
            success = false;
            
            closeModal();
        })
        
        return success;
    }
    
    // Create grid
    createGridButton.addEventListener('click', function() {
        // User passed invalid input
        if (sizeInputElement.value < 1) return;
        
        if (sizeInputElement.value > 1000) {
            let userAllowsGridCreation = display_warning(
                1,
                [sizeInputElement.value, sizeInputElement.value]
            );
            
            if (userAllowsGridCreation) {
                createGrid(sizeInputElement.value);
            }
        }
        else {
            createGrid(sizeInputElement.value);
        }
    });
    
    // Reset grid
    resetGridButton.addEventListener('click', function() {
        let userAllowsGridDestruction = display_warning(2);
        
        if (userAllowsGridDestruction) {
            destroyGrid();
        }
    });
    
    
    document.getElementById('debug-close').addEventListener('click', function() {
       closeModal(); 
    });
    document.getElementById('debug-open').addEventListener('click', function() {
       openModal(); 
    });
});