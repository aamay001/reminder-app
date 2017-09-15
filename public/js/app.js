'use strict';

const TMD_HTML = {
  welcomeMessage: '.js-tmd-welcome-message',
  remindersSection: '.tmd-reminders-section',
  remindersTable: {
    it: '.js-tmd-reminders-table',
    body: '.js-tmd-reminders-table tbody'
  },
  modal: {
    it: '.js-tmd-gen-modal',
    header: '.js-tmd-gen-modal h1',
    message: '.js-tmd-gen-modal p',
    content: {
      login: '.js-tmd-login-mdc',
      newReminder: '.js-tmd-create-remider-mdc'
    }
  },
  forms: {
    login: {
      it: '#tmd-login-form',
      submitButton: '#tmd-login-submit',
      username: '#tmd-login-username',
      password: '#tmd-login-password'
    },
    newReminder: {
      it: '#tmd-new-reminder-form',
      dateField: '#tmd-create-reminder-date'
    }
  },
  newReminderButton: '#tmd-new-reminder-button',
  logoutButton: '#tmd-logout-button'
};

const TMD_API = {
  login: '/api/auth/login',
  reminders: '/api/reminder',
  username: ''
}

const TMD_TOKEN_HEADER = 'token';
const TMD_BASIC_HEADER = 'basic';
const MODAL_VISIBILITY = {
  HIDE: {
    show: false,
    login: false,
    create: false
  },
  SHOW_LOGIN:{
    show: true,
    login: true,
    create: false,
    header: 'Login',
    message:
      `Welcome to Tell Me on Date!\n` +
      `Enter your credentials to access your dashboard.`
  },
  SHOW_REMINDER: {
    show: true,
    login: false,
    create: true,
    header: 'New Reminder',
    message: 'Enter the details for your new reminder below.'
  }
}

$(onReady);

function onReady(){
  keepMinDateUpdated();
  bindUserInput();
  tryAutoLogin();
}

function bindUserInput(){
  $(TMD_HTML.forms.login.submitButton).on('click', onLoginFormSubmit );
  $(TMD_HTML.forms.login).on('submit', prevDef );
  $(TMD_HTML.forms.newReminder.it).on('submit', onNewReminderSubmit );
  $(TMD_HTML.newReminderButton).on('click', onNewReminderClick );
  $(TMD_HTML.logoutButton).on('click', logout);
}

/////////////////////////
// USER LOGIN
/////////////////////////
function onLoginFormSubmit(event){
  event.preventDefault();
  loginUser()
    .then(() => {
      return getReminders();
    })
    .then(() => {
      changeModalVisibility(MODAL_VISIBILITY.HIDE)
      $(TMD_HTML.remindersSection).show();
    })
    .catch(err => {
      console.error(err);
    });
}

function loginUser(){
  return $.ajax(TMD_API.login, {
      type: "POST",
      headers: getAuthHeader(TMD_BASIC_HEADER),
      success: res => {
        loginSuccess(res.authToken);
      },
      error: res => {
        alert(res.responseJSON.message);
      }
    });
}

function loginSuccess(token){
  TMD_API.username = localStorage.getItem('username') || $(TMD_HTML.forms.login.username).val();
  document.getElementById(TMD_HTML.forms.login.it.replace('#','')).reset();
  localStorage.setItem('username', TMD_API.username);
  localStorage.setItem('authToken', token);
  setWelcomeMessage(TMD_API.username);
}

function tryAutoLogin(){
  let token = localStorage.getItem('authToken');
  if (token){
    TMD_API.username = localStorage.getItem('username');
    tmdMessageAppend = ' back'
    loginSuccess(token);
    getReminders()
      .then(() =>{
        $(TMD_HTML.remindersSection).show();
      })
      .catch(err => {
        changeModalVisibility(MODAL_VISIBILITY.SHOW_LOGIN);
      })
  } else {
    changeModalVisibility(MODAL_VISIBILITY.SHOW_LOGIN);
  }
}

/////////////////////////
// GET REMINDERS
/////////////////////////
function getReminders(){
  return $.ajax(TMD_API.reminders, {
    type: 'GET',
    headers: getAuthHeader(TMD_TOKEN_HEADER),
    success: reminders => {
      var htmlString = reminders.reduce((all, current) => {
        return all = all + getReminderHtml(current);
      }, '');
      $(TMD_HTML.remindersTable.body).append(htmlString);
      $(TMD_HTML.remindersTable.it).show();
    }
  });
}

function getReminderHtml(reminder){
  const _html =
  `<tr>
    <td>${reminder.name}</td>
    <td>${reminder.text}</td>
    <td>${getFormattedDate(reminder.date)}</td>
    <td>${(reminder.complete ? 'Sent' : 'Pending')}</td>
  </tr>`;
  return _html;
}

/////////////////////////
// CREATE REMINDER
/////////////////////////
function onNewReminderClick(event){
  prevDef(event);
  $(TMD_HTML.forms.newReminder.dateField).val(updateMinDate());
  changeModalVisibility(MODAL_VISIBILITY.SHOW_REMINDER);
}

function onNewReminderSubmit(event){
  prevDef(event);
  createNewReminder()
    .then(function(reminder){
      document.getElementById(TMD_HTML.forms.newReminder.it.replace('#','')).reset();
      changeModalVisibility({});
      let _html = getReminderHtml(reminder);
      $(TMD_HTML.remindersTable.body).append(_html);
    })
    .catch(err => {
      alert(err.responseText);
    })
}

function createNewReminder(){
  return $.ajax(TMD_API.reminders, {
    type: 'POST',
    headers: getAuthHeader(TMD_TOKEN_HEADER),
    dataType: 'json',
    data: getNewReminderData()
  });
}


/////////////////////////
// UTILITY FUNCTIONS
/////////////////////////
function logout(event){
  prevDef(event);
  localStorage.removeItem('authToken');
  localStorage.removeItem('username');
  location.reload();
}

function getFormattedDate(dt){
  dt = new Date(dt);
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

let tmdMessageAppend = '';
function setWelcomeMessage(user, append=tmdMessageAppend){
  let message = `Welcome${append},  ${user}! Let me tell you something later!`;
  $(TMD_HTML.welcomeMessage).text(message);
};

function changeModalVisibility(options){
  if (options.show){
    $(TMD_HTML.modal.it).show();
  }
  else{
    $(TMD_HTML.modal.it).hide();
  }
  if (options.login){
    $(TMD_HTML.modal.content.login).show();
  }
  else{
    $(TMD_HTML.modal.content.login).hide();
  }
  if (options.create){
    $(TMD_HTML.modal.content.newReminder).show();
  }
  else{
    $(TMD_HTML.modal.content.newReminder).hide();
  }
  if (options.header){
    $(TMD_HTML.modal.header).text(options.header);
  }
  if (options.message){
    let m = options.message.replace(/(?:\r\n|\r|\n)/g, '<br />');
    $(TMD_HTML.modal.message).html(m);
  }
}

function getAuthHeader(type){
  if (type === TMD_TOKEN_HEADER){
    const token = localStorage.getItem('authToken');
    return {
      "Authorization" : `Bearer ${token}`,
      "Content-Type": "application/json"
    };
  }
  else if (type === TMD_BASIC_HEADER){
    return {
      "Authorization": "basic_tmd " + btoa(`${$(TMD_HTML.forms.login.username).val()}:${$(TMD_HTML.forms.login.password).val()}`)
    };
  }
}

function getNewReminderData(){
  return JSON.stringify({
    name: $('#tmd-create-reminder-name').val(),
    text: $('#tmd-create-reminder-text').val(),
    date: new Date($('#tmd-create-reminder-date').val()),
    user_id: TMD_API.username
  });
}

function prevDef(event){
  event.preventDefault();
}

function keepMinDateUpdated(){
  updateMinDate();
  setInterval(updateMinDate, 15000);
}

function updateMinDate(){
  let now = dateFns.addMinutes(new Date(), 10);
  now = `${now.getFullYear()}-` +
        `${now.getMonth() + 1 < 10 ? '0' + (now.getMonth() + 1) : now.getMonth() + 1}-` +
        `${now.getDate()}T${now.getHours()}:` +
        `${now.getMinutes() < 10 ? '0' + now.getMinutes():now.getMinutes()}`;
  $(TMD_HTML.forms.newReminder.dateField).attr('min', now);
  return now;
}