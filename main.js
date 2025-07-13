// Load dropdowns dynamically
window.addEventListener('DOMContentLoaded', () => {
  const yearSelect = document.getElementById('bs-year');
  const monthSelect = document.getElementById('bs-month');
  const districtSelect = document.getElementById('district');

  for (let y = 2050; y <= 2100; y++) {
    yearSelect.innerHTML += `<option>${y}</option>`;
  }

  const bsMonths = ['Baishakh','Jestha','Ashadh','Shrawan','Bhadra','Ashwin','Kartik','Mangsir','Poush','Magh','Falgun','Chaitra'];
  bsMonths.forEach((m,i) => {
    monthSelect.innerHTML += `<option value="${i+1}">${m}</option>`;
  });

  for (const district in DISTRICT_COORDS) {
    districtSelect.innerHTML += `<option value="${district}">${district}</option>`;
  }
});

document.getElementById('kundali-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const year = document.getElementById('bs-year').value;
  const month = document.getElementById('bs-month').value;
  const day = document.getElementById('bs-day').value;
  const hour = document.getElementById('hour').value;
  const minute = document.getElementById('minute').value;
  const ampm = document.getElementById('ampm').value;

  const district = document.getElementById('district').value;
  const lat = document.getElementById('latitude').value || DISTRICT_COORDS[district]?.latitude;
  const lon = document.getElementById('longitude').value || DISTRICT_COORDS[district]?.longitude;

  // Convert BS → AD (dummy conversion for now, replace with nepali-date-converter)
  const adDate = `${year - 57}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;

  let hour24 = parseInt(hour);
  if (ampm === "PM" && hour24 < 12) hour24 += 12;
  if (ampm === "AM" && hour24 === 12) hour24 = 0;

  const datetime = `${adDate}T${String(hour24).padStart(2, '0')}:${minute.padStart(2, '0')}:00+05:45`;

  const payload = {
    datetime,
    coordinates: { latitude: lat, longitude: lon }
  };

  try {
    const res = await fetch('http://localhost:5000/kundali', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    document.getElementById('result').textContent = JSON.stringify(data, null, 2);
  } catch (err) {
    document.getElementById('result').textContent = '❌ Error fetching Kundali data.';
    console.error(err);
  }
});
