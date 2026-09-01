// =========================
// API
// =========================

const API_URL = "https://script.google.com/macros/s/AKfycbwaVhnjGeh1AYzOtN_b9rmujwwyYDExsCpnJfoWxYU7y_3so397P4Plw8PeRjaz15fu4g/exec";

let contents = [];


// =========================
// STORE
// =========================

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

function getLastClickedKey() {

    return `lastClicked_${getStoreId()}`;

}


// =========================
// ELEMENT HTML
// =========================

const contentList = document.getElementById("contentList");

const progressFill = document.getElementById("progressFill");

const progressBadge = document.getElementById("progressBadge");

const countDone = document.getElementById("countDone");

const countTotal = document.getElementById("countTotal");

const motivationalText = document.getElementById("motivationalText");

const rewardCard = document.getElementById("rewardCard");

const rewardIcon = document.getElementById("rewardIcon");

const rewardTitle = document.getElementById("rewardTitle");

const rewardDesc = document.getElementById("rewardDesc");

const claimButton = document.getElementById("claimButton");

const mainContainer = document.getElementById("main-container");


// =========================
// PROGRESS
// =========================

let progress = JSON.parse(
    localStorage.getItem(getProgressKey())
) || [];


// =========================
// STORE NAME
// =========================

function getStoreName() {

    const item = contents.find(
        content => content.store !== "ALL"
    );

    return item?.storeName || getStoreId();

}


// =========================
// MOTIVATIONAL TEXT
// =========================

function getMotivationalText(percent) {

    if (percent === 0) {

        return "Let's get started! ✨";

    }

    if (percent < 50) {

        return "Nice! Keep going! 💪";

    }

    if (percent < 75) {

        return "Halfway there! 🔥";

    }

    if (percent < 100) {

        return "Almost there! 👀";

    }

    return "You did it! 🎉";

}


// =========================
// UPDATE PROGRESS
// =========================

function updateProgress() {

    const completed = progress.filter(Boolean).length;

    const total = contents.length;

    if (total === 0) return;

    const percent = Math.round(
        (completed / total) * 100
    );

    // Progress bar
    progressFill.style.width = percent + "%";

    // Percentage
    progressBadge.innerText = percent + "%";

    // Counter
    countDone.innerText = completed;

    countTotal.innerText = "/ " + total;

    // Motivational text
    motivationalText.innerText =
        getMotivationalText(percent);


    // =========================
    // REWARD STATE
    // =========================

    if (percent === 100) {

        rewardCard.style.opacity = "1";

        rewardCard.style.background =
            "linear-gradient(135deg, #fff1f6, #ffe4ed)";

        rewardCard.style.border =
            "2px solid #f9a8c4";

        rewardIcon.innerText = "🎁✨";

        rewardTitle.innerText =
            "Reward Unlocked!";

        rewardTitle.style.color = "#be185d";

        rewardDesc.innerText =
            "You completed all missions!";

        rewardDesc.style.color = "#666";

        claimButton.disabled = false;

        claimButton.innerText =
            "🎁 Claim My Reward";

        claimButton.classList.remove(
            "bg-gray-200",
            "text-gray-400",
            "cursor-not-allowed"
        );

        claimButton.classList.add(
            "bg-pink-500",
            "text-white"
        );

        claimButton.style.cursor = "pointer";

    } else {

        rewardCard.style.opacity = "0.8";

        rewardCard.style.background =
            "linear-gradient(135deg, #f9fafb, #f3f4f6)";

        rewardCard.style.border =
            "2px solid #e5e7eb";

        rewardIcon.innerText = "🎁";

        rewardTitle.innerText =
            "Reward Locked";

        rewardTitle.style.color = "";

        rewardDesc.innerText =
            "Complete all missions to unlock your reward.";

        rewardDesc.style.color = "";

        claimButton.disabled = true;

        claimButton.innerText =
            "🔒 Locked";

        claimButton.classList.remove(
            "bg-pink-500",
            "text-white"
        );

        claimButton.classList.add(
            "bg-gray-200",
            "text-gray-400",
            "cursor-not-allowed"
        );

        claimButton.style.cursor = "not-allowed";

    }

}


// =========================
// RENDER BUTTONS
// =========================

function renderButtons() {

    contentList.replaceChildren();

    contents.forEach((item, index) => {

        const button = document.createElement("button");

        button.className =
            "w-full rounded-2xl p-4 text-left transition-all duration-300";


        // =========================
        // COMPLETED
        // =========================

        if (progress[index]) {

            button.classList.add(
                "bg-green-500",
                "text-white"
            );

            button.innerHTML = `
                <div class="flex items-center justify-between">
                    
                    <div>
                        <div class="text-xs font-bold uppercase tracking-widest opacity-80">
                            Mission ${String(index + 1).padStart(2, "0")}
                        </div>

                        <div class="font-bold mt-1">
                            ${item.title}
                        </div>

                        <div class="text-xs mt-1 opacity-80">
                            Completed ✓
                        </div>
                    </div>

                    <div class="text-2xl">
                        ✓
                    </div>

                </div>
            `;

            // Tidak bisa diklik lagi
            button.disabled = true;

            button.style.cursor = "default";


            // =========================
            // BELUM SELESAI
            // =========================

        } else {

            button.classList.add(
                "bg-pink-500",
                "text-white",
                "shadow-md"
            );

            button.innerHTML = `
                <div class="flex items-center justify-between">
                    
                    <div>
                        <div class="text-xs font-bold uppercase tracking-widest opacity-80">
                            Mission ${String(index + 1).padStart(2, "0")}
                        </div>

                        <div class="font-bold mt-1">
                            ${item.title}
                        </div>

                        <div class="text-xs mt-1 opacity-80">
                            Open mission →
                        </div>
                    </div>

                    <div class="text-2xl">
                        →
                    </div>

                </div>
            `;


            // =========================
            // CLICK
            // =========================

            button.addEventListener("click", () => {

                localStorage.setItem(
                    getLastClickedKey(),
                    index
                );

                window.open(
                    item.link,
                    "_blank"
                );

            });

        }

        contentList.appendChild(button);

    });

}


// =========================
// LOAD CONTENTS
// =========================

async function loadContents() {

    const store = getStoreId();

    try {

        const response = await fetch(
            `${API_URL}?store=${encodeURIComponent(store)}`
        );

        if (!response.ok) {

            throw new Error(
                `HTTP Error ${response.status}`
            );

        }

        contents = await response.json();

        console.log("Contents:", contents);


        // Pastikan progress sesuai jumlah content
        if (progress.length < contents.length) {

            progress.length = contents.length;

        }


        renderButtons();

        updateProgress();


        // =========================
        // CEK SUDAH CLAIM
        // =========================

        const claimed = localStorage.getItem(
            getClaimKey()
        );

        if (claimed === "true") {

            showSuccess(
                getStoreName()
            );

        }

    } catch (err) {

        console.error(
            "Gagal mengambil data:",
            err
        );

        alert("Gagal mengambil data.");

    }

}


// =========================
// DETEKSI KEMBALI DARI
// INSTAGRAM / TIKTOK
// =========================

window.addEventListener("focus", () => {

    const lastClicked = localStorage.getItem(
        getLastClickedKey()
    );

    if (lastClicked === null) {

        return;

    }

    const index = Number(lastClicked);


    if (!progress[index]) {

        progress[index] = true;

        localStorage.setItem(
            getProgressKey(),
            JSON.stringify(progress)
        );

        localStorage.removeItem(
            getLastClickedKey()
        );


        // Update tanpa reload
        renderButtons();

        updateProgress();

    }

});


// =========================
// CLAIM REWARD
// =========================

async function claimReward() {

    if (claimButton.disabled) {

        return;

    }

    const store = getStoreId();

    claimButton.disabled = true;

    claimButton.innerText =
        "Processing...";


    try {

        const response = await fetch(
            `${API_URL}?action=claim&store=${encodeURIComponent(store)}`
        );

        if (!response.ok) {

            throw new Error(
                `HTTP Error ${response.status}`
            );

        }

        const result = await response.json();


        if (result.success) {

            localStorage.setItem(
                getClaimKey(),
                "true"
            );

            showSuccess(
                getStoreName()
            );

        } else {

            throw new Error(
                "Claim gagal"
            );

        }

    } catch (err) {

        console.error(
            "Claim error:",
            err
        );

        alert(
            "Terjadi kesalahan saat melakukan claim."
        );

        claimButton.disabled = false;

        updateProgress();

    }

}


// =========================
// SUCCESS PAGE
// =========================

function showSuccess(storeName) {

    const sekarang = new Date();

    const tanggal =
        sekarang.toLocaleDateString(
            "id-ID",
            {
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        );

    const jam =
        sekarang.toLocaleTimeString(
            "id-ID",
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );


    mainContainer.innerHTML = `

        <div class="text-center">

            <div class="mb-6">

                <img
                    src="logo.png"
                    class="w-40 mx-auto"
                    alt="Paragon"
                >

            </div>


            <div class="text-6xl mb-4">
                🎉
            </div>


            <h1 class="font-black text-3xl uppercase tracking-tight"
                style="
                    background: linear-gradient(
                        135deg,
                        #be185d,
                        #ec4899,
                        #f43f5e
                    );
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                ">

                YOU DID IT!

            </h1>


            <h2 class="font-black text-xl uppercase tracking-wider mt-2 text-gray-800">

                REWARD CLAIMED 💗

            </h2>


            <p class="text-sm text-gray-500 mt-3 leading-relaxed">

                Thank you for completing
                the <b>INT LIP DAY</b> mission!

            </p>


            <!-- INFORMATION -->

            <div class="bg-white rounded-3xl p-6 shadow-lg border border-pink-100 mt-7 text-left">

                <div class="mb-5">

                    <p class="text-xs font-bold uppercase tracking-widest text-gray-400">
                        Store
                    </p>

                    <p class="font-black text-xl text-gray-800 mt-1">
                        ${storeName}
                    </p>

                </div>


                <div class="border-t border-pink-100 pt-5">

                    <p class="text-xs font-bold uppercase tracking-widest text-gray-400">
                        Date
                    </p>

                    <p class="font-bold text-gray-800 mt-1">
                        ${tanggal}
                    </p>

                </div>


                <div class="border-t border-pink-100 pt-5 mt-5">

                    <p class="text-xs font-bold uppercase tracking-widest text-gray-400">
                        Time
                    </p>

                    <p class="font-bold text-gray-800 mt-1">
                        ${jam} WIB
                    </p>

                </div>

            </div>


            <!-- INSTRUCTION -->

            <div class="mt-5 rounded-2xl p-5"
                 style="
                    background:#fff1f6;
                    border:1px solid #fbcfe8;
                 ">

                <div class="text-2xl mb-2">
                    📱
                </div>

                <p class="text-sm text-gray-600 leading-relaxed">

                    Show this screen to your
                    <b>Beauty Advisor</b>
                    to receive your reward.

                </p>

            </div>


            <!-- CLAIMED -->

            <div class="mt-6">

                <div class="inline-flex items-center gap-2
                            px-5 py-3 rounded-full
                            bg-green-100 text-green-600
                            font-black text-sm">

                    ✓ CLAIMED

                </div>

            </div>

        </div>

    `;

}


// =========================
// CLAIM BUTTON
// =========================

claimButton.addEventListener(
    "click",
    claimReward
);


// =========================
// START
// =========================

loadContents();