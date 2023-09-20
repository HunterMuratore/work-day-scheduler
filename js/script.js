// Wrap all code that interacts with the DOM in a call to jQuery to ensure that
// the code isn't run until the browser has finished rendering all the elements
// in the html.
$(function () {
  // TODO: Add a listener for click events on the save button. This code should
  // use the id in the containing time-block as a key to save the user input in
  // local storage. HINT: What does `this` reference in the click listener
  // function? How can DOM traversal be used to get the "hour-x" id of the
  // time-block containing the button that was clicked? How might the id be
  // useful when saving the description in local storage?
  var header = $('header');
  var currentDay = $('#currentDay');
  var timeBlockContainer = $('.time-block-container');
  var dateTime = dayjs().format('dddd, MMMM D, YYYY');
  var btns = $('.time-block button');
  var fullHour = dayjs().hour();
  var currentHour = fullHour > 12 ? currentHour - 12 : currentHour;
  var suffix;

  currentDay.text(dateTime);
  
  setInterval(function () {
    timeBlockContainer.each(function () {
      var timeBlock = $(this);
      
      // Split the id of the time block to get an array of ['hour', 'X'] to get the hour
      var timeBlockHour = timeBlock.attr('id').split('-')[1];
  
      if (timeBlockHour < fullHour) {
        timeBlock.addClass('past');
      } else if (timeBlockHour ==  fullHour) {
        timeBlock.addClass('present');
      } else {
        timeBlock.addClass('future');
      }
    });
  }, 1000);

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

  function saveEvent() {
    // Get the button element that was clicked
    var btn = $(this);
    // Get the value of the text area above the button
    var eventText = btn.prev().text();

    // Check that there is an event to save
    if (!eventText) {
      eventText.text('Type an event here to save it!');
    } else {
      // Get the parent div id attribute for hour number
      var eventHour = btn.parent().attr('id');
      // Store the text and hour to local storage
      localStorage.setItem(eventHour, eventText);
      var p = $('<p>Event saved in local storage!</p>')
      header.append(p);

      setTimeout(function () {
        $('header:last-child').text('');
      }, 3000);
    }
  }

  // Generate all time blocks for hours 9am through 5pm
  for(var i = 9; i <= 17; i++) {
    if (i >= 12) {
      suffix= 'pm';
    } else {
      suffix = 'am';
    }
    createTimeBlock((i - 1) % 12 + 1);
  }

  btns.click(saveEvent);

  // TODO: Add code to apply the past, present, or future class to each time
  // block by comparing the id to the current hour. HINTS: How can the id
  // attribute of each time-block be used to conditionally add or remove the
  // past, present, and future classes? How can Day.js be used to get the
  // current hour in 24-hour time?
  
  // TODO: Add code to get any user input that was saved in localStorage and set
  // the values of the corresponding textarea elements. HINT: How can the id
  // attribute of each time-block be used to do this?
});
