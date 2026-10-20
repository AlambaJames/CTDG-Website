// Set dynamic copyright year in footer
document.getElementById('year').innerText = new Date().getFullYear();

// 1. HERO CAROUSEL AUTO-SLIDER (DYNAMIC 9 SLIDES)
let currentSlide = 0;

function setHeroSlide(index) {
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.hero-dot');
    
    if (slides.length === 0) return;

    // Toggle slide visibility
    slides.forEach((slide, i) => {
        if (i === index) {
            slide.classList.remove('opacity-0');
            slide.classList.add('opacity-100');
        } else {
            slide.classList.remove('opacity-100');
            slide.classList.add('opacity-0');
        }
    });

    // Update dot indicators if present
    dots.forEach((dot, i) => {
        if (i === index) {
            dot.className = 'hero-dot w-6 h-2 rounded-full bg-emerald-400 transition-all';
        } else {
            dot.className = 'hero-dot w-2 h-2 rounded-full bg-white/40 transition-all';
        }
    });

    currentSlide = index;
}

function nextHeroSlide() {
    const slides = document.querySelectorAll('.hero-slide');
    if (slides.length > 0) {
        let nextIndex = (currentSlide + 1) % slides.length;
        setHeroSlide(nextIndex);
    }
}

// Start auto-slider immediately when page loads (runs every 2.5 seconds)
document.addEventListener('DOMContentLoaded', () => {
    setInterval(nextHeroSlide, 2500);
});

// 2. LIVE TIME & GEOLOCATION WEATHER FOR BOTTOM STATUS BAR
window.addEventListener('DOMContentLoaded', () => {
    updateLiveTime();
    setInterval(updateLiveTime, 1000);

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(fetchLocalWeather, handleWeatherError);
    } else {
        useDefaultJosLocation();
    }
});

function updateLiveTime() {
    const timeElem = document.getElementById('live-time');
    if (!timeElem) return;
    
    try {
        const timeString = new Intl.DateTimeFormat([], {
            timeZone: 'Africa/Lagos',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        }).format(new Date());
        
        timeElem.innerText = `${timeString} (WAT)`;
    } catch (e) {
        timeElem.innerText = '1:57 PM (WAT)';
    }
}

async function fetchLocalWeather(pos) {
    const lat = pos.coords.latitude;
    const lon = pos.coords.longitude;
    try {
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
        const data = await res.json();
        const temp = Math.round(data.current_weather.temperature);
        document.getElementById('live-temp').innerText = `${temp}°C`;
    } catch (e) {
        useDefaultJosLocation();
    }
}

function handleWeatherError() {
    useDefaultJosLocation();
}

function useDefaultJosLocation() {
    const tempElem = document.getElementById('live-temp');
    if (tempElem) tempElem.innerText = '26°C';
}

// 3. EVIDENCE LAB MODAL POPUP LOGIC
const briefsData = {
    'open-burning': {
        tag: 'Research Brief #01',
        title: 'Open Burning: Evidence & Health Implications',
        content: `
            <p><strong>Question:</strong> What happens when household waste, leaves, or plastics are burned in open urban spaces?</p>
            <p><strong>Key Findings:</strong> Open burning releases particulate matter (PM2.5), dioxins, and toxic air pollutants into immediate residential areas. The smoke does not simply disappear; it settles into lower atmospheric levels where families sleep, work, and commute.</p>
            <p><strong>Health Implications:</strong> Direct correlation with aggravated asthma, acute respiratory infections in children, and long-term pulmonary inflammation.</p>
            <p><strong>Practical CTDG Response:</strong> Community waste-sorting campaigns and establishing localized organic composting alternatives.</p>
        `
    },
    'plastic-waste': {
        tag: 'Data Story #02',
        title: 'Single-Use Plastics & Blocked Drainage Networks',
        content: `
            <p><strong>Question:</strong> How does single-use sachet water disposal impact urban infrastructure?</p>
            <p><strong>Key Findings:</strong> Over 70% of urban plastic litter in surveyed communities consists of water sachets and single-use bottles. Improper disposal clogs primary drainage channels, leading to stagnant water retention.</p>
            <p><strong>Health & Environmental Risks:</strong> Stagnant water creates breeding grounds for vector-borne diseases (malaria) and accelerates localized flash flooding during rain cycles.</p>
            <p><strong>Practical CTDG Response:</strong> Community drainage clear-outs combined with school-based waste auditing challenges.</p>
        `
    },
    'wash-health': {
        tag: 'WASH Review #03',
        title: 'Water Safety Beyond Visual Appearance',
        content: `
            <p><strong>Question:</strong> Is visually clear household water inherently safe for consumption?</p>
            <p><strong>Key Findings:</strong> Clarity is not an indicator of microbial safety. Community pulse surveys indicate that over 60% of households judge water quality purely by color and odor, ignoring invisible bacterial pathogens.</p>
            <p><strong>Health Implications:</strong> High rates of preventable water-borne illnesses despite perceived access to clean water sources.</p>
            <p><strong>Practical CTDG Response:</strong> Educational campaigns on point-of-use boiling, filtration, and safe storage practices.</p>
        `
    }
};

function openBriefModal(key) {
    const data = briefsData[key];
    if (!data) return;
    document.getElementById('modal-tag').innerText = data.tag;
    document.getElementById('modal-title').innerText = data.title;
    document.getElementById('modal-content').innerHTML = data.content;
    document.getElementById('brief-modal').classList.remove('hidden');
}

function closeBriefModal() {
    document.getElementById('brief-modal').classList.add('hidden');
}

// 4. FORM SUBMISSION HANDLER
function handleFormSubmit(e) {
    e.preventDefault();
    const msg = document.getElementById('form-message');
    msg.classList.remove('hidden');
    e.target.reset();
    setTimeout(() => msg.classList.add('hidden'), 5000);
}