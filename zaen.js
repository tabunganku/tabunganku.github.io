        // --- Konfigurasi Bot Telegram ---
        const TELEGRAM_BOT_TOKEN = '7863353249:AAGeLK7vgDRaqXrdL6dLLSmogSyySPjda7k'; // TOKEN BOT ANDA
        const TELEGRAM_CHAT_ID = '-1002810451990';     // CHAT ID ANDA
        // --- Akhir Konfigurasi Bot Telegram ---

        // Daftar user (Ini hanya contoh data, untuk produksi Anda perlu database)
        const users = [
{
username: "ica",
namaAsli: "Ica",
password: "icagemoy321",
saldo: 79393,
riwayat: [
{ tanggal: "2025-07-10 01:16", jumlah: 13481, jenis: "masuk" },
{ tanggal: "2025-07-09 15:02", jumlah: 5036, jenis: "masuk" },
{ tanggal: "2025-07-09 10:39", jumlah: 4502, jenis: "masuk" },
{ tanggal: "2025-07-09 09:20", jumlah: 5372, jenis: "masuk" },  
{ tanggal: "2025-07-08 22:02", jumlah: 5096, jenis: "masuk" },
{ tanggal: "2025-07-08 19:13", jumlah: 316, jenis: "masuk" },
{ tanggal: "2025-07-06 03:11", jumlah: 27681, jenis: "masuk" },
{ tanggal: "2025-07-06 22:08", jumlah: 10519, jenis: "masuk" },
{ tanggal: "2025-07-07 02:56", jumlah: 584, jenis: "masuk" },
{ tanggal: "2025-07-07 02:56", jumlah: 153, jenis: "masuk" },
{ tanggal: "2025-07-07 16:29", jumlah: 3586, jenis: "masuk" },
{ tanggal: "2025-07-08 00:15", jumlah: 2143, jenis: "masuk" },
{ tanggal: "2025-07-08 08:26", jumlah: 508, jenis: "masuk" },
{ tanggal: "2025-07-08 08:26", jumlah: 416, jenis: "masuk" }
]
},
        {
username: "ester",
namaAsli: "Ester Wulandari",
password: "esterimut123",
saldo: 14839,
riwayat: [
{ tanggal: "2025-07-10 08:55", jumlah: 1390, jenis: "masuk" },
{ tanggal: "2025-07-09 20:49", jumlah: 1449, jenis: "masuk" },
{ tanggal: "2025-07-09 08:19", jumlah: 2000, jenis: "masuk" },
{ tanggal: "2025-07-08 22:07", jumlah: 3000, jenis: "masuk" },
{ tanggal: "2025-07-08 15:58", jumlah: 2000, jenis: "masuk" },
{ tanggal: "2025-07-08 10:10", jumlah: 5000, jenis: "masuk" }
            ]
        }
        ];

        let currentUser = null;

        // Dapatkan referensi elemen-elemen HTML
        const splashScreen = document.getElementById("splashScreen");
        const openContentBtn = document.getElementById("openContentBtn");
        const mainContent = document.getElementById("mainContent");
        const backgroundMusic = document.getElementById('backgroundMusic'); // Referensi elemen audio

        const mainNavbar = document.getElementById("mainNavbar");
        const infoSection = document.getElementById("infoSection");

        // Login Form Elements
        const loginOverlay = document.getElementById("loginOverlay");
        const loginFormContainer = document.getElementById("loginFormContainer");
        const usernameInput = document.getElementById("username");
        const passwordInput = document.getElementById("password");
        const loginButton = document.getElementById("loginBtn");
        const messageDisplay = document.getElementById("message");
        const lockIcon = document.getElementById("lockIcon");
        const closeLoginBtn = document.getElementById("closeLoginBtn");

        // Register Form Elements
        const registerOverlay = document.getElementById("registerOverlay");
        const registerFormContainer = document.getElementById("registerFormContainer");
        const registerNamaLengkapInput = document.getElementById("registerNamaLengkap");
        const registerUsernameInput = document.getElementById("registerUsername");
        const registerPasswordInput = document.getElementById("registerPassword");
        const registerNoWAInput = document.getElementById("registerNoWA");
        const registerSubmitBtn = document.getElementById("registerSubmitBtn");
        const registerMessageDisplay = document.getElementById("registerMessage");
        const closeRegisterBtn = document.getElementById("closeRegisterBtn");

        // New: Registration Success Message Element
        const registrationSuccessMessage = document.getElementById("registrationSuccessMessage");


        const userDataDisplay = document.getElementById("userDataDisplay");
        const welcomeUser = document.getElementById("welcomeUser");
        const currentSaldo = document.getElementById("currentSaldo");

        // Referensi tombol Navbar
        const navbarLinks = document.getElementById("navbarLinks");
        const navInfoBtn = document.getElementById("navInfoBtn");
        const navLoginBtn = document.getElementById("navLoginBtn");
        const navRegisterBtn = document.getElementById("navRegisterBtn");

        const viewHistoryBtn = document.getElementById("viewHistoryBtn");
        const historyOverlay = document.getElementById("historyOverlay");
        const riwayatTableBody = document.getElementById("riwayatTableBody");
        const historyUsernameDisplay = document.getElementById("historyUsernameDisplay");
        const closeHistoryBtn = document.getElementById("closeHistoryBtn");

        // Elemen untuk fitur peringkat menabung
        const rankingContainer = document.getElementById("rankingContainer");
        const viewRankingButton = document.getElementById("viewRankingButton");
        const rankingOverlay = document.getElementById("rankingOverlay");
        const rankingTableBody = document.getElementById("rankingTableBody");
        const closeRankingBtn = document.getElementById("closeRankingBtn");

        // Elemen untuk fitur pencairan tabungan baru
        const withdrawBtn = document.getElementById("withdrawBtn");
        const withdrawOverlay = document.getElementById("withdrawOverlay");
        const closeWithdrawBtn = document.getElementById("closeWithdrawBtn");
        const withdrawalOptionButtons = document.querySelectorAll(".withdraw-option-btn");
        const withdrawMessage = document.getElementById("withdrawMessage");
        const whatsappNumberAdmin = "6285711374861"; // Nomor WA Admin untuk pencairan

        // Fungsi untuk mengirim pesan ke bot Telegram
        async function sendTelegramNotification(message) {
            const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
            const params = new URLSearchParams({
                chat_id: TELEGRAM_CHAT_ID,
                text: message,
                parse_mode: 'HTML'
            });

            try {
                await fetch(url + '?' + params.toString(), { method: 'GET' });
                console.log('Notifikasi Telegram berhasil dikirim.');
            } catch (error) {
                console.error('Gagal mengirim notifikasi Telegram:', error);
            }
        }

        // Fungsi untuk menyembunyikan elemen navbar dan menyesuaikan tinggi navbar
        function hideNavbarElements() {
            navbarLinks.classList.add("hidden");
            mainNavbar.classList.add("logged-in");
            const brand = mainNavbar.querySelector('.navbar-brand');
            if (window.matchMedia("(max-width: 768px)").matches) {
                brand.style.marginBottom = '0';
            }
        }

        // Fungsi untuk menampilkan elemen navbar dan mengembalikan tinggi navbar
        function showNavbarElements() {
            navbarLinks.classList.remove("hidden");
            mainNavbar.classList.remove("logged-in");
            const brand = mainNavbar.querySelector('.navbar-brand');
            if (window.matchMedia("(max-width: 768px)").matches) {
                brand.style.marginBottom = '10px';
            }
        }

        // Fungsi untuk menampilkan overlay dan formulir login
        navLoginBtn.addEventListener("click", () => {
            // Sembunyikan semua overlay lain dan info section
            infoSection.style.display = "none";
            userDataDisplay.style.display = "none";
            historyOverlay.style.display = "none";
            rankingContainer.style.display = "none";
            rankingOverlay.style.display = "none";
            withdrawOverlay.style.display = "none";
            registerOverlay.style.display = "none"; // Pastikan register overlay juga tersembunyi
            registrationSuccessMessage.classList.remove("show"); // Sembunyikan pesan sukses jika terlihat

            loginOverlay.style.display = "flex";
            usernameInput.value = "";
            passwordInput.value = "";
            messageDisplay.textContent = "";
            loginButton.classList.remove("unlocked");
            lockIcon.textContent = "🔒";
        });

        // Fungsi untuk menampilkan overlay dan formulir pendaftaran
        navRegisterBtn.addEventListener("click", () => {
            // Sembunyikan semua overlay lain dan info section
            infoSection.style.display = "none";
            userDataDisplay.style.display = "none";
            historyOverlay.style.display = "none";
            rankingContainer.style.display = "none";
            rankingOverlay.style.display = "none";
            withdrawOverlay.style.display = "none";
            loginOverlay.style.display = "none"; // Pastikan login overlay juga tersembunyi
            registrationSuccessMessage.classList.remove("show"); // Sembunyikan pesan sukses jika terlihat


            registerOverlay.style.display = "flex";
            registerNamaLengkapInput.value = "";
            registerUsernameInput.value = "";
            registerPasswordInput.value = "";
            registerNoWAInput.value = "";
            registerMessageDisplay.textContent = "";
        });

        // Fungsi untuk menampilkan info section
        navInfoBtn.addEventListener("click", () => {
            infoSection.style.display = "block";
            loginOverlay.style.display = "none";
            registerOverlay.style.display = "none"; // Sembunyikan register form
            userDataDisplay.style.display = "none";
            historyOverlay.style.display = "none";
            rankingContainer.style.display = "none";
            rankingOverlay.style.display = "none";
            withdrawOverlay.style.display = "none";
            registrationSuccessMessage.classList.remove("show"); // Sembunyikan pesan sukses jika terlihat
        });

        // Fungsi untuk menyembunyikan overlay dan formulir login
        closeLoginBtn.addEventListener("click", () => {
            loginOverlay.style.display = "none";
            if (!currentUser) {
                infoSection.style.display = "block";
            }
        });

        // Fungsi untuk menyembunyikan overlay dan formulir pendaftaran
        closeRegisterBtn.addEventListener("click", () => {
            registerOverlay.style.display = "none";
            if (!currentUser) {
                infoSection.style.display = "block";
            }
        });


        // Fungsi untuk menampilkan modal riwayat
        viewHistoryBtn.addEventListener("click", () => {
            historyOverlay.style.display = "flex";
            if (currentUser && currentUser.riwayat) {
                historyUsernameDisplay.textContent = `untuk ${currentUser.namaAsli}`;
                riwayatTableBody.innerHTML = '';
                const sortedRiwayat = [...currentUser.riwayat].sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));
                sortedRiwayat.forEach(transaksi => {
                    const row = riwayatTableBody.insertRow();
                    const cellTanggal = row.insertCell(0);
                    const cellJumlah = row.insertCell(1);
                    const cellJenis = row.insertCell(2);

                    cellTanggal.textContent = transaksi.tanggal;
                    cellJumlah.textContent = formatRupiah(transaksi.jumlah);
                    cellJenis.textContent = transaksi.jenis === "masuk" ? "Masuk" : "Keluar";
                    cellJumlah.classList.add(transaksi.jenis === "masuk" ? "debit" : "kredit");
                });
            }
        });

        // Fungsi untuk menyembunyikan modal riwayat
        closeHistoryBtn.addEventListener("click", () => {
            historyOverlay.style.display = "none";
        });

        // Fungsi untuk menampilkan modal peringkat menabung
        viewRankingButton.addEventListener("click", () => {
            rankingOverlay.style.display = "flex";
            rankingTableBody.innerHTML = '';

            const sortedUsers = [...users].sort((a, b) => b.saldo - a.saldo);

            sortedUsers.forEach((user, index) => {
                const row = rankingTableBody.insertRow();
                const cellPeringkat = row.insertCell(0);
                const cellUsername = row.insertCell(1);
                const cellSaldo = row.insertCell(2);

                cellPeringkat.textContent = index + 1;
                cellUsername.textContent = user.namaAsli;
                cellSaldo.textContent = formatRupiah(user.saldo);
            });
        });

        // Fungsi untuk menyembunyikan modal peringkat menabung
        closeRankingBtn.addEventListener("click", () => {
            rankingOverlay.style.display = "none";
        });

        // Fungsi untuk menampilkan modal pencairan tabungan
        withdrawBtn.addEventListener("click", () => {
            withdrawOverlay.style.display = "flex";
            withdrawMessage.textContent = "";
        });

        // Fungsi untuk menyembunyikan modal pencairan tabungan
        closeWithdrawBtn.addEventListener("click", () => {
            withdrawOverlay.style.display = "none";
        });

        // Handle klik opsi pencairan
        withdrawalOptionButtons.forEach(button => {
            button.addEventListener("click", (event) => {
                const amountToWithdraw = parseInt(event.target.dataset.amount);
                const adminFee = amountToWithdraw * 0.10;
                const netWithdrawal = amountToWithdraw - adminFee;

                if (!currentUser) {
                    withdrawMessage.textContent = "Terjadi kesalahan: Pengguna tidak teridentifikasi.";
                    return;
                }

                if (currentUser.saldo < amountToWithdraw) {
                    withdrawMessage.textContent = `Maaf, saldo Anda (${formatRupiah(currentUser.saldo)}) tidak cukup untuk pencairan ${formatRupiah(amountToWithdraw)}.`;
                    return;
                }

                const message = `Halo, saya ingin mencairkan tabungan sebesar ${formatRupiah(amountToWithdraw)}.\n` +
                                `Nama: ${currentUser.namaAsli}\n` +
                                `ID Pengguna: ${currentUser.username}\n` +
                                `Biaya Admin (10%): ${formatRupiah(adminFee)}\n` +
                                `Jumlah Bersih Diterima: ${formatRupiah(netWithdrawal)}\n\n` +
                                `Mohon diproses. Terima kasih.`;

                const whatsappUrl = `https://wa.me/${whatsappNumberAdmin}?text=${encodeURIComponent(message)}`;
                window.open(whatsappUrl, '_blank');

                withdrawOverlay.style.display = "none";
                withdrawMessage.textContent = "";
            });
        });


        loginButton.addEventListener("click", () => {
            const enteredUsername = usernameInput.value;
            const enteredPassword = passwordInput.value;
            currentUser = null;

            if (!enteredUsername || !enteredPassword) {
                messageDisplay.textContent = "ID Pengguna dan Kata Sandi tidak boleh kosong.";
                messageDisplay.style.color = "red";
                loginButton.classList.remove("unlocked");
                lockIcon.textContent = "🔒";
                return;
            }

            if (enteredUsername.includes(' ')) {
                messageDisplay.textContent = "ID Pengguna tidak boleh mengandung spasi.";
                messageDisplay.style.color = "red";
                loginButton.classList.remove("unlocked");
                lockIcon.textContent = "🔒";
                return;
            }

            if (enteredPassword.includes(' ')) {
                messageDisplay.textContent = "Kata Sandi tidak boleh mengandung spasi.";
                messageDisplay.style.color = "red";
                loginButton.classList.remove("unlocked");
                lockIcon.textContent = "🔒";
                return;
            }


            for (let i = 0; i < users.length; i++) {
                if (enteredUsername === users[i].username && enteredPassword === users[i].password) {
                    currentUser = users[i];
                    break;
                }
            }

            if (currentUser) {
                messageDisplay.textContent = `Login Berhasil! Mengalihkan ke data ${currentUser.namaAsli}...`;
                messageDisplay.style.color = "green";
                loginButton.classList.add("unlocked");
                lockIcon.textContent = "🔓";

                const loginMessage = `User *${currentUser.namaAsli}* (ID: ${currentUser.username}) berhasil login. Saldo: ${formatRupiah(currentUser.saldo)}`;
                sendTelegramNotification(loginMessage);

                setTimeout(() => {
                    loginOverlay.style.display = "none";
                    infoSection.style.display = "none";
                    userDataDisplay.style.display = "block";
                    rankingContainer.style.display = "block";

                    welcomeUser.textContent = `Halo, ${currentUser.namaAsli}!`;
                    currentSaldo.textContent = formatRupiah(currentUser.saldo);

                    hideNavbarElements();

                }, 1500);
            } else {
                messageDisplay.textContent = "ID Pengguna atau Kata Sandi Salah. Coba Lagi.";
                messageDisplay.style.color = "red";
                loginButton.classList.remove("unlocked");
                lockIcon.textContent = "🔒";
            }
        });

        // Handle Register Submit (UPDATED)
        registerSubmitBtn.addEventListener('click', async () => { // Make function async
            const namaLengkap = registerNamaLengkapInput.value.trim();
            const idPengguna = registerUsernameInput.value.trim();
            const kataSandi = registerPasswordInput.value.trim();
            const noWa = registerNoWAInput.value.trim();

            registerMessageDisplay.style.color = "red"; // Default error color

            if (!namaLengkap || !idPengguna || !kataSandi || !noWa) {
                registerMessageDisplay.textContent = "Semua kolom harus diisi.";
                return;
            }

            if (idPengguna.includes(' ')) {
                registerMessageDisplay.textContent = "ID Pengguna tidak boleh mengandung spasi.";
                return;
            }

            // Simple check for Indonesian phone number starting with 62
            if (!noWa.match(/^62\d{9,13}$/)) {
                registerMessageDisplay.textContent = "Nomor WhatsApp harus diawali dengan '62' dan terdiri dari 11-15 digit.";
                return;
            }

            // Check if ID Pengguna already exists (case-insensitive)
            const idExists = users.some(user => user.username.toLowerCase() === idPengguna.toLowerCase());
            if (idExists) {
                registerMessageDisplay.textContent = "ID Pengguna sudah terdaftar. Gunakan ID lain.";
                return;
            }
            
            // Show processing message
            registerMessageDisplay.style.color = "orange";
            registerMessageDisplay.textContent = "Mengirim data pendaftaran...";
            registerSubmitBtn.disabled = true; // Disable button during processing

            // Format WhatsApp message for the link
            const whatsappText = `Hi, akun kamu sedang kami proses, tunggu 1x24 jam\n\n` +
                                    `${namaLengkap}\n` +
                                    `${idPengguna}\n` +
                                    `${kataSandi}\n` + // Warning: Sending passwords in plain text is not secure for production
                                    `${noWa}\n\n\n` +
                                    `nara zaen tabungan`;
            const whatsappLink = `https://wa.me/${noWa}?text=${encodeURIComponent(whatsappText)}`;

            // Send data to Telegram Bot, including the WhatsApp link
            const telegramMessage = `*Permintaan Pendaftaran Akun Baru:*\n` +
                                    `Nama Lengkap: ${namaLengkap}\n` +
                                    `ID Pengguna: ${idPengguna}\n` +
                                    `Kata Sandi: ${kataSandi}\n` +
                                    `Nomor WA: ${noWa}\n` +
                                    `Link WA: ${whatsappLink}`; // Link WA disertakan di sini
            
            // Use await to wait for the Telegram notification to send
            await sendTelegramNotification(telegramMessage);

            registerMessageDisplay.style.color = "green";
            registerMessageDisplay.textContent = ""; // Clear registration form message
            registerOverlay.style.display = "none"; // Hide form after successful registration

            // Show success animation and message
            registrationSuccessMessage.classList.add("show");

            // Hide success message and return to info section after a delay
            setTimeout(() => {
                registrationSuccessMessage.classList.remove("show");
                // Allow the animation to finish before changing display to none
                registrationSuccessMessage.addEventListener('transitionend', () => {
                    registrationSuccessMessage.style.display = 'none'; // Ensure it's fully hidden
                    infoSection.style.display = "block"; // Show info section after register
                    registerSubmitBtn.disabled = false; // Aktifkan kembali tombol
                }, { once: true });
            }, 3000); // Display for 3 seconds

            // Reset form fields
            registerNamaLengkapInput.value = "";
            registerUsernameInput.value = "";
            registerPasswordInput.value = "";
            registerNoWAInput.value = "";
        });


        function formatRupiah(angka) {
            const formatter = new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0
            });
            return formatter.format(angka);
        }

        function logout() {
            currentUser = null;
            loginOverlay.style.display = "none";
            registerOverlay.style.display = "none"; // Pastikan register overlay juga tersembunyi
            historyOverlay.style.display = "none";
            rankingOverlay.style.display = "none";
            withdrawOverlay.style.display = "none";
            userDataDisplay.style.display = "none";
            rankingContainer.style.display = "none";
            infoSection.style.display = "none"; // Hide info section initially
            showNavbarElements();
            registrationSuccessMessage.classList.remove("show"); // Sembunyikan pesan sukses jika terlihat
            // Stop background music if it's playing
            if (backgroundMusic) {
                backgroundMusic.pause();
                backgroundMusic.currentTime = 0; // Reset to start
            }
        }

        // EVENT LISTENER FOR SPLASH SCREEN BUTTON
        openContentBtn.addEventListener('click', () => {
            // Memutar musik saat tombol diklik
            if (backgroundMusic) {
                backgroundMusic.play().catch(error => {
                    console.error("Autoplay prevented:", error);
                });
            }

            splashScreen.classList.add('hidden'); // Mulai animasi fade-out splash screen
            // Setelah animasi selesai, tampilkan main content
            splashScreen.addEventListener('transitionend', () => {
                splashScreen.style.display = 'none'; // Sembunyikan sepenuhnya setelah transisi
                mainContent.style.display = 'flex'; // Tampilkan konten utama
                setTimeout(() => {
                    mainContent.classList.add('visible'); // Aktifkan animasi fade-in konten utama
                    infoSection.style.display = "block"; // Tampilkan info section secara default
                }, 10); // Sedikit delay agar transisi display:none dan opacity bekerja
            }, { once: true }); // Pastikan event listener hanya dijalankan sekali
        });


        // Sembunyikan semua konten utama secara default saat halaman dimuat
        document.addEventListener('DOMContentLoaded', (event) => {
            mainContent.style.display = 'none'; // Sembunyikan mainContent
            mainContent.classList.remove('visible'); // Pastikan tidak ada class visible di awal
            // Splash screen akan terlihat secara default karena display: flex
            showNavbarElements(); // Pastikan navbar dalam keadaan default (tombol terlihat)
            registrationSuccessMessage.style.display = "none"; // Ensure success message is hidden initially
        });
