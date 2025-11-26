const surahsContainer = document.getElementById("surahsContainer");
const surahCountEl = document.getElementById("surahCount");
const searchInput = document.getElementById("searchInput");
const sortBtn = document.getElementById("sortBtn");
const randomBtn = document.getElementById("randomBtn");
const highlight = document.getElementById("highlight");

let allSurahs = [];

// --- Fetch Qur'an Surahs From API ---
async function loadSurahs() {
    const res = await fetch("https://api.quran.com/api/v4/chapters");
    const data = await res.json();
    const surahList = data.chapters;

    // Each surah also needs audio → we get a common reciter ID
    const reciterId = 7; // Mishary Al-Afasy

    const audioRes = await fetch(
        `https://api.quran.com/api/v4/chapter_recitations/${reciterId}`
    );
    const audioData = await audioRes.json();
    const audioList = audioData.audio_files;

    // Format objects
    allSurahs = surahList.map(item => {
        const audioObj = audioList.find(a => a.chapter_id === item.id);

        return {
            id: item.id,
            name: item.name_simple,
            arabic: item.name_arabic,
            revelation: item.revelation_place,
            audio: audioObj ? audioObj.audio_url : null
        };
    });

    renderSurahs(allSurahs);
}

// --- Render Cards ---
function renderSurahs(list) {
    surahsContainer.innerHTML = list
        .map(surah => `
            <div class="surah-card">
                <h3>${surah.id}. ${surah.name}</h3>
                <p>${surah.arabic}</p>
                <p style="opacity:0.7;">${surah.revelation}</p>
                ${
                    surah.audio
                        ? `<audio controls src="${surah.audio}"></audio>`
                        : `<p>No audio available</p>`
                }
            </div>
        `)
        .join("");

    surahCountEl.innerHTML = `Number of Surahs: <b>${list.length}</b>`;
}

// --- Search ---
searchInput.addEventListener("input", () => {
    const term = searchInput.value.toLowerCase();
    const filtered = allSurahs.filter(s =>
        s.name.toLowerCase().includes(term) ||
        s.arabic.includes(term)
    );
    renderSurahs(filtered);
});

// --- Sort by Number ---
sortBtn.addEventListener("click", () => {
    const sorted = [...allSurahs].sort((a, b) => a.id - b.id);
    renderSurahs(sorted);
});

// --- Random Surah Highlight ---
randomBtn.addEventListener("click", () => {
    const index = Math.floor(Math.random() * allSurahs.length);
    const s = allSurahs[index];

    highlight.innerHTML = `
        <div class="surah-card" style="margin-bottom:20px;">
            <h2>🎧 Random Surah</h2>
            <h3>${s.id}. ${s.name}</h3>
            <p>${s.arabic}</p>
            ${
                s.audio
                    ? `<audio controls src="${s.audio}"></audio>`
                    : "<p>No audio available</p>"
            }
        </div>
    `;
});

// Load data on startup
loadSurahs();
