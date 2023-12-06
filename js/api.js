



















var utterance = new SpeechSynthesisUtterance();
utterance.lang = 'en-UK';
utterance.rate = 1;

var storedLocation = 0; // Variable to store the location
var isPlaying = false; // Variable to track the playing state
var isPaused = false; // Variable to track the paused state

// Add a mouseup event listener to the textarea
document.getElementById('textarea').addEventListener('mouseup', function (event) {
  storedLocation = event.target.selectionEnd; // Store the location when the mouse is released
});

var playButton = document.getElementById('playButton');
var pauseResumeButton = document.getElementById('pauseResumeButton');
var stopButton = document.getElementById('stopButton');
var voiceSelector = document.getElementById('voiceSelector');

var voices = [];

// Update the voices when they change
speechSynthesis.onvoiceschanged = function () {
  voices = speechSynthesis.getVoices();
  updateVoices();
};

// Initial voices update
updateVoices();

function updateVoices() {
  voiceSelector.innerHTML = '';
  voices.forEach(function (voice) {
    var option = document.createElement('option');
    option.value = voice.name;
    option.textContent = voice.name;
    voiceSelector.appendChild(option);
  });
}

playButton.addEventListener('click', function () {
  var text = document.getElementById('textarea').value;
  var selectedVoice = voiceSelector.options[voiceSelector.selectedIndex].value;

  utterance = new SpeechSynthesisUtterance();
  utterance.onboundary = onboundaryHandler;
  utterance.text = text.substring(storedLocation);

  var selectedVoiceObj = voices.find(voice => voice.name === selectedVoice);

  if (selectedVoiceObj) {
    utterance.voice = selectedVoiceObj;
    speechSynthesis.speak(utterance);
    isPlaying = true;
    isPaused = false;
    updateButtonState();
  } else {
    console.error('Selected voice not found.');
  }
});

pauseResumeButton.addEventListener('click', function () {
  if (isPlaying) {
    if (isPaused) {
      speechSynthesis.resume();
      isPaused = false;
    } else {
      speechSynthesis.pause();
      isPaused = true;
    }
    updateButtonState();
  }
});

stopButton.addEventListener('click', function () {
  if (speechSynthesis) {
    speechSynthesis.cancel();
    isPlaying = false;
    isPaused = false;
    updateButtonState();
  }
});

function updateButtonState() {
  playButton.disabled = isPlaying;
  pauseResumeButton.innerHTML = isPaused ? '<i class="fas fa-play"></i>' : '<i class="fas fa-pause"></i>';
}

function onboundaryHandler(event) {
  var textarea = document.getElementById('textarea');
  var value = textarea.value;
  var index = event.charIndex;

  // Find the word boundaries from the stored location
  var start = findWordStart(value, index, storedLocation);
  var end = findWordEnd(value, index, storedLocation);

  var anchorPosition = start;
  var activePosition = end;

  textarea.focus();
  // Added lines to scroll
  const fullText = textarea.value;
  textarea.value = fullText.substring(0, activePosition);
  textarea.scrollTop = textarea.scrollHeight;
  textarea.value = fullText;
  // End added lines to scroll
  if (textarea.setSelectionRange) {
    textarea.setSelectionRange(anchorPosition, activePosition);
  } else {
    var range = textarea.createTextRange();
    range.collapse(true);
    range.moveEnd('character', activePosition);
    range.moveStart('character', anchorPosition);
    range.select();
  }
}

// Find the position of the beginning of the word from the stored location
function findWordStart(str, pos, storedLocation) {
  pos += storedLocation;

  // Search for the word's beginning
  var start = str.slice(0, pos + 1).search(/\S+$/);
  return start;
}

// Find the position of the end of the word from the stored location
function findWordEnd(str, pos, storedLocation) {
  pos += storedLocation;

  // Search for the word's end
  var left = str.slice(0, pos + 1).search(/\S+$/);
  var right = str.slice(pos).search(/\s/);

  // The last word in the string is a special case.
  if (right < 0) {
    return str.length;
  }

  return right + pos;
}

function copyToClipboard() {
  const mydata = document.getElementById("textarea").value;
  const copyButton = document.getElementById("copyButton");

  navigator.clipboard.writeText(mydata)
    .then(() => {
      console.log('Text successfully copied to clipboard');
      // Additional actions if needed
    })
    .catch(err => {
      console.error('Unable to copy text to clipboard', err);
      // Handle error if needed
    });
}

function pasteFromClipboard() {
  navigator.permissions.query({ name: 'clipboard-read' })
    .then(permissionStatus => {
      if (permissionStatus.state === 'granted' || permissionStatus.state === 'prompt') {
        return navigator.clipboard.readText();
      } else {
        console.error('Permission to read clipboard denied');
        throw new Error('Permission denied');
      }
    })
    .then(text => {
      document.getElementById("textarea").value = text;
      console.log('Text successfully pasted from clipboard');
      // Additional actions if needed
    })
    .catch(err => {
      console.error('Unable to read text from clipboard', err);
      // Handle error if needed
    });
}


function clearTextarea() {
  try {
    const textarea = document.getElementById("textarea");
    textarea.value = '';

    console.log('Text inside textarea cleared');
    // Additional actions if needed
  } catch (error) {
    console.error('Error clearing textarea:', error);
    // Handle error if needed
  }
}
///////////////////////////////////////////////////////////////////////



//Added code/////////////

// Menu Assets




