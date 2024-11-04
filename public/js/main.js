class SpeechHandler {
    constructor() {
      this.synth = window.speechSynthesis;
      this.isFirefox = navigator.userAgent.toLowerCase().includes('firefox');
      this.mode = 0; // 0: stopped, 1: playing, 2: paused
      this.playButton = document.querySelector('#play-action > span');
      this.sentences = [];
      this.currentIndex = 0;
      this.currentUtterance = null;
      
      // Bind methods
      this.cleanup = this.cleanup.bind(this);
      this.readNext = this.readNext.bind(this);
      
      // Handle page visibility
      document.addEventListener('visibilitychange', this.cleanup);
    }
  
    cleanup() {
      this.synth.cancel();
      this.currentIndex = 0;
      this.mode = 0;
      this.updatePlayButton('play');
      if (this.currentUtterance) {
        this.currentUtterance.onend = null;
      }
      this.currentUtterance = null;
    }
  
    updatePlayButton(state) {
      if (state === 'play') {
        this.playButton.classList.remove('fa-pause');
        this.playButton.classList.add('fa-play');
      } else {
        this.playButton.classList.remove('fa-play');
        this.playButton.classList.add('fa-pause');
      }
    }
  
    extractText() {
      let text = '';
      const divs = document.querySelectorAll("div.header, div.description");
      divs.forEach(div => text += '\n' + div.innerText);
      
      return text
        .split('\n')
        .filter(line => line.trim())
        .flatMap(line => {
          const lineSentences = line.match(/[^.!?]+[.!?]+/g);
          return lineSentences || [line];
        });
    }
  
    readNext() {
      if (this.currentIndex < this.sentences.length && this.mode === 1) {
        this.currentUtterance = new SpeechSynthesisUtterance(this.sentences[this.currentIndex]);
        this.currentUtterance.onend = this.readNext;
        this.currentUtterance.lang = "pt-PT";
        this.currentUtterance.rate = 1;
        
        // Firefox-specific handling
        if (this.isFirefox) {
          this.currentUtterance.onend = () => {
            setTimeout(this.readNext, 50); // Add small delay for Firefox
          };
        } else {
          this.currentUtterance.onend = this.readNext;
        }
        
        this.synth.speak(this.currentUtterance);
        this.currentIndex++;
      } else if (this.currentIndex >= this.sentences.length) {
        this.cleanup();
      }
    }
  
    toggleSpeech() {
      if (this.mode === 0) {
        // Start reading
        this.sentences = this.extractText();
        this.currentIndex = 0;
        this.mode = 1;
        this.updatePlayButton('pause');
        this.readNext();
      }
      else if (this.mode === 1) {
        // Pause reading
        if (this.isFirefox) {
          this.synth.cancel(); // For Firefox, we need to cancel
        } else {
          this.synth.pause();
        }
        this.mode = 2;
        this.updatePlayButton('play');
      }
      else if (this.mode === 2) {
        // Resume reading
        this.mode = 1;
        this.updatePlayButton('pause');
        if (this.isFirefox) {
          this.readNext(); // For Firefox, restart from current sentence
        } else {
          this.synth.resume();
        }
      }
    }
  
    cancel() {
      this.cleanup();
    }
  
    destroy() {
      document.removeEventListener('visibilitychange', this.cleanup);
      this.cleanup();
    }
  }
  

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

    const speechHandler = new SpeechHandler();
    function read () {
        speechHandler.toggleSpeech();
    }

    // Attach the downloadPDF function to both buttons
    document.getElementById('download-summary').addEventListener('click', downloadPDF);
    document.getElementById('download-action').addEventListener('click', downloadPDF);
    document.getElementById('play-action').addEventListener('click', read);
    // Clean up when page unloads
    window.addEventListener('unload', () => {
        speechHandler.destroy();
    });
});
