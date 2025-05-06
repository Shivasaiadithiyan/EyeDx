document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  const docKey = localStorage.getItem('doctorKey');
  const patKey = localStorage.getItem('selectedPatientKey');
  const patientName = localStorage.getItem('selectedPatientName') || "Patient";

  const scansContainer = document.getElementById('scansContainer');
  const nameSpan = document.getElementById('patientName');
  const logoutBtn = document.getElementById('logoutBtn');

  // Set patient name
  nameSpan.textContent = patientName;

  // Handle logout
  logoutBtn.addEventListener('click', () => {
    localStorage.clear();
    location.href = "index.html";
  });

  if (!token || !docKey || !patKey) {
    alert("Missing login or patient info.");
    location.href = "index.html";
    return;
  }

  try {
    const res = await fetch(`http://localhost:5000/api/doctor/patient/${patKey}/scans`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const scans = await res.json();

    if (!res.ok) throw new Error(scans.message);

    if (scans.length === 0) {
      scansContainer.innerHTML = "<p class='no-scans'>No scans yet for this patient.</p>";
      return;
    }

    scans.forEach(scan => {
      const div = document.createElement('div');
      div.classList.add('scan-card');

      const img = document.createElement('img');
      img.src = scan.imgurl;
      img.alt = 'Scan Image';
      img.className = 'scan-img';
      img.referrerPolicy = 'no-referrer';

      const status = document.createElement('p');
      status.className = 'scan-status';
      status.innerHTML = `<strong>Status:</strong> ${scan.status || "Pending"}`;

      div.appendChild(img);
      div.appendChild(status);

      div.addEventListener('click', () => {
        localStorage.setItem('selectedScanId', scan.id);
        location.href = 'scanDetail.html';
      });

      scansContainer.appendChild(div);
    });

  } catch (err) {
    scansContainer.innerHTML = `<p class='error-msg'>Error: ${err.message}</p>`;
  }
});
