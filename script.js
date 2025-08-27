// Mobile Navigation Toggle
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });
}

// Form Validation
const contactForm = document.getElementById('contactForm');
const successMessage = document.getElementById('successMessage');

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validatePhone(phone) {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phone === '' || phoneRegex.test(phone.replace(/\s/g, ''));
}

function showError(fieldId, message) {
  const field = document.getElementById(fieldId);
  const errorElement = document.getElementById(fieldId + 'Error');
  const successElement = document.getElementById(fieldId + 'Success');
  field.classList.add('input-error');
  errorElement.textContent = message;
  errorElement.classList.add('show');
  if (successElement) successElement.classList.remove('show');
}

function showSuccess(fieldId) {
  const field = document.getElementById(fieldId);
  const successElement = document.getElementById(fieldId + 'Success');
  const errorElement = document.getElementById(fieldId + 'Error');
  field.classList.remove('input-error');
  if (successElement) {
    successElement.textContent = 'Looks good!';
    successElement.classList.add('show');
  }
  errorElement.classList.remove('show');
}

function clearError(fieldId) {
  const field = document.getElementById(fieldId);
  const errorElement = document.getElementById(fieldId + 'Error');
  const successElement = document.getElementById(fieldId + 'Success');
  field.classList.remove('input-error');
  errorElement.textContent = '';
  errorElement.classList.remove('show');
  if (successElement) successElement.classList.remove('show');
}

function validateForm() {
  let isValid = true;
  ['name', 'email', 'phone', 'subject', 'message'].forEach(clearError);
  const name = document.getElementById('name').value.trim();
  if (!name) { showError('name', 'Full name is required'); isValid = false; }
  else if (name.length < 2) { showError('name', 'Name must be at least 2 characters long'); isValid = false; }
  else if (!/^[a-zA-Z\s'-]+$/.test(name)) { showError('name', 'Invalid characters'); isValid = false; }
  else { showSuccess('name'); }

  const email = document.getElementById('email').value.trim();
  if (!email) { showError('email', 'Email is required'); isValid = false; }
  else if (!validateEmail(email)) { showError('email', 'Invalid email format'); isValid = false; }
  else if (email.length > 254) { showError('email', 'Email is too long'); isValid = false; }
  else { showSuccess('email'); }

  const phone = document.getElementById('phone').value.trim();
  if (phone && !validatePhone(phone)) { showError('phone', 'Invalid phone number'); isValid = false; }
  else if (phone) { showSuccess('phone'); }

  const subject = document.getElementById('subject').value.trim();
  if (!subject) { showError('subject', 'Subject is required'); isValid = false; }
  else if (subject.length < 5) { showError('subject', 'Too short'); isValid = false; }
  else if (subject.length > 100) { showError('subject', 'Too long'); isValid = false; }
  else { showSuccess('subject'); }

  const message = document.getElementById('message').value.trim();
  if (!message) { showError('message', 'Message is required'); isValid = false; }
  else if (message.length < 10) { showError('message', 'Too short'); isValid = false; }
  else if (message.length > 1000) { showError('message', 'Too long'); isValid = false; }
  else { showSuccess('message'); }

  return isValid;
}

if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    if (validateForm()) {
      successMessage.classList.add('show');
      contactForm.reset();
      setTimeout(() => successMessage.classList.remove('show'), 5000);
    }
  });
}

// Real-time validation
['name','email','phone','subject','message'].forEach(fieldId => {
  const field = document.getElementById(fieldId);
  if (!field) return;
  field.addEventListener('input', function() {
    const value = this.value.trim();
    switch(fieldId) {
      case 'name':
        if (value.length >= 2 && /^[a-zA-Z\s'-]+$/.test(value)) showSuccess(fieldId);
        else if (value.length > 0) showError(fieldId, 'Invalid name');
        else clearError(fieldId);
        break;
      case 'email':
        if (value && validateEmail(value) && value.length <= 254) showSuccess(fieldId);
        else if (value) showError(fieldId, 'Invalid email');
        else clearError(fieldId);
        break;
      case 'phone':
        if (value && validatePhone(value)) showSuccess(fieldId);
        else if (value) showError(fieldId, 'Invalid phone');
        else clearError(fieldId);
        break;
      case 'subject':
        if (value.length >= 5 && value.length <= 100) showSuccess(fieldId);
        else if (value) showError(fieldId, 'Subject length invalid');
        else clearError(fieldId);
        break;
      case 'message':
        if (value.length >= 10 && value.length <= 1000) showSuccess(fieldId);
        else if (value) showError(fieldId, 'Message length invalid');
        else clearError(fieldId);
        break;
    }
  });
});

// To-Do List
let todos = [], todoIdCounter = 1;
const todoInput = document.getElementById('todoInput');
const addTodoBtn = document.getElementById('addTodo');
const todoList = document.getElementById('todoList');

function updateStats() {
  const total = todos.length;
  const completed = todos.filter(todo => todo.completed).length;
  const pending = total - completed;
  document.getElementById('totalTasks').textContent = total;
  document.getElementById('completedTasks').textContent = completed;
  document.getElementById('pendingTasks').textContent = pending;
}

function renderTodos() {
  todoList.innerHTML = '';
  todos.forEach(todo => {
    const todoItem = document.createElement('div');
    todoItem.className = 'todo-item';
    todoItem.innerHTML = `
      <div class="todo-text ${todo.completed ? 'completed' : ''}">${todo.text}</div>
      <div class="todo-actions">
        <button class="action-btn complete-btn" onclick="toggleTodo(${todo.id})">${todo.completed ? 'Undo' : 'Complete'}</button>
        <button class="action-btn delete-btn" onclick="deleteTodo(${todo.id})">Delete</button>
      </div>`;
    todoList.appendChild(todoItem);
  });
  updateStats();
}

function addTodo() {
  const text = todoInput.value.trim();
  if (text) {
    todos.push({ id: todoIdCounter++, text, completed: false });
    todoInput.value = '';
    renderTodos();
  }
}

function toggleTodo(id) {
  const todo = todos.find(t => t.id === id);
  if (todo) { todo.completed = !todo.completed; renderTodos(); }
}

function deleteTodo(id) {
  todos = todos.filter(t => t.id !== id);
  renderTodos();
}

if (addTodoBtn) addTodoBtn.addEventListener('click', addTodo);
if (todoInput) todoInput.addEventListener('keypress', e => { if (e.key === 'Enter') addTodo(); });
renderTodos();

// Image Upload Gallery
const fileInputSimple = document.getElementById('fileInput');
const uploadBtnSimple = document.getElementById('uploadBtn');
const gallery = document.getElementById('gallery');

if (uploadBtnSimple) {
  uploadBtnSimple.addEventListener('click', () => {
    const file = fileInputSimple.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = function(e) {
        const img = document.createElement('img');
        img.src = e.target.result;
        img.onclick = () => previewImage(e.target.result);
        gallery.appendChild(img);
      };
      reader.readAsDataURL(file);
      fileInputSimple.value = '';
    } else {
      alert('Please select an image file to upload.');
    }
  });
}

// Modal Preview
const previewModal = document.getElementById('previewModal');
const modalClose = document.getElementById('modalClose');
const previewContent = document.getElementById('previewContent');

function previewImage(src) {
  previewContent.innerHTML = `<img src="${src}" class="preview-image">`;
  previewModal.classList.add('show');
}

if (modalClose) modalClose.addEventListener('click', () => previewModal.classList.remove('show'));
if (previewModal) previewModal.addEventListener('click', e => { if (e.target === previewModal) previewModal.classList.remove('show'); });

// Smooth Scroll for nav links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (navLinks) navLinks.classList.remove('active');
  });
});

// Expose functions globally for onclick
window.toggleTodo = toggleTodo;
window.deleteTodo = deleteTodo;
