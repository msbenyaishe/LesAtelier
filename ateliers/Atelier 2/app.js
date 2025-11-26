const surahsContainer = document.getElementById("surahsContainer");
const surahCountEl = document.getElementById("surahCount");
const searchInput = document.getElementById("searchInput");
const sortBtn = document.getElementById("sortBtn");
const randomBtn = document.getElementById("randomBtn");
const highlight = document.getElementById("highlight");

// Pagination elements
let currentPage = 1;
const perPage = 12; // how many surahs per page
let filteredSurahs = []; // used after search

let allSurahs = [];

// ---------------- LOAD SURAH DATA ----------------
async function loadSurahs() {
    const res = await fetch("https://api.quran.com/api/v4/chapters");
    const data = await res.json();
    const surahList = data.chapters;

    const reciterId = 7; // Mishary Al-Afasy

    const audioRes = await fetch(
        `https://api.quran.com/api/v4/chapter_recitations/${reciterId}`
    );
    const audioData = await audioRes.json();
    const audioList = audioData.audio_files;

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

    filteredSurahs = allSurahs;
    renderPagination();
    renderSurahs();
}

// ---------------- RENDER SURAH CARDS WITH PAGINATION ----------------
function renderSurahs() {
    const start = (currentPage - 1) * perPage;
    const end = start + perPage;

    const list = filteredSurahs.slice(start, end);

    surahsContainer.innerHTML = list
        .map(
            surah => `
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
        `
        )
        .join("");

    surahCountEl.innerHTML = `Surahs: <b>${filteredSurahs.length}</b>`;
}

// ---------------- PAGINATION UI ----------------
function renderPagination() {
    const totalPages = Math.ceil(filteredSurahs.length / perPage);

    let html = `<div class="pagination">`;

    // Prev button
    html += `<button class="pagBtn" ${currentPage === 1 ? "disabled" : ""} onclick="prevPage()">Prev</button>`;

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        html += `
            <button class="pageNum ${i === currentPage ? "active" : ""}" onclick="setPage(${i})">
                ${i}
            </button>
        `;
    }

    // Next button
    html += `<button class="pagBtn" ${currentPage === totalPages ? "disabled" : ""} onclick="nextPage()">Next</button>`;

    html += `</div>`;

    highlight.innerHTML = html;
}

function setPage(num) {
    currentPage = num;
    renderSurahs();
    renderPagination();
}

function nextPage() {
    const totalPages = Math.ceil(filteredSurahs.length / perPage);
    if (currentPage < totalPages) currentPage++;
    renderSurahs();
    renderPagination();
}

function prevPage() {
    if (currentPage > 1) currentPage--;
    renderSurahs();
    renderPagination();
}

// ---------------- SEARCH ----------------
searchInput.addEventListener("input", () => {
    const term = searchInput.value.toLowerCase();

    filteredSurahs = allSurahs.filter(s =>
        s.name.toLowerCase().includes(term) ||
        s.arabic.includes(term)
    );

    currentPage = 1; // reset to page 1 when searching
    renderPagination();
    renderSurahs();
});

// ---------------- SORT ----------------
sortBtn.addEventListener("click", () => {
    filteredSurahs = [...filteredSurahs].sort((a, b) => a.id - b.id);
    currentPage = 1;
    renderPagination();
    renderSurahs();
});

// ---------------- RANDOM SURAH HIGHLIGHT ----------------
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

// ---------------- INIT ----------------
loadSurahs();
