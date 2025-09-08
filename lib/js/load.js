var isRTL = false;  // Default to LTR
var currentPdf = ''; // Default PDF URL

// Function to set user type and select appropriate PDF
function setUserType(userType) {
    if (userType === 'corporate') {
        currentPdf = 'Handbook_RENDE.pdf';
    } else if (userType === 'sport') {
        currentPdf = 'Handbook_RENDE_002.pdf';
    }
    
    // Reload the flipbook with the new PDF
    loadFlipbook(currentPdf, isRTL);
}

// Function to load the flipbook
function loadFlipbook(pdfUrl, rtlMode) {
    var options = {
        height: "100%",
        duration: 700,
        backgroundColor: "#2F2D2F",
        direction: rtlMode ? 2 : 1, // Use 2 for RTL and 1 for LTR
        zoomChange: function (isZoomed) {
            $("body").css("overflow", isZoomed ? "hidden" : "auto");
        }
    };

    $("#flipbookContainer").empty();
    $("#flipbookContainer").flipBook(pdfUrl, options);
}

// Initial call to load the flipbook
$(document).ready(function () {
    loadFlipbook(currentPdf, isRTL);
});
