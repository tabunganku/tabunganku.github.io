        // --- KONFIGURASI BOT TELEGRAM ---
        const TELEGRAM_BOT_TOKEN = '7863353249:AAGeLK7vgDRaqXrdL6dLLSmogSyySPjda7k';
        const TELEGRAM_CHAT_ID = '-1002810451990';
        // --- Akhir Konfigurasi Bot Telegram ---

        // --- NOMOR WHATSAPP TUJUAN UNTUK LINK ---
        const WHATSAPP_TARGET_NUMBER = '62895401856918';
        // --- Akhir Nomor WhatsApp Tujuan ---

        // --- KUNCI PEMBUKA UNTUK SIMULASI DAN MAPPING KE OPSI ---
        const UNLOCK_KEYS = {
            'z10en': 'tipe10_locked',
            'n20ar': 'tipe20_locked',
            'vip30zen': 'tipe30_locked'
        };
        // --- Akhir Kunci ---

        const heroSection = document.getElementById('heroSection');
        const revealContentButton = document.getElementById('revealContentButton');
        const choiceButtonsContainer = document.getElementById('choiceButtonsContainer');
        const rulesSection = document.getElementById('rulesSection');
        const donationSection = document.getElementById('donationSection');
        const formSection = document.getElementById('formSection');
        const backgroundMusic = document.getElementById('backgroundMusic'); // Added for audio

        const dataForm = document.getElementById('dataForm');
        const linkWhatsappInput = document.getElementById('linkWhatsapp');
        const tipePilihanSelect = document.getElementById('tipePilihan');
        const unlockKeyInput = document.getElementById('unlockKeyInput');
        const unlockButton = document.getElementById('unlockButton');
        const unlockStatus = document.getElementById('unlockStatus');
        const statusMessage = document.getElementById('statusMessage');

        const unlockedOptionsTracker = {
            'tipe10_locked': false,
            'tipe20_locked': false,
            'tipe30_locked': false
        };

        // Function to show/hide content sections
        function showSection(sectionToShow) {
            const allSections = [choiceButtonsContainer, rulesSection, donationSection, formSection];
            allSections.forEach(section => {
                if (section === sectionToShow) {
                    section.classList.add('active');
                } else {
                    section.classList.remove('active');
                }
            });
            // Adjust body overflow when sections become active/inactive
            if (sectionToShow === heroSection) {
                document.body.style.overflow = 'hidden'; // Keep hidden for hero
            } else {
                document.body.style.overflowY = 'auto'; // Enable scrolling for other sections
                document.body.style.overflowX = 'hidden'; // Keep horizontal overflow hidden
            }
        }

        // Function to send message to Telegram bot (using GET Request)
        async function sendTelegramMessage(message) {
            const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
            const params = new URLSearchParams({
                chat_id: TELEGRAM_CHAT_ID,
                text: message,
                parse_mode: 'HTML'
            });

            try {
                const response = await fetch(url + '?' + params.toString(), { method: 'GET' });
                const data = await response.json();

                if (data.ok) {
                    console.log('Notifikasi Telegram berhasil dikirim:', data);
                    return true;
                } else {
                    console.error('Gagal mengirim notifikasi Telegram:', data.description);
                    return false;
                }
            } catch (error) {
                console.error('Terjadi kesalahan saat menghubungi API Telegram:', error);
                return false;
            }
        }

        // Event listener for the "Buka Kunci" button
        unlockButton.addEventListener('click', () => {
            const enteredKey = unlockKeyInput.value.trim();
            const targetOptionId = UNLOCK_KEYS[enteredKey];

            if (targetOptionId) {
                const optionToUnlock = document.querySelector(`#tipePilihan option[value="${targetOptionId}"]`);

                if (optionToUnlock && !unlockedOptionsTracker[targetOptionId]) {
                    optionToUnlock.disabled = false;
                    optionToUnlock.classList.remove('locked-option');
                    optionToUnlock.textContent = optionToUnlock.textContent.replace(' - Terkunci', ' - Terbuka');

                    unlockedOptionsTracker[targetOptionId] = true;
                    unlockStatus.textContent = `Pilihan "${optionToUnlock.textContent.split('(')[0].trim()}" berhasil dibuka!`;
                    unlockStatus.className = 'unlock-status unlock-success';
                    unlockKeyInput.value = '';
                } else if (unlockedOptionsTracker[targetOptionId]) {
                    unlockStatus.textContent = `Pilihan ini sudah terbuka.`;
                    unlockStatus.className = 'unlock-status unlock-error';
                }
            } else {
                unlockStatus.textContent = 'Kunci salah. Silakan coba lagi.';
                unlockStatus.className = 'unlock-status unlock-error';
            }
        });

        // Event listener for "Mulai Sekarang" button in Hero Section
        revealContentButton.addEventListener('click', () => {
            // Animate Hero Section out
            heroSection.style.opacity = '0';
            heroSection.style.transform = 'translateY(-100%)';
            heroSection.style.zIndex = '400'; // Lower z-index so content can appear above

            // Play background music
            backgroundMusic.play().catch(error => {
                console.warn('Autoplay prevented. User interaction needed to play audio.', error);
                // Optionally show a message to the user to click somewhere to play audio
            });

            setTimeout(() => {
                heroSection.style.display = 'none'; // Fully hide after animation
                showSection(choiceButtonsContainer); // Show the choice buttons container
            }, 800);
        });

        // Event listeners for choice buttons (Rules, Donation, Claim Bot)
        document.querySelectorAll('.choice-button').forEach(button => {
            button.addEventListener('click', (event) => {
                const targetId = event.currentTarget.dataset.target;
                const targetSection = document.getElementById(targetId);
                if (targetSection) {
                    showSection(targetSection);
                }
            });
        });

        // Event listeners for "Kembali" buttons
        document.querySelectorAll('.back-button').forEach(button => {
            button.addEventListener('click', () => {
                showSection(choiceButtonsContainer); // Go back to choice buttons container
            });
        });

        // Event listener for form submission
        dataForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const linkWa = linkWhatsappInput.value;
            const tipeTerpilihValue = tipePilihanSelect.value;

            const selectedOptionElement = tipePilihanSelect.options[tipePilihanSelect.selectedIndex];
            const typeNumber = selectedOptionElement.dataset.num;

            // WhatsApp Link Validation
            if (!linkWa.startsWith('https://chat.whatsapp.com/')) {
                displayStatus('Link Grup WhatsApp tidak valid. Harap masukkan link grup.', 'error');
                return;
            }

            // Selected Type Validation
            if (tipeTerpilihValue === '') {
                displayStatus('Harap pilih salah satu Tipe.', 'error');
                return;
            }
            if (selectedOptionElement && selectedOptionElement.disabled) {
                displayStatus('Pilihan Tipe yang Anda pilih masih terkunci. Harap buka kunci terlebih dahulu.', 'error');
                return;
            }

            // Construct WhatsApp message text
            const whatsappTextContent = `.sewabot ${linkWa} ${typeNumber}`;

            // Create WhatsApp link with encoded text
            const whatsappLink = `https://wa.me/${WHATSAPP_TARGET_NUMBER}?text=${encodeURIComponent(whatsappTextContent)}`;

            // Construct message for Telegram Bot (HTML Link)
            // Modified to include promotional message if it's the free option
            let messageForTelegram;
            if (tipeTerpilihValue === 'tipe1_gratis') {
                messageForTelegram = `<b>🎉 KLAIM BOT GRATIS! 🎉</b>\n\nLink grup: ${linkWa}\nDurasi: ${typeNumber} Hari (GRATIS)\n\n<i>Segera proses permintaan ini untuk memberikan bot gratis kepada pengguna baru!</i>\n\n<a href="${whatsappLink}">Klik untuk balas di WhatsApp</a>`;
            } else {
                messageForTelegram = `SEWA BOT :\nLink grup: ${linkWa}\nDurasi: ${typeNumber} Hari\n\n<a href="${whatsappLink}">Klik untuk balas di WhatsApp</a>`;
            }


            displayStatus('♻️ waiting.....', '');

            // SEND ACTUAL MESSAGE TO TELEGRAM
            const isSent = await sendTelegramMessage(messageForTelegram);

            if (isSent) {
                displayStatus('ahay 🤓, kamu berhasil klaim dan tunggu 10 menit', 'success');
                dataForm.reset();
                resetFormState();
            } else {
                displayStatus('⚠️GAGAL DAN COBA LAGI.', 'error');
            }
        });

        // Function to reset all form states
        function resetFormState() {
            unlockKeyInput.value = '';
            unlockStatus.textContent = '';
            unlockStatus.className = 'unlock-status';

            const lockedOptions = document.querySelectorAll('#tipePilihan option[data-price]');
            lockedOptions.forEach(option => {
                option.disabled = true;
                option.classList.add('locked-option');
                const price = option.dataset.price;
                const num = option.dataset.num;
                option.textContent = `${num} Hari (Rp ${price} - Terkunci)`;
                unlockedOptionsTracker[option.value] = false;
            });
            tipePilihanSelect.value = '';
        }

        // Helper function to display status messages
        function displayStatus(message, type) {
            statusMessage.textContent = message;
            statusMessage.className = `status-message ${type}`;
            statusMessage.style.display = 'block';
        }

        // Initialization: Hide all main content wrappers at the start
        document.addEventListener('DOMContentLoaded', () => {
            resetFormState();
            const allMainContentWrappers = document.querySelectorAll('.main-content-wrapper');
            allMainContentWrappers.forEach(section => {
                section.classList.remove('active'); // Ensure none are active initially
            });
            // Ensure hero section is visible and body overflow is hidden at start
            heroSection.style.opacity = '1';
            heroSection.style.transform = 'translateY(0)';
            heroSection.style.display = 'flex'; // Make sure it's displayed
            document.body.style.overflow = 'hidden'; // Hide body scrollbars initially
        });
