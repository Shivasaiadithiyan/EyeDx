const form = document.getElementById('loginForm');
const errorMsg = document.getElementById('error');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const loginKey = document.getElementById('loginKey').value;
  const password = document.getElementById('password').value;

  try {
    const res = await fetch('http://localhost:5000/api/doctor/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ loginKey, password })
    });

    const data = await res.json();

    if (!res.ok) {
      errorMsg.textContent = data.message || 'Login failed';
      return;
    }

    localStorage.setItem('token', data.token);
    localStorage.setItem('doctorKey', data.doctor.loginKey);
    localStorage.setItem('doctorName', data.doctor.name);
    location.href = 'dashboard.html';
  } catch (err) {
    errorMsg.textContent = 'Server error';
  }
});
