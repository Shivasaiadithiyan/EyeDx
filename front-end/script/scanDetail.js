document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  const scanId = localStorage.getItem('selectedScanId');
  const patientName = localStorage.getItem('selectedPatientName');

  if (!token || !scanId || !patientName) {
    alert("Missing data. Redirecting...");
    location.href = "dashboard.html";
    return;
  }

  document.getElementById('patientName').textContent = `Patient: ${patientName}`;
  const scanImage = document.getElementById('scanImage');
  const detailsView = document.getElementById('detailsView');
  const fillForm = document.getElementById('fillForm');
  const editBtn = document.getElementById('editBtn');

  let scanData;

  try {
    const res = await fetch(`http://localhost:5000/api/doctor/scan/${scanId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    scanData = await res.json();
    if (!res.ok) throw new Error(scanData.message);

    scanImage.setAttribute("referrerpolicy", "no-referrer");
    scanImage.src = scanData.imgurl;

    renderDetails(scanData);

    if (scanData.diagnosis && scanData.prescription && scanData.status) {
      editBtn.style.display = 'block';
    } else {
      fillForm.style.display = 'flex';
    }

  } catch (err) {
    detailsView.innerHTML = `<p>Error loading scan: ${err.message}</p>`;
  }

  editBtn.addEventListener('click', () => {
    const editing = fillForm.style.display === 'flex';
    if (editing) {
      fillForm.style.display = 'none';
      detailsView.style.display = 'block';
      editBtn.textContent = 'Edit';
    } else {
      document.getElementById('diagnosis').value = scanData.diagnosis || '';
      document.getElementById('prescription').value = scanData.prescription || '';
      document.getElementById('status').value = scanData.status || '';
      fillForm.style.display = 'flex';
      detailsView.style.display = 'none';
      editBtn.textContent = 'Cancel';
    }
  });

  fillForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const diagnosis = document.getElementById('diagnosis').value.trim();
    const prescription = document.getElementById('prescription').value.trim();
    const status = document.getElementById('status').value;

    if (!diagnosis || !prescription || !status) {
      alert('All fields are required.');
      return;
    }

    try {
      const updateRes = await fetch(`http://localhost:5000/api/doctor/scan/${scanId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ diagnosis, prescription, status })
      });

      const result = await updateRes.json();
      if (!updateRes.ok) throw new Error(result.message);

      alert('Scan updated successfully.');
      location.reload();
    } catch (updateErr) {
      alert("Error updating scan: " + updateErr.message);
    }
  });

  function renderDetails(scan) {
    detailsView.innerHTML = `
      <p><strong>Classification:</strong> ${scan.classification || 'Not classified'}</p>
      <p><strong>Diagnosis:</strong> ${scan.diagnosis || 'Not provided'}</p>
      <p><strong>Prescription:</strong> ${scan.prescription || 'Not provided'}</p>
      <p><strong>Status:</strong> ${scan.status || 'Pending'}</p>
    `;
    detailsView.style.display = 'block';
    fillForm.style.display = 'none';
  }

  document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.clear();
    window.location.href = 'index.html';
  });
});
