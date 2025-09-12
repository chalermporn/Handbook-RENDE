var isRTL = false;  // Default to LTR
var currentPdf = ''; // Default PDF URL
var isLoading = false; // Flag to prevent duplicate loading
var loadedPdf = ''; // Track which PDF is currently loaded

// Function to set user type and select appropriate PDF
function setUserType(userType) {
    var newPdf = '';
    if (userType === 'PDF1') {
        newPdf = 'Handbook_RENDE.pdf';
    } else if (userType === 'PDF2') {
        newPdf = 'Handbook_RENDE_002.pdf';
    }
    
    // Only load if it's a different PDF and not currently loading
    if (newPdf && newPdf !== loadedPdf && !isLoading) {
        currentPdf = newPdf;
        loadFlipbook(currentPdf, isRTL);
    }
}

// Function to load the flipbook
function loadFlipbook(pdfUrl, rtlMode) {
    // Prevent duplicate loading
    if (isLoading || pdfUrl === loadedPdf) {
        return;
    }
    
    isLoading = true;
    
    var options = {
        height: "100%",
        duration: 700,
        backgroundColor: "#2F2D2F",
        direction: rtlMode ? 2 : 1, // Use 2 for RTL and 1 for LTR
        zoomChange: function (isZoomed) {
            $("body").css("overflow", isZoomed ? "hidden" : "auto");
        },
        onReady: function() {
            // Mark as loaded when ready
            loadedPdf = pdfUrl;
            isLoading = false;
        },
        onLoadError: function() {
            // Reset flags on error
            isLoading = false;
        }
    };

    $("#flipbookContainer").empty();
    $("#flipbookContainer").flipBook(pdfUrl, options);
}

// Initial call to load the flipbook
$(document).ready(function () {
    loadFlipbook(currentPdf, isRTL);
});
