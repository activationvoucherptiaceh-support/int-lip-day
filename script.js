// =========================
// DATA DUMMY
// =========================
const API_URL = "https://script.google.com/macros/s/AKfycbwaVhnjGeh1AYzOtN_b9rmujwwyYDExsCpnJfoWxYU7y_3so397P4Plw8PeRjaz15fu4g/exec";
let contents = [];


// =========================
// LOAD DATA LOCAL STORAGE
// =========================

let progress = JSON.parse(
    localStorage.getItem(getProgressKey())
) || [];

const lastClicked = localStorage.getItem("lastClicked");

if (lastClicked !== null) {

    progress[lastClicked] = true;

    localStorage.setItem(
    getProgressKey(),
    JSON.stringify(progress)
);

    localStorage.removeItem("lastClicked");

}


// =========================
// AMBIL ELEMENT HTML
// =========================

const contentList = document.getElementById("contentList");
const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");
const claimButton = document.getElementById("claimButton");


// =========================
// UPDATE PROGRESS
// =========================

function updateProgress() {

    const completed = progress.filter(Boolean).length;

    const total = contents.length;

    const percent = Math.round((completed / total) * 100);

    progressFill.style.width = percent + "%";

    progressText.innerText = percent + "%";

    if (percent === 100) {

        claimButton.disabled = false;

        claimButton.classList.add("active");

    } else {

        claimButton.disabled = true;

        claimButton.classList.remove("active");

    }

}
function getStoreName() {

    const item = contents.find(c => c.store !== "ALL");

    return item ? item.storeName : "Unknown Store";

}
async function claimReward() {

    const params = new URLSearchParams(window.location.search);
    const store = params.get("store") || "gm-prada";

    try {

        const response = await fetch(`${API_URL}?action=claim&store=${store}`);

        const result = await response.json();

        if (result.success) {

            localStorage.setItem(
    getClaimKey(),
    "true"
);

            showSuccess(getStoreName());

        } else {

            alert("Claim gagal.");

        }

    } catch (err) {

        console.error(err);

        alert("Terjadi kesalahan.");

    }

}

function showSuccess(storeName) {

    const sekarang = new Date();

    const tanggal = sekarang.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });

    const jam = sekarang.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit"
    });

    document.querySelector(".container").innerHTML = `

        <div class="success-page">

            <img src="assets/logo.png" class="logo">

            <div class="success-icon">🎉</div>

            <h2>PROGRES SELESAI</h2>

            <p class="success-subtitle">
                Terima kasih telah menyelesaikan seluruh misi
                <b>FOLLOW SOCIAL MEDIA</b>.
            </p>

            <div class="success-card">

                <div class="success-item">
                    <span>Store</span>
                    <strong>${storeName}</strong>
                </div>

                <div class="success-item">
                    <span>Tanggal</span>
                    <strong>${tanggal}</strong>
                </div>

                <div class="success-item">
                    <span>Jam</span>
                    <strong>${jam} WIB</strong>
                </div>

            </div>

            <div class="success-note">
                📱 Tunjukkan halaman ini kepada
                <b>Panitia Atau Brand Advisor Paragon</b>
                untuk mendapatkan Stamp!.
            </div>

        </div>

    `;

}
function getStoreId() {

    const params = new URLSearchParams(window.location.search);

    return params.get("store") || "gm-prada";

}

function getProgressKey() {

    return `progress_${getStoreId()}`;

}

function getClaimKey() {

    return `claimed_${getStoreId()}`;

}

async function loadContents() {

    const params = new URLSearchParams(window.location.search);

    const store = params.get("store") || "gm-prada";

    try {

        const response = await fetch(`${API_URL}?store=${store}`);

        contents = await response.json();

        renderButtons();

        updateProgress();

    } catch (err) {

        console.error(err);

        alert("Gagal mengambil data.");

    }

}


// =========================
// RENDER BUTTON
// =========================

function renderButtons() {

    contentList.innerHTML = "";

    contents.forEach((item, index) => {

        const button = document.createElement("button");

        button.className = "content-btn";

        if (progress[index]) {

            button.classList.add("completed");

            button.innerText = "✔ " + item.title;

        } else {

            button.innerText = item.title;

        }

        button.addEventListener("click", () => {

    if(progress[index]){

        return;

    }

    localStorage.setItem("lastClicked", index);

    window.open(item.link,"_blank");

});

        contentList.appendChild(button);

    });

}
window.addEventListener("focus", () => {

    const lastClicked = localStorage.getItem("lastClicked");
    const claimed = localStorage.getItem(getClaimKey());

if(claimed){

    showSuccess(getStoreName());

}

    if (lastClicked === null) return;

    if (!progress[lastClicked]) {

        progress[lastClicked] = true;

        localStorage.setItem(
    getProgressKey(),
    JSON.stringify(progress)
);

        localStorage.removeItem("lastClicked");

        location.reload();

    }

});
claimButton.addEventListener("click", claimReward);


// =========================
// HITUNG PROGRESS PERTAMA
// =========================

loadContents();