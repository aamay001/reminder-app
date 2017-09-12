const MOCK_REMINDERS = [
  {
    name: 'Reminder 1',
    text: 'This is a mock reminder!',
    date: new Date()
  },
  {
    name: 'Reminder 2',
    text: 'This is a mock reminder!',
    date: new Date()
  },
  {
    name: 'Reminder 3',
    text: 'This is a mock reminder!',
    date: new Date()
  },
  {
    name: 'Reminder 4',
    text: 'This is a mock reminder!',
    date: new Date()
  }
];

const TMO_HTML = {
  welcomeMessage: '.js-tmo-welcome-message',
  remindersSection: '.tmo-reminders-section',
  remindersTable: {
    it: '.js-tmo-reminders-table',
    body: '.js-tmo-reminders-table tbody'
  },
  modal: {
    it: '.js-tmo-gen-modal',
    header: '.js-tmo-gen-modal h1',
    message: '.js-tmo-gen-modal p',
    content: {
      login: '.js-tmo-login-mdc',
      newReminder: '.js-tmo-create-remider-mdc'
    }
  },
  forms: {
    login: '#tmo-login-form',
    newReminder: '#tmo-new-reminder-form'
  },
  newReminderButton: '#tmo-new-reminder-button'
};

$(onReady);

function onReady(){
  bindUserInput();
}

function bindUserInput(){
  $(TMO_HTML.forms.login).on('submit', onLoginFormSubmit );
  $(TMO_HTML.forms.newReminder).on('submit', onNewReminderSubmit );
  $(TMO_HTML.newReminderButton).on('click', onNewReminderClick );
}

/////////////////////////
// CREATE REMINDER
/////////////////////////
function onNewReminderClick(event){
  event.preventDefault();
  changeModalVisibility({
    show:true,
    login:false,
    create:true,
    header: "New Reminder",
    message: "Enter the details for your new reminder below."
  });
}

function onNewReminderSubmit(event){
  event.preventDefault();
  createNewReminder()
    .then(function(reminder){
      changeModalVisibility({});
      let _html = getReminderHtml(reminder);
      $(TMO_HTML.remindersTable.body).append(_html);
    });
}

function createNewReminder(){
  return new Promise((resolve,reject) => {
    resolve({
      name: $('#tmo-create-reminder-name').val(),
      text: $('#tmo-create-reminder-text').val(),
      date: new Date($('#tmo-create-reminder-date').val())
    });
    document.getElementById(TMO_HTML.forms.newReminder.replace('#','')).reset();
  });
}

/////////////////////////
// USER LOGIN
/////////////////////////
function onLoginFormSubmit(event){
  event.preventDefault();
  loginUser()
    .then(user => {
      setWelcomeMessage(user);
      return loadReminders();
    })
    .then(() => {
      changeModalVisibility({
        show: false,
        login: false,
        create: false
      })
      $(TMO_HTML.remindersSection).show();
    });
}

function loginUser(){
  return new Promise((resolve,reject) => {
    resolve({
      username: $(TMO_HTML.forms.login + ' #tmo-login-username').val()
    })
    document.getElementById(TMO_HTML.forms.login.replace('#','')).reset();
  });
}

/////////////////////////
// GET REMINDERS
/////////////////////////
function loadReminders(){
  return getReminders()
    .then(reminders => {
      var htmlString = reminders.reduce((all, current) => {
        return all = all + getReminderHtml(current);
      }, '');
      $(TMO_HTML.remindersTable.body).append(htmlString);
      $(TMO_HTML.remindersTable.it).show();
    });
}

function getReminders(){
  return new Promise((resolve,reject) => {
    resolve(MOCK_REMINDERS);
  });
}

function getReminderHtml(reminder){
  const _html =
  `<tr>
    <td>${reminder.name}</td>
    <td>${reminder.text}</td>
    <td>${getFormattedDate(reminder.date)}</td>
  </tr>`;
  return _html;
}

/////////////////////////
// UTILITY FUNCTIONS
/////////////////////////
function getFormattedDate(dt){
  let weekday = new Array(7);
  weekday[0] = 'Sunday';
  weekday[1] = 'Monday';
  weekday[2] = 'Tuesday';
  weekday[3] = 'Wednesday';
  weekday[4] = 'Thursday';
  weekday[5] = 'Friday';
  weekday[6] = 'Saturday';
  let hour = dt.getHours() > 12 ? dt.getHours() - 12 : dt.getHours();
  let amPm = dt.getHours() > 11 ? "PM" : "AM";
  let dtString = `${weekday[dt.getDay()]}, ${dt.getMonth()+1}/${dt.getDate()}/${dt.getFullYear()} @ ` +
                `${hour}:${(dt.getMinutes()<10?'0':'') + dt.getMinutes()} ${amPm}`;
  return dtString;
}

function setWelcomeMessage(user){
  let message = `Welcome,  ${user.username}! Let me tell you something later!`;
  $(TMO_HTML.welcomeMessage).text(message);
};

function changeModalVisibility(options){
  if (options.show){
    $(TMO_HTML.modal.it).show();
  }
  else{
    $(TMO_HTML.modal.it).hide();
  }
  if (options.login){
    $(TMO_HTML.modal.content.login).show();
  }
  else{
    $(TMO_HTML.modal.content.login).hide();
  }
  if (options.create){
    $(TMO_HTML.modal.content.newReminder).show();
  }
  else{
    $(TMO_HTML.modal.content.newReminder).hide();
  }
  if (options.header){
    $(TMO_HTML.modal.header).text(options.header);
  }
  if (options.message){
    $(TMO_HTML.modal.message).text(options.message);
  }
}