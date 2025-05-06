document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  const doctorKey = localStorage.getItem('doctorKey');
  const doctorName = localStorage.getItem('doctorName') || 'Doctor';
  const list = document.getElementById('patientList');
  const nameSpan = document.getElementById('doctorName');
  const logoutBtn = document.getElementById('logoutBtn');

  // Redirect to login if not authenticated
  if (!token || !doctorKey) {
    alert("You must log in first.");
    location.href = "index.html";
    return;
  }

  // Set doctor name in greeting
  nameSpan.textContent = doctorName;

  // Logout functionality
  logoutBtn.addEventListener('click', () => {
    localStorage.clear();
    location.href = "index.html";
  });

  try {
    const res = await fetch('http://localhost:5000/api/doctor/patients', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message);

    if (data.length === 0) {
      list.innerHTML = `<p style="color: #ccc;">No patients yet.</p>`;
      return;
    }

    // Render each patient as a card (name only)
    data.forEach(patient => {
      const card = document.createElement('div');
      card.className = 'patient-card';
      card.textContent = patient.name;

      card.addEventListener('click', () => {
        localStorage.setItem('selectedPatientKey', patient.login_key);
        localStorage.setItem('selectedPatientName', patient.name);
        location.href = 'scan.html';
      });

      list.appendChild(card);
    });

  } catch (err) {
    list.innerHTML = `<p style="color: red;">Error loading patients: ${err.message}</p>`;
  }
});
