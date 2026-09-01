// =========================
// DATA & API (Menggunakan API Lama)
// =========================
const API_URL = "https://script.google.com/macros/s/AKfycbwaVhnjGeh1AYzOtN_b9rmujwwyYDExsCpnJfoWxYU7y_3so397P4Plw8PeRjaz15fu4g/exec";
let contents = [];

// =========================
// FUNGSI UTILITIES
// =========================
function getStoreId() {
    const params = new URLSearchParams(window.location.search);
    return params.get("store") || "gm-prada";
}

function getStoreName() {
    return getStoreId().replace(/-/g, " ").toUpperCase();
}

function getProgressKey() {
    return `progress_${getStoreId()}`;
}

function getClaimKey() {
    return `claimed_${getStoreId()}`;
}

// =========================
// LOAD DATA LOCAL STORAGE
// =========================
let progress = JSON.parse(localStorage.getItem(getProgressKey())) || [];
const lastClicked = localStorage.getItem("lastClicked");
if (lastClicked !== null) {
    progress[lastClicked] = true;
    localStorage.setItem(getProgressKey(), JSON.stringify(progress));
    localStorage.removeItem("lastClicked");
}

// =========================
// AMBIL ELEMENT HTML
// =========================
const contentList = document.getElementById("contentList");
const progressFill = document.getElementById("progressFill");
const progressBadge = document.getElementById("progressBadge");
const countDone = document.getElementById("countDone");
const countTotal = document.getElementById("countTotal");
const motivationalText = document.getElementById("motivationalText");
const claimButton = document.getElementById("claimButton");
const rewardCard = document.getElementById("rewardCard");
const rewardIcon = document.getElementById("rewardIcon");
const rewardTitle = document.getElementById("rewardTitle");
const rewardDesc = document.getElementById("rewardDesc");
const storeBadge = document.getElementById("storeBadge");

if (storeBadge) storeBadge.innerText = getStoreName();

// =========================
// UPDATE PROGRESS (Menghitung % dan Tampilan Reward)
// =========================
function updateProgress() {
    const completed = progress.filter(Boolean).length;
    const total = contents.length;
    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

    progressFill.style.width = percent + "%";
    progressBadge.innerText = percent + "%";
    countDone.innerText = completed;
    countTotal.innerText = "/ " + total;

    // Motivasi Text
    let motiv = "Let's get started! ✨";
    if (percent > 0 && percent <= 30) motiv = "Nice! Keep going! 💪";
    else if (percent > 30 && percent <= 55) motiv = "Halfway there! 🔥";
    else if (percent > 55 && percent < 100) motiv = "Almost there! 👀";
    else if (percent === 100) motiv = "You did it! 🎉";
    motivationalText.innerText = motiv;

    if (percent === 100) {
        progressBadge.className = "text-xs font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-600";
        
        // Aktifkan Card Reward
        rewardCard.style.background = "linear-gradient(135deg, #fdf2f8 0%, #fce7f3 40%, #fbcfe8 70%, #f9a8d4 100%)";
        rewardCard.style.border = "2px solid #f472b6";
        rewardCard.classList.remove("opacity-80");
        rewardCard.classList.add("shadow-2xl");
        
        rewardIcon.innerText = "🎁✨";
        rewardIcon.classList.add("float-anim");
        rewardTitle.innerText = "Reward Unlocked!";
        rewardTitle.className = "font-black text-xl tracking-wider uppercase mb-1 shimmer-text";
        rewardDesc.innerText = "You completed all missions! 🎉";
        rewardDesc.className = "text-sm mb-5 text-rose-600 font-semibold";

        claimButton.disabled = false;
        claimButton.innerText = "🎀 Claim My Reward";
        claimButton.className = "w-full py-4 rounded-2xl font-black text-sm tracking-widest uppercase transition-all duration-300 bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] pulse-glow cursor-pointer";
    }
}

// =========================
// CLAIM REWARD (API LAMA)
// =========================
async function claimReward() {
    const store = getStoreId();
    try {
        claimButton.innerText = "Processing...";
        const response = await fetch(`${API_URL}?action=claim&store=${store}`);
        const result = await response.json();

        if (result.success) {
            localStorage.setItem(getClaimKey(), "true");
            showSuccess(getStoreName());
        } else {
            alert("Claim gagal.");
            claimButton.innerText = "🎀 Claim My Reward";
        }
    } catch (err) {
        console.error(err);
        alert("Terjadi kesalahan.");
        claimButton.innerText = "🎀 Claim My Reward";
    }
}

// =========================
// SHOW SUCCESS PAGE (UI BARU)
// =========================
function showSuccess(storeNameDisplay) {
    const sekarang = new Date();
    const tanggal = sekarang.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
    const jam = sekarang.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });

    document.body.innerHTML = `
        <div class="success-page-container min-h-screen flex flex-col items-center justify-start px-4 py-8 relative overflow-hidden" style="background: linear-gradient(160deg, #fff0f7 0%, #fce7f3 40%, #fbcfe8 80%, #f9a8d4 100%); width: 100%; height: 100%;">
            <div class="absolute top-0 left-0 w-48 h-48 rounded-full opacity-20" style="background: radial-gradient(circle, #f472b6, transparent); transform: translate(-40%, -40%);"></div>
            
            <div class="relative w-full max-w-sm mx-auto flex flex-col items-center">
                <div class="mb-8 mt-2 flex items-center gap-2">
                    <div class="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center shadow-md">
                        <span class="text-white font-black text-xs tracking-tight">P</span>
                    </div>
                    <span class="font-bold text-base tracking-widest text-rose-700 uppercase">Paragon</span>
                </div>

                <div class="text-6xl mb-3 float-anim">🎉</div>
                <h1 class="font-black text-3xl text-rose-700 uppercase tracking-widest text-center mb-1">YOU DID IT!</h1>
                <div class="flex items-center gap-2 mb-6">
                    <span class="font-bold text-lg text-pink-500 tracking-wide">REWARD CLAIMED</span>
                    <span>💗</span>
                </div>

                <p class="text-center text-gray-600 text-sm mb-8 leading-relaxed">
                    Thank you for completing the <span class="font-bold text-rose-500">PAKARMARU USK 2026</span> mission.
                </p>

                <div class="w-full bg-white rounded-3xl shadow-xl p-6 mb-5 border border-pink-100">
                    <div class="flex justify-between items-center py-3 border-b border-pink-50">
                        <span class="text-xs font-bold uppercase tracking-widest text-gray-400">Store</span>
                        <span class="font-bold text-gray-800">${storeNameDisplay}</span>
                    </div>
                    <div class="flex justify-between items-center py-3 border-b border-pink-50">
                        <span class="text-xs font-bold uppercase tracking-widest text-gray-400">Date</span>
                        <span class="font-semibold text-gray-700">${tanggal}</span>
                    </div>
                    <div class="flex justify-between items-center py-3">
                        <span class="text-xs font-bold uppercase tracking-widest text-gray-400">Time</span>
                        <span class="font-semibold text-gray-700">${jam} WIB</span>
                    </div>
                </div>

                <div class="w-full rounded-3xl p-5 mb-8 text-center" style="background: linear-gradient(135deg, #fdf2f8, #fce7f3); border: 2px solid #f9a8d4;">
                    <div class="text-2xl mb-2">💁‍♀️</div>
                    <p class="font-bold text-rose-700 text-sm leading-relaxed">
                        Show this screen to Panitia Atau Brand Advisor to receive your reward.
                    </p>
                </div>

                <div class="flex items-center gap-2 bg-green-500 text-white rounded-full px-6 py-3 shadow-lg mb-10">
                    <span class="font-black text-sm uppercase tracking-widest">✓ Claimed</span>
                </div>
            </div>
        </div>
    `;
}

// =========================
// LOAD CONTENTS DARI API (API Lama)
// =========================
async function loadContents() {
    const store = getStoreId();
    try {
        const response = await fetch(`${API_URL}?store=${store}`);
        contents = await response.json();
        renderButtons();
        updateProgress();
    } catch (err) {
        console.error(err);
        contentList.innerHTML = `<p class="text-center text-red-500 text-sm">Gagal mengambil data misi.</p>`;
    }
}

// =========================
// RENDER MISION CARDS (Menyesuaikan Desain Baru)
// =========================
function renderButtons() {
    contentList.innerHTML = "";
    
    contents.forEach((item, index) => {
        const isCompleted = progress[index];
        const isTiktok = item.link.toLowerCase().includes("tiktok");
        
        const iconSvg = isTiktok 
          ? `<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect width="24" height="24" rx="6" fill="#010101" /><path d="M16.5 5.5c.4 1.8 1.5 2.8 3 3v2c-1.1 0-2-.3-2.8-.8v5.5c0 2.8-2.2 5-5 5s-5-2.2-5-5 2.2-5 5-5c.3 0 .5 0 .8.1v2.1c-.3-.1-.5-.1-.8-.1-1.6 0-2.9 1.3-2.9 2.9s1.3 2.9 2.9 2.9 2.9-1.3 2.9-2.9V5.5h1.9z" fill="white" /></svg>`
          : `<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><defs><linearGradient id="ig-${index}" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stopColor="#f09433" /><stop offset="25%" stopColor="#e6683c" /><stop offset="50%" stopColor="#dc2743" /><stop offset="75%" stopColor="#cc2366" /><stop offset="100%" stopColor="#bc1888" /></linearGradient></defs><rect x="2" y="2" width="20" height="20" rx="6" fill="url(#ig-${index})" /><circle cx="12" cy="12" r="4.5" stroke="white" strokeWidth="1.8" fill="none" /><circle cx="17.5" cy="6.5" r="1.2" fill="white" /></svg>`;

        const card = document.createElement("div");
        
        if (isCompleted) {
            card.className = "relative rounded-2xl p-4 transition-all duration-500 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 shadow-sm";
            card.innerHTML = `
                <div class="absolute -top-2 -right-2 text-green-500">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="11" fill="#22c55e" /><path d="M7 12l3.5 3.5L17 8" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" /></svg>
                </div>
                <div class="flex items-center gap-3">
                    <div class="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center bg-green-100">
                        ${iconSvg}
                    </div>
                    <div class="flex-1 min-w-0">
                        <div class="flex items-center gap-1.5 mb-0.5">
                            <span class="text-green-500 text-xs">✓</span>
                            <span class="font-bold text-xs tracking-wider uppercase text-green-600">Mission ${String(index + 1).padStart(2, '0')}</span>
                        </div>
                        <p class="font-semibold text-sm truncate text-green-800">${item.title}</p>
                        <p class="text-xs text-green-500">${isTiktok ? 'TikTok' : 'Instagram'}</p>
                    </div>
                    <div class="flex-shrink-0">
                        <div class="flex items-center gap-1 bg-green-100 text-green-600 rounded-full px-3 py-1.5">
                            <span class="text-xs font-bold tracking-wide uppercase">Completed</span>
                        </div>
                    </div>
                </div>
            `;
        } else {
            card.className = "relative rounded-2xl p-4 transition-all duration-500 bg-white border-2 border-pink-100 shadow-md hover:shadow-lg hover:-translate-y-0.5 cursor-pointer";
            card.innerHTML = `
                <div class="flex items-center gap-3">
                    <div class="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-pink-50 to-rose-100">
                        ${iconSvg}
                    </div>
                    <div class="flex-1 min-w-0">
                        <div class="flex items-center gap-1.5 mb-0.5">
                            <span class="font-bold text-xs tracking-wider uppercase text-pink-400">Mission ${String(index + 1).padStart(2, '0')}</span>
                        </div>
                        <p class="font-semibold text-sm truncate text-gray-800">${item.title}</p>
                        <p class="text-xs text-gray-400">${isTiktok ? 'TikTok' : 'Instagram'}</p>
                    </div>
                    <div class="flex-shrink-0">
                        <button class="bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-bold uppercase tracking-wide rounded-full px-3 py-1.5 shadow-md hover:shadow-lg transition-all duration-200 pointer-events-none">
                            Open
                        </button>
                    </div>
                </div>
            `;
            
            card.addEventListener("click", () => {
                localStorage.setItem("lastClicked", index);
                window.open(item.link, "_blank");
            });
        }
        
        contentList.appendChild(card);
    });
}

// =========================
// EVENT LISTENERS UTAMA
// =========================
window.addEventListener("focus", () => {
    const lastClicked = localStorage.getItem("lastClicked");
    const claimed = localStorage.getItem(getClaimKey());
    
    if (claimed) {
        showSuccess(getStoreName());
        return;
    }

    if (lastClicked !== null) {
        if (!progress[lastClicked]) {
            progress[lastClicked] = true;
            localStorage.setItem(getProgressKey(), JSON.stringify(progress));
            localStorage.removeItem("lastClicked");
            
            renderButtons();
            updateProgress();
        }
    }
});

if(claimButton) {
    claimButton.addEventListener("click", claimReward);
}

// =========================
// INISIALISASI
// =========================
const claimed = localStorage.getItem(getClaimKey());
if (claimed) {
    showSuccess(getStoreName());
} else {
    loadContents();
}