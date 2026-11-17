(function () {
  var STORAGE_KEY = 'flyNinjaBookings';
  var fields = [
    'lastName', 'firstName', 'middleName', 'email', 'phone', 'address',
    'nationality', 'from', 'to', 'price', 'departure', 'arrival'
  ];

  var loginScreen = document.getElementById('screen-login');
  var bookingScreen = document.getElementById('screen-booking');
  var loginUser = document.getElementById('loginUser');
  var loginPass = document.getElementById('loginPass');
  var loginBtn = document.getElementById('loginBtn');
  var loginError = document.getElementById('loginError');
  var logoutBtn = document.getElementById('logoutBtn');
  var bookingForm = document.getElementById('bookingForm');
  var bookBtn = document.getElementById('bookBtn');
  var updateBtn = document.getElementById('updateBtn');
  var deleteBtn = document.getElementById('deleteBtn');
  var clearBtn = document.getElementById('clearBtn');
  var formMessage = document.getElementById('formMessage');
  var bookingsBody = document.getElementById('bookingsBody');
  var emptyState = document.getElementById('emptyState');
  var bookingCount = document.getElementById('bookingCount');

  var selectedIndex = null;

  function showScreen(screen) {
    loginScreen.classList.remove('active');
    bookingScreen.classList.remove('active');
    void screen.offsetWidth;
    screen.classList.add('active');
  }

  function showLoginError(msg) {
    loginError.textContent = msg;
    loginError.hidden = !msg;
  }

  function showFormMessage(msg, type) {
    if (!msg) {
      formMessage.hidden = true;
      formMessage.textContent = '';
      formMessage.className = 'form-message';
      return;
    }
    formMessage.hidden = false;
    formMessage.textContent = msg;
    formMessage.className = 'form-message ' + (type || '');
  }

  function getBookings() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function saveBookings(list) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }

  function getFormData() {
    var data = {};
    fields.forEach(function (id) {
      data[id] = document.getElementById(id).value.trim();
    });
    return data;
  }

  function fillForm(data) {
    fields.forEach(function (id) {
      document.getElementById(id).value = data[id] || '';
    });
  }

  function clearForm() {
    bookingForm.reset();
    selectedIndex = null;
    updateBtn.hidden = true;
    deleteBtn.hidden = true;
    bookBtn.hidden = false;
    showFormMessage('');
    Array.prototype.forEach.call(bookingsBody.querySelectorAll('tr'), function (row) {
      row.classList.remove('selected');
    });
  }

  function validate(data) {
    for (var i = 0; i < fields.length; i++) {
      if (!data[fields[i]]) {
        return 'All fields are required.';
      }
    }
    if (data.phone.length !== 11 || !/^\d{11}$/.test(data.phone)) {
      return 'Phone number must be exactly 11 digits.';
    }
    if (data.arrival < data.departure) {
      return 'Arrival date cannot be before departure.';
    }
    return '';
  }

  function formatPrice(value) {
    var num = Number(value);
    if (isNaN(num)) return value;
    return '₱' + num.toLocaleString('en-PH');
  }

  function formatDate(value) {
    if (!value) return '';
    var parts = value.split('-');
    if (parts.length !== 3) return value;
    return parts[1] + '/' + parts[2] + '/' + parts[0];
  }

  function renderTable() {
    var bookings = getBookings();
    bookingsBody.innerHTML = '';
    bookingCount.textContent = bookings.length + (bookings.length === 1 ? ' booking' : ' bookings');
    emptyState.classList.toggle('show', bookings.length === 0);

    bookings.forEach(function (item, index) {
      var tr = document.createElement('tr');
      if (selectedIndex === index) tr.classList.add('selected');
      tr.innerHTML =
        '<td>' + escapeHtml(item.lastName) + '</td>' +
        '<td>' + escapeHtml(item.firstName) + '</td>' +
        '<td>' + escapeHtml(item.middleName) + '</td>' +
        '<td>' + escapeHtml(item.email) + '</td>' +
        '<td>' + escapeHtml(item.phone) + '</td>' +
        '<td>' + escapeHtml(item.address) + '</td>' +
        '<td>' + escapeHtml(item.nationality) + '</td>' +
        '<td>' + escapeHtml(item.from) + '</td>' +
        '<td>' + escapeHtml(item.to) + '</td>' +
        '<td>' + escapeHtml(formatPrice(item.price)) + '</td>' +
        '<td>' + escapeHtml(formatDate(item.departure)) + '</td>' +
        '<td>' + escapeHtml(formatDate(item.arrival)) + '</td>';
      tr.addEventListener('click', function () {
        selectBooking(index);
      });
      bookingsBody.appendChild(tr);
    });
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function selectBooking(index) {
    var bookings = getBookings();
    var item = bookings[index];
    if (!item) return;
    selectedIndex = index;
    fillForm(item);
    updateBtn.hidden = false;
    deleteBtn.hidden = false;
    bookBtn.hidden = true;
    showFormMessage('Editing selected booking. Update or Delete, or Clear to cancel.', 'warn');
    renderTable();
  }

  function handleLogin() {
    var user = loginUser.value.trim();
    var pass = loginPass.value;
    if (user === 'admin' && pass === '1234') {
      showLoginError('');
      showScreen(bookingScreen);
      clearForm();
      renderTable();
      return;
    }
    showLoginError('Invalid username or password.');
  }

  loginBtn.addEventListener('click', function (e) {
    e.preventDefault();
    handleLogin();
  });

  var loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();
      handleLogin();
    });
  }

  logoutBtn.addEventListener('click', function () {
    loginPass.value = '';
    showLoginError('');
    clearForm();
    showScreen(loginScreen);
  });

  bookingForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var data = getFormData();
    var error = validate(data);
    if (error) {
      showFormMessage(error, 'warn');
      return;
    }
    var bookings = getBookings();
    bookings.push(data);
    saveBookings(bookings);
    clearForm();
    renderTable();
    showFormMessage('Flight booked successfully!', 'ok');
  });

  updateBtn.addEventListener('click', function () {
    if (selectedIndex === null) {
      showFormMessage('Please select a row to update.', 'warn');
      return;
    }
    var data = getFormData();
    var error = validate(data);
    if (error) {
      showFormMessage(error, 'warn');
      return;
    }
    var bookings = getBookings();
    bookings[selectedIndex] = data;
    saveBookings(bookings);
    clearForm();
    renderTable();
    showFormMessage('Booking updated successfully!', 'ok');
  });

  deleteBtn.addEventListener('click', function () {
    if (selectedIndex === null) {
      showFormMessage('Please select a row to delete.', 'warn');
      return;
    }
    if (!window.confirm('Are you sure you want to delete this booking?')) return;
    var bookings = getBookings();
    bookings.splice(selectedIndex, 1);
    saveBookings(bookings);
    clearForm();
    renderTable();
    showFormMessage('Booking deleted successfully!', 'ok');
  });

  clearBtn.addEventListener('click', function () {
    clearForm();
  });
})();
