// DOM elements
const form = document.getElementById("kundaliForm");
const resultDiv = document.getElementById("result");

// 🔗 Replace with your actual backend URL
const API_URL = "https://kundali-backend.krish.repl.co/kundali";

// Handle form submission
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Get user input values
  const name = document.getElementById("name").value;
  const date = document.getElementById("birthDate").value;   // Format: YYYY-MM-DD
  const time = document.getElementById("birthTime").value;   // Format: HH:MM
  const district = document.getElementById("birthDistrict").value;

  // Prepare payload
  const payload = {
    name: name,
    date: date,
    time: time,
    district: district
  };

  try {
    // Send POST request to backend
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();

    // Display result
    if (data.error) {
      resultDiv.innerHTML = `<p style="color: red;">Error: ${data.error}</p>`;
    } else {
      resultDiv.innerHTML = `
        <h3>Chart for ${data.name}</h3>
        <pre>${JSON.stringify(data.chart, null, 2)}</pre>
      `;
    }

  } catch (err) {
    resultDiv.innerHTML = `<p style="color: red;">Request failed: ${err.message}</p>`;
  }
});