const form = document.getElementById("kundaliForm");
const grahaList = document.getElementById("grahaList");
const results = document.getElementById("results");
const nakshatraDisplay = document.getElementById("nakshatraDisplay");
const submitBtn = document.getElementById("submitBtn");

const titles = {
  np: {
    title: "🔮 नेपाली कुंडली निर्माता",
    subtitle: "स्विस एप्हेमेरिस प्रयोग गरी आफ्नो वैदिक कुंडली प्राप्त गर्नुहोस्।",
    date: "🗓 जन्म मिति",
    time: "⏰ जन्म समय",
    location: "📍 जन्म स्थान",
    submit: "🌠 कुंडली बनाउनुहोस्",
    result: "🪬 ग्रह स्थिति",
    nak: "🌙 चन्द्र नक्षत्र: ",
    rashi: "राशि"
  },
  en: {
    title: "🔮 Nepali Kundali Generator",
    subtitle: "Get your Vedic chart using Swiss Ephemeris engine",
    date: "🗓 Birth Date",
    time: "⏰ Birth Time",
    location: "📍 Birth Location",
    submit: "🌠 Generate Kundali",
    result: "🪬 Graha Positions",
    nak: "🌙 Moon Nakshatra: ",
    rashi: "Rashi"
  }
};

let currentLang = "np";

const langNepaliBtn = document.getElementById("langNepali");
const langEnglishBtn = document.getElementById("langEnglish");

langNepaliBtn.onclick = () => switchLanguage("np");
langEnglishBtn.onclick = () => switchLanguage("en");

function switchLanguage(lang) {
  currentLang = lang;
  document.getElementById("title").innerText = titles[lang].title;
  document.getElementById("subtitle").innerText = titles[lang].subtitle;
  document.getElementById("labelDate").innerText = titles[lang].date;
  document.getElementById("labelTime").innerText = titles[lang].time;
  document.getElementById("labelLocation").innerText = titles[lang].location;
  document.getElementById("submitBtn").innerText = titles[lang].submit;
  document.getElementById("resultTitle").innerText = titles[lang].result;
  langNepaliBtn.classList.toggle("active", lang === "np");
  langEnglishBtn.classList.toggle("active", lang === "en");
}

switchLanguage("np");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  submitBtn.innerText = "🧘 कृपया पर्खनुहोस्...";
  grahaList.innerHTML = "";
  nakshatraDisplay.innerText = "";
  results.classList.add("hidden");

  const birth_date = form.birth_date.value;
  const birth_time = form.birth_time.value;
  const birth_location = form.birth_location.value;

  try {
    const response = await fetch("https://kundali-backend.onrender.com/kundali", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ birth_date, birth_time, birth_location })
    });

    if (!response.ok) throw new Error("Server Error");

    const data = await response.json();
    const positions = data.grahas;
    const moonNak = data.moon_nakshatra;
    const lagna = data.lagna;

    results.classList.remove("hidden");
    nakshatraDisplay.innerText = `${titles[currentLang].nak}${moonNak}`;

    Object.entries(positions).forEach(([graha, info]) => {
      if (graha !== "Lagna") {
        const li = document.createElement("li");
        li.innerText = `${graha}: ${info.degree}° (${titles[currentLang].rashi}: ${info.rashi})`;
        grahaList.appendChild(li);
      }
    });

    const lagnaLi = document.createElement("li");
    lagnaLi.innerText = `लग्न: ${lagna.degree}° (${titles[currentLang].rashi}: ${lagna.rashi})`;
    grahaList.appendChild(lagnaLi);

    submitBtn.innerText = titles[currentLang].submit;
  } catch (err) {
    grahaList.innerHTML = `<li>⚠️ ${currentLang === "np" ? "सर्भरसँग जडान गर्न सकिएन।" : "Unable to connect to server."}</li>`;
    submitBtn.innerText = titles[currentLang].submit;
  }
});