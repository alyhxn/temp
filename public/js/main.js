

document.addEventListener('DOMContentLoaded', function() {

    // Ensure all checkboxes are unchecked when the page loads
    document.querySelectorAll('.highlight-checkbox').forEach(function(checkbox) {
        checkbox.checked = false;
    });

    // Open Accessibility Options
    document.getElementById('open-accessibility').addEventListener('click', function() {
        document.querySelector('.accessibility-action-container').classList.add('active');
    });

    // Close Accessibility Options
    document.getElementById('close-accessibility').addEventListener('click', function() {
        document.querySelector('.accessibility-action-container').classList.remove('active');
    });

    // Toggle active class on the clicked action button
    document.querySelectorAll('.action-btn').forEach(function(button) {
        button.addEventListener('click', function() {
            button.classList.toggle('active');
        });
    });

    // Toggle font size
    document.getElementById('toggle-text-size').addEventListener('click', function() {
        document.documentElement.classList.toggle('large-font');
    });

    // Toggle high contrast
    document.getElementById('toggle-contrast').addEventListener('click', function() {
        document.documentElement.classList.toggle('high-contrast');
    });

    // Toggle text spacing
    document.getElementById('toggle-text-spacing').addEventListener('click', function() {
        document.documentElement.classList.toggle('increased-spacing');
    });

    // Highlight rows and check corresponding checkboxes based on checkbox selection
    document.querySelectorAll('.highlight-checkbox').forEach(function(checkbox) {
        checkbox.addEventListener('change', function() {
            const population = checkbox.dataset.population;

            // Uncheck all checkboxes and remove highlight
            document.querySelectorAll('.highlight-checkbox').forEach(function(box) {
                if (box !== checkbox) {
                    box.checked = false;
                    box.closest('tr').classList.remove('highlight');
                }
            });

            // Check the selected checkbox and highlight the rows
            const allCheckboxes = document.querySelectorAll(`.highlight-checkbox[data-population="${population}"]`);
            allCheckboxes.forEach(function(box) {
                box.checked = checkbox.checked;
                if (checkbox.checked) {
                    box.closest('tr').classList.add('highlight');
                } else {
                    box.closest('tr').classList.remove('highlight');
                }
            });
        });
    });

    // Download the page as PDF
    function downloadPDF() {
        // const isHighContrast = document.documentElement.classList.contains('high-contrast');
        
        // Temporarily add the 'high-contrast-pdf' class to handle logo color inversion in the PDF
        // if (isHighContrast) {
        //     body.classList.add('high-contrast-pdf');
        // }
        window.print()
        // responsiveVoice.speak('Relatório da Versão Portuguesa do Michigan Hand Outcomes Questionnaire (MHQ)', 'Portuguese Female')
    }

    const btn = document.querySelector('#play-action')
    window.addEventListener('message', (event) => {
      if (event.data?.type !== 'TRINITY_TTS') return;
      if (event.data.value.action === 'injectorImp') {
        console.info('Trinity Audio player injector script is loaded!', window.TRINITY_PLAYER);
        btn.style.display = 'flex'
      }
    });
    let mode 
    const btn_icon = btn.querySelector('span')
    function read () {
      if(mode){
        btn_icon.classList.remove('fa-pause')
        btn_icon.classList.add('fa-play')
        mode = false
        window.TRINITY_PLAYER.api.play('0ed9e0d7ca60f17aebaf5dacd40b3f94');
        
      }
      else{
        btn_icon.classList.remove('fa-play')
        btn_icon.classList.add('fa-pause')
        mode = true
        window.TRINITY_PLAYER.api.pause('0ed9e0d7ca60f17aebaf5dacd40b3f94');
      }
    }
    // Attach the downloadPDF function to both buttons
    document.getElementById('download-summary').addEventListener('click', downloadPDF);
    document.getElementById('download-action').addEventListener('click', downloadPDF);
    btn.addEventListener('click', read);
});
