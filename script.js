// Author: Kaden Gardiner Email: kaden_gardiner@student.uml.edu
$(document).ready(function() {
    let tabCounter = 0;

    // Initialize jQuery UI Tabs
    $("#tabs").tabs();

    // validationto check if min <= max for columns
    $.validator.addMethod("minLessThanMaxCol", function(value, element) {
        const minCol = parseInt($("#minCol").val());
        const maxCol = parseInt($("#maxCol").val());
        return this.optional(element) || minCol <= maxCol;
    }, "Minimum column value must be less than or equal to maximum column value.");

    // validation to check if min <= max for rows
    $.validator.addMethod("minLessThanMaxRow", function(value, element) {
        const minRow = parseInt($("#minRow").val());
        const maxRow = parseInt($("#maxRow").val());
        return this.optional(element) || minRow <= maxRow;
    }, "Minimum row value must be less than or equal to maximum row value.");

    // Initialize jQuery Validation on the form
    const validator = $("#valueForm").validate({
        rules: {
            minCol: {
                required: true,
                number: true,
                min: -50,
                max: 50,
                minLessThanMaxCol: true
            },
            maxCol: {
                required: true,
                number: true,
                min: -50,
                max: 50,
                minLessThanMaxCol: true
            },
            minRow: {
                required: true,
                number: true,
                min: -50,
                max: 50,
                minLessThanMaxRow: true
            },
            maxRow: {
                required: true,
                number: true,
                min: -50,
                max: 50,
                minLessThanMaxRow: true
            }
        },
        messages: {
            minCol: {
                required: "Please enter a minimum column value.",
                number: "Please enter a valid number for minimum column.",
                min: "Minimum column value must be at least -50.",
                max: "Minimum column value cannot exceed 50."
            },
            maxCol: {
                required: "Please enter a maximum column value.",
                number: "Please enter a valid number for maximum column.",
                min: "Maximum column value must be at least -50.",
                max: "Maximum column value cannot exceed 50."
            },
            minRow: {
                required: "Please enter a minimum row value.",
                number: "Please enter a valid number for minimum row.",
                min: "Minimum row value must be at least -50.",
                max: "Minimum row value cannot exceed 50."
            },
            maxRow: {
                required: "Please enter a maximum row value.",
                number: "Please enter a valid number for maximum row.",
                min: "Maximum row value must be at least -50.",
                max: "Maximum row value cannot exceed 50."
            }
        },
        errorElement: "span",
        errorPlacement: function(error, element) {
            error.addClass("error-message");
            error.insertAfter(element);
        },
        highlight: function(element) {
            $(element).addClass("input-error");
        },
        unhighlight: function(element) {
            $(element).removeClass("input-error");
        }
    });

    // Initialize sliders with two-way binding
    function initializeSlider(inputId) {
        const $input = $("#" + inputId);
        const $slider = $("#slider-" + inputId);

        $slider.slider({
            min: -50,
            max: 50,
            value: 0,
            slide: function(event, ui) {
                // Update input when slider changes
                $input.val(ui.value);
                $input.valid(); // Trigger validation
                updatePreviewTable(); // Update preview dynamically
            }
        });

        // Update slider when input changes
        $input.on('input change', function() {
            const value = parseInt($(this).val()) || 0;
            if (value >= -50 && value <= 50) {
                $slider.slider("value", value);
            }
            updatePreviewTable(); // Update preview dynamically
        });

        // Set initial value
        $input.val(0);
    }

    // Initialize all sliders
    initializeSlider("minCol");
    initializeSlider("maxCol");
    initializeSlider("minRow");
    initializeSlider("maxRow");

    let updateTimer;

    // Function to update preview table with debouncing
    function updatePreviewTable() {
        clearTimeout(updateTimer);
        updateTimer = setTimeout(function() {
            if ($("#valueForm").valid()) {
                const tableHTML = generateTableHTML();
                $("#previewContainer").html(tableHTML);
                // Automatically create a new tab
                generateAndAddTab();
            } else {
                $("#previewContainer").html("");
            }
        }, 300);
    }

    // Function to generate table HTML
    function generateTableHTML() {
        const minCol = parseInt($("#minCol").val());
        const maxCol = parseInt($("#maxCol").val());
        const minRow = parseInt($("#minRow").val());
        const maxRow = parseInt($("#maxRow").val());

        let table = "<table border='1'><tr><th>*</th>";

        for (let c = minCol; c <= maxCol; c++) {
            table += `<th>${c}</th>`;
        }
        table += "</tr>";

        for (let r = minRow; r <= maxRow; r++) {
            table += `<tr><th>${r}</th>`;
            for (let c = minCol; c <= maxCol; c++) {
                table += `<td>${r * c}</td>`;
            }
            table += "</tr>";
        }

        table += "</table>";
        return table;
    }

    // Function to generate table and add to new tab
    function generateAndAddTab() {
        const minCol = parseInt($("#minCol").val());
        const maxCol = parseInt($("#maxCol").val());
        const minRow = parseInt($("#minRow").val());
        const maxRow = parseInt($("#maxRow").val());

        // Create tab label
        const tabLabel = `[${minCol},${maxCol}] × [${minRow},${maxRow}]`;
        const tabId = "tab-" + (++tabCounter);

        // Generate table HTML
        const tableHTML = generateTableHTML();

        // Add new tab
        $("#tabs ul").append(
            `<li><a href="#${tabId}">${tabLabel}</a>
             <span class="ui-icon ui-icon-close tab-close">×</span>
             <input type="checkbox" class="tab-checkbox" data-tab="${tabId}"></li>`
        );
        $("#tabs").append(`<div id="${tabId}"><div class="table-container">${tableHTML}</div></div>`);

        // Refresh tabs widget
        $("#tabs").tabs("refresh");
    }

    // individual tab close button
    $("#tabs").on("click", ".tab-close", function() {
        const panelId = $(this).prev().attr("href");

        // Prevent closing the input form tab
        if (panelId === "#input-tab") {
            return;
        }

        // Remove tab and panel
        $(this).closest("li").remove();
        $(panelId).remove();
        $("#tabs").tabs("refresh");
    });

    // bulk tab deletion
    $("#deleteSelected").on("click", function() {
        $(".tab-checkbox:checked").each(function() {
            const tabId = "#" + $(this).data("tab");
            $(this).closest("li").remove();
            $(tabId).remove();
        });
        $("#tabs").tabs("refresh");
    });
});
