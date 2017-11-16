'use strict';

const TMD_HTML = {
  welcomeMessage: '.js-tmd-welcome-message',
  remindersSection: '.tmd-reminders-section',
  pageSizeSelection: '#tmd-ps-10, #tmd-ps-25, #tmd-ps-50',
  splashScreen: {
    it: '.tmd-splash',
    loginButton: 'button[data-type="login"]',
    registerButton: 'button[data-type="register"]'
  },
  remindersTable: {
    it: '.js-tmd-reminders-table',
    body: '.js-tmd-reminders-table'
  },
  modal: {
    it: '.js-tmd-gen-modal',
    header: '.js-tmd-gen-modal h2',
    message: '.js-tmd-gen-modal p',
    content: {
      login: '.js-tmd-login-mdc',
      newReminder: '.js-tmd-create-remider-mdc',
      registration: '.js-tmd-register-mdc'
    }
  },
  forms: {
    login: {
      it: '#tmd-login-form',
      username: '#tmd-login-username',
      password: '#tmd-login-password',
      demo: "#login-with-demo"
    },
    newReminder: {
      it: '#tmd-new-reminder-form',
      dateField: '#tmd-create-reminder-date',
      cancelReminderButton: '#tmd-cancel-reminder'
    },
    registration: {
      it: '#tmd-register-form',
      password: '#tmd-register-password',
      passwordConfirm: '#tmd-register-password-confirm',
      username: '#tmd-register-username',
      password: '#tmd-register-password',
      email: '#tmd-register-email',
      phoneNumber: '#tmd-register-phone',
      firstName: '#tmd-register-firstname',
      lastName: '#tmd-register-lastname'
    }
  },
  newReminderButton: '#tmd-new-reminder-button',
  logoutButton: '#tmd-logout-button'
};

const TMD_API = {
  login: '/api/auth/login',
  reminders: '/api/reminder',
  user: '/api/user'
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
      `Enter your credentials to access your dashboard.`
  },
  SHOW_REMINDER: {
    show: true,
    login: false,
    create: true,
    header: 'New Reminder',
    message: 'Enter the details for your new reminder:'
  },
  SHOW_REGISTRATION: {
    show: true,
    login: false,
    create: false,
    register: true,
    header: 'User Registration',
    message: 'Please enter your information below. After you submit, you\'ll be required to confirm your phone number.'
  }
}

let currentReminderPage = 0;
let pageSize = localStorage.getItem('pageSize') || 10;
$(`#tmd-ps-${pageSize}`).addClass('tmd-ps-selected');
pageSize = parseInt(pageSize);

$(onReady);

function onReady(){
  keepMinDateUpdated();
  bindUserInput();
  tryAutoLogin();
}

function bindUserInput(){
  $(TMD_HTML.forms.login.it).on('submit', onLoginFormSubmit );
  $(TMD_HTML.forms.newReminder.it).on('submit', onNewReminderSubmit );
  $(TMD_HTML.forms.newReminder.cancelReminderButton).on('click', onCancelReminderClick);
  $(TMD_HTML.newReminderButton).on('click', onNewReminderClick );
  $(TMD_HTML.logoutButton).on('click', logout);
  $(TMD_HTML.splashScreen.loginButton).on('click', showLogin);
  $(TMD_HTML.splashScreen.registerButton).on('click', showRegistration);
  $(TMD_HTML.forms.registration.it).on('submit', onSubmitRegistration);
  $(TMD_HTML.pageSizeSelection).on('click', handlePageSizeSelection);
  $(TMD_HTML.forms.login.demo).on('click', enterDemoCredentials)
}

/////////////////////////
// USER REGISTRATION
/////////////////////////
function onSubmitRegistration(event){
  prevDef(event);
  if (!$(TMD_HTML.forms.registration.it)[0].checkValidity()) {
    return;
  }
  if ($(TMD_HTML.forms.registration.password).val() !==
    $(TMD_HTML.forms.registration.passwordConfirm).val()) {
      alert('Password does not match confirmation password.');
      return;
  }

  registerUser()
    .then(res => {
      $(TMD_HTML.forms.login.username).val(res.username);
      alert('Your account has been created. Please login with your username and password.');
      changeModalVisibility(MODAL_VISIBILITY.SHOW_LOGIN);
    })
    .catch(err => {
      console.log(err);
      alert(getErrorMessage(err));
    })
}

function registerUser(){
  return $.ajax(TMD_API.user, {
    type: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    dataType: 'json',
    data: getNewUserData()
  });
}

function getNewUserData(){
  return JSON.stringify({
    "username": $(TMD_HTML.forms.registration.username).val(),
    "password": $(TMD_HTML.forms.registration.password).val(),
    "firstName": $(TMD_HTML.forms.registration.firstName).val(),
    "lastName": $(TMD_HTML.forms.registration.lastName).val(),
    "email": $(TMD_HTML.forms.registration.email).val(),
    "phoneNumber": $(TMD_HTML.forms.registration.phoneNumber).val(),
    "g-recaptcha-response": grecaptcha.getResponse()
  });
}

/////////////////////////
// USER LOGIN
/////////////////////////
function onLoginFormSubmit(event){
  prevDef(event);
  if (!$(TMD_HTML.forms.login.it)[0].checkValidity()){
    return;
  }
  loginUser()
    .then(() => {
      return getReminders();
    })
    .then(() => {
      changeModalVisibility(MODAL_VISIBILITY.HIDE)
      $(TMD_HTML.remindersSection).show();
    })
    .catch(err => {
      alert(getErrorMessage(err));
    });
}

function enterDemoCredentials() {
  $(TMD_HTML.forms.login.username).val('demo');
  $(TMD_HTML.forms.login.password).val('EVjpEBnuju');
}

function loginUser(){
  return $.ajax(TMD_API.login, {
      type: "POST",
      headers: getAuthHeader(TMD_BASIC_HEADER),
      success: res => {
        loginSuccess(res.authToken);
      }
    });
}

function loginSuccess(token){
  TMD_API.username = localStorage.getItem('username') || $(TMD_HTML.forms.login.username).val();
  TMD_API.username = TMD_API.username.toLowerCase();
  document.getElementById(TMD_HTML.forms.login.it.replace('#','')).reset();
  localStorage.setItem('username', TMD_API.username);
  localStorage.setItem('authToken', token);
  $(TMD_HTML.logoutButton).parent().css('display', 'inline-block');
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
        $(TMD_HTML.welcomeMessage).hide();
        changeModalVisibility(MODAL_VISIBILITY.SHOW_LOGIN);
      })
  } else {
    $(TMD_HTML.welcomeMessage).hide();
  }
}

/////////////////////////
// GET REMINDERS
/////////////////////////
function getReminders(){
  return $.ajax(TMD_API.reminders, {
    type: 'GET',
    headers: getAuthHeader(TMD_TOKEN_HEADER),
    data: {
      pageNumber: currentReminderPage,
      pageSize: pageSize
    },
    success: data => {
      var htmlString = data.reminders.reduce((all, current) => {
        return all = all + getReminderHtml(current);
      }, '');
      $(TMD_HTML.remindersTable.body).append(htmlString);
      $(TMD_HTML.remindersTable.it).show();
      $(TMD_HTML.splashScreen.it).hide();
      $('body').css('background-image', 'none');
    }
  });
}

function getReminderHtml(reminder){
  const _html =
  `<div class="tmd-reminder-card">
    <p class="tmd-reminder-card-date">${getFormattedDate(reminder.date)}</p>
    <h3>${reminder.name}</h3>
    <p class="tmd-reminders-card-text">${reminder.text}</p>
    <p class="tmd-reminder-status">${(reminder.complete ? '<span><sub>Sent</sub><i title="Status sent." class="fa fa-check fa-2x" aria-hidden="true"></i></span>' :
    '<span><sub>Pending</sub><i title="Status pending." class="fa fa-clock-o fa-2x" aria-hidden="true"></i></span>')}</p>
  </div>`;
  return _html;
}

/////////////////////////
// CREATE REMINDER
/////////////////////////
function onNewReminderClick(event){
  prevDef(event);
  let currentTime = updateMinDate();
  $(TMD_HTML.forms.newReminder.dateField).val(currentTime);
  changeModalVisibility(MODAL_VISIBILITY.SHOW_REMINDER);
  window.scrollTo(0,0);
}

function onCancelReminderClick(event){
  prevDef(event);
  changeModalVisibility({});
}

function onNewReminderSubmit(event){
  prevDef(event);
  createNewReminder()
    .then(function(reminder){
      document.getElementById(TMD_HTML.forms.newReminder.it.replace('#','')).reset();
      changeModalVisibility({});
      let _html = getReminderHtml(reminder);
      $(TMD_HTML.remindersTable.body).prepend(_html);
    })
    .catch(err => {
      alert(getErrorMessage(err));
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
  localStorage.removeItem('pageSize');
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
  let hour = dt.getHours() > 12 ? dt.getHours() - 12 : ( dt.getHours() == 0 ? 12 : dt.getHours() );
  let amPm = dt.getHours() > 11 ? "PM" : "AM";
  let dtString = `${weekday[dt.getDay()]}, ${dt.getMonth()+1}/${dt.getDate()}/${dt.getFullYear()} @ ` +
                `${hour}:${(dt.getMinutes()<10?'0':'') + dt.getMinutes()} ${amPm}`;
  return dtString;
}

let tmdMessageAppend = '';
function setWelcomeMessage(user, append=tmdMessageAppend){
  let message = `Welcome${append},  ${user}!<br>Let me tell you something later!`;
  $(TMD_HTML.welcomeMessage).html(message);
  $(TMD_HTML.welcomeMessage).show();
};

function changeModalVisibility(options){
  if (options.show){
    $(TMD_HTML.modal.it).fadeIn();
  }
  else{
    $(TMD_HTML.modal.it).hide();
  }

  if (options.login){
    $(TMD_HTML.modal.content.login).show();
    $(TMD_HTML.splashScreen.it).hide();
  }
  else{
    $(TMD_HTML.modal.content.login).hide();
  }

  if (options.create){
    $(TMD_HTML.modal.content.newReminder).show();
    $(TMD_HTML.newReminderButton).hide();
  }
  else{
    $(TMD_HTML.modal.content.newReminder).hide();
    $(TMD_HTML.newReminderButton).fadeIn();
  }

  if(options.register){
    $(TMD_HTML.modal.content.registration).show();
    $(TMD_HTML.splashScreen.it).hide();
  }
  else{
    $(TMD_HTML.modal.content.registration).hide();
  }

  if (options.header){
    $(TMD_HTML.modal.header).text(options.header);
  }

  if (options.message){
    let m = options.message.replace(/(?:\r\n|\r|\n)/g, '<br />');
    $(TMD_HTML.modal.message).html(m);
  }
}

function showLogin(){
  changeModalVisibility(MODAL_VISIBILITY.SHOW_LOGIN);
}

function showRegistration(){
  changeModalVisibility(MODAL_VISIBILITY.SHOW_REGISTRATION);
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
      "Authorization": "basic " + btoa(`${$(TMD_HTML.forms.login.username).val()}:${$(TMD_HTML.forms.login.password).val()}`)
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
        `${now.getDate()}T${now.getHours() < 10 ? '0' + now.getHours() : now.getHours()}:` +
        `${now.getMinutes() < 10 ? '0' + now.getMinutes():now.getMinutes()}`;
  $(TMD_HTML.forms.newReminder.dateField).attr('min', now);
  return now;
}

function getErrorMessage(res){
  let err = (res.responseJSON ? res.responseJSON.message : res.responseText );
  if (err.includes('reCAPTCHA')){
    grecaptcha.reset();
  }
  return err;
}

function handlePageSizeSelection(e){
  prevDef(e);
  $(TMD_HTML.pageSizeSelection).removeClass('tmd-ps-selected');
  $(e.target).addClass('tmd-ps-selected');
  pageSize = parseInt($(e.target).text());
  localStorage.setItem('pageSize', pageSize);
  location.reload();
}