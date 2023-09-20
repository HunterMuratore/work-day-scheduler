$(function () {
  var header = $('header');
  var currentDay = $('#currentDay');
  var timeBlockContainer = $('.container-fluid.time-block-container');
  var dateTime = dayjs().format('dddd, MMMM D, YYYY');
  var btns = $('.time-block button');
  var fullHour = dayjs().hour();
  var currentHour = fullHour > 12 ? fullHour - 12 : fullHour;
  var suffix;

  // Generate the HTML for each time block with appropriate classes
  function createTimeBlock(hour) {
    var timeBlockDiv = $('<div>').addClass('row time-block').attr('id', `hour-${hour}`);
    var hourDiv = $('<div>').addClass('col-2 col-md-1 hour text-center py-3').text(`${hour}${suffix}`);
    var textarea = $('<textarea>').addClass('col-8 col-md-10 description').attr('rows', '3').attr('placeholder', 'Enter your text here...');
    var button = $('<button>').addClass('btn saveBtn col-2 col-md-1').attr('aria-label', 'save');
    var saveIcon = $('<i>').addClass('fas fa-save').attr('aria-hidden', 'true');

    button.append(saveIcon);
    timeBlockDiv.append(hourDiv, textarea, button);

    timeBlockContainer.append(timeBlockDiv);
  }

  // Check each time block and update it's class based off the current time
  function updateTimeBlocks() {
    timeBlockContainer.each(function () {
      var timeBlock = $(this);
      // Split the id of the time block to get an array of ['hour', 'X'] to get the hour
      var timeBlockHour = parseInt(timeBlock.attr('id').split('-')[1]);

      if (timeBlockHour < currentHour) {
        timeBlock.removeClass('present future').addClass('past');
      } else if (timeBlockHour == currentHour) {
        timeBlock.removeClass('past future').addClass('present');
      } else {
        timeBlock.removeClass('past present').addClass('future');
      }
    });
  }

  function saveEvent() {
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

  currentDay.text(dateTime);

  // Generate all time blocks for hours 9am through 5pm
  for(var i = 9; i <= 17; i++) {
    suffix = i >= 12 ? 'pm' : 'am';
    createTimeBlock((i - 1) % 12 + 1);
  }

  // Update the time blocks on page load then update every 60 seconds
  updateTimeBlocks();
  setInterval(updateTimeBlocks, 60000);

  btns.click(saveEvent);
});
