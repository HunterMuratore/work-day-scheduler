$(function () {
  var header = $('header');
  var currentDay = $('#currentDay');
  var timeBlockContainer = $('.time-block-container');
  var dateTime = dayjs().format('dddd, MMMM D, YYYY');
  var time = dayjs();
  var fullHour = time.hour();

  // Generate the HTML for each time block with appropriate classes
  function createTimeBlock(militaryHour) {
    // Convert time to 12 hour time
    var hour = (militaryHour - 1) % 12 + 1;
    // Determine if the hour is in the past, present or future
    var timeBlockClass = militaryHour > fullHour ? 'future' : militaryHour < fullHour ? 'past' : 'present';
    // Get any local storage data for each hour
    var eventText = localStorage.getItem('hour-' + militaryHour);

    // Create the html of the time block container for each hour
    var timeBlockDiv = $('<div>').addClass('row time-block ' + timeBlockClass).attr('id', `hour-${militaryHour}`);
    var hourDiv = $('<div>').addClass('col-2 col-md-1 hour text-center py-3').text(`${hour}${militaryHour >= 12 ? 'pm' : 'am'}`);
    var textarea = $('<textarea>').addClass('col-8 col-md-10 description').attr('rows', '3').attr('placeholder', 'Enter your text here...').val(eventText);
    var button = $('<button>').addClass('btn saveBtn col-2 col-md-1').attr('aria-label', 'save');
    var saveIcon = $('<i>').addClass('fas fa-save').attr('aria-hidden', 'true');

    button.append(saveIcon);
    timeBlockDiv.append(hourDiv, textarea, button);

    timeBlockContainer.append(timeBlockDiv);
  }

  function saveEvent() {
    console.log('click');
    // Get the button element that was clicked
    var btn = $(this);
    // Find the textarea element above the button
    var textarea = btn.prev('textarea');
    // Get the value of the text area
    var eventText = textarea.val();

    // Check that there is an event to save, if not then exit function
    if (!eventText.trim()) {
      eventText.text('Type an event here to save it!');
      return;
    }

    // Get the parent div id attribute for hour number
    var eventHour = btn.parent().attr('id');

    // Store the text and hour to local storage
    localStorage.setItem(eventHour, eventText);

    // Create a feedback p element to let the user know their event was saved
    var feedback = $('<p>').addClass('feedback').text('Event saved in local storage!');
    header.append(feedback);
    // Clear the feedback message after a delay
    setTimeout(function () {
      feedback.remove();;
    }, 3000);
  }

  // Generate all time blocks for hours 9am through 5pm
  function generateTimeBlocks () {
    for(var i = 9; i <= 17; i++) {
      createTimeBlock(i);
    }
  }

  generateTimeBlocks();
  currentDay.text(dateTime);


  // Update the time blocks on page load then update every 60 seconds
  setInterval(function(){
    fullHour = dayjs().hour();
    timeBlockContainer.empty();
    generateTimeBlocks();
  }, 60000);

  timeBlockContainer.on('click', 'button', saveEvent);
});
