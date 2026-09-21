// =====================================================
// 1. TYPEWRITER EFFECT CONFIGURATION
// =====================================================
const words = ["Full-Stack Developer", "Software Developer", "WordPress Developer","Graphic Designer", "UI/UX Designer"];
let i = 0;
let timer;

function typingEffect() {
    let word = words[i].split("");
    var loopTyping = function() {
        if (word.length > 0) {
            document.getElementById('typewriter').innerHTML += word.shift();
        } else {
            setTimeout(deletingEffect, 2000);
            return false;
        }
        timer = setTimeout(loopTyping, 100);
    };
    loopTyping();
}

function deletingEffect() {
    let word = words[i].split("");
    var loopDeleting = function() {
        if (word.length > 0) {
            word.pop();
            document.getElementById('typewriter').innerHTML = word.join("");
        } else {
            if (words.length > (i + 1)) {
                i++;
            } else {
                i = 0;
            }
            setTimeout(typingEffect, 500);
            return false;
        }
        timer = setTimeout(loopDeleting, 50);
    };
    loopDeleting();
}

// =====================================================
// 2. TOAST SYSTEM (Globally Accessible)
// =====================================================
function showToast(message, type = "info") {
    const toastContainer = document.getElementById("toastContainer");
    if (!toastContainer) return;

    const toast = document.createElement("div");

    let icon = "";
    let border = "";
    let iconColor = "";

    if (type === "success") {
        icon = "fa-circle-check";
        border = "border-green-400";
        iconColor = "text-green-400";
    } else if (type === "error") {
        icon = "fa-circle-xmark";
        border = "border-red-400";
        iconColor = "text-red-400";
    } else if (type === "warning") {
        icon = "fa-triangle-exclamation";
        border = "border-yellow-400";
        iconColor = "text-yellow-400";
    } else {
        icon = "fa-circle-info";
        border = "border-cyan-400";
        iconColor = "text-cyan-400";
    }

    toast.className = `
        pointer-events-auto
        bg-[#121826] dark:bg-white
        border
        ${border}
        rounded-xl
        px-5
        py-4
        shadow-2xl
        flex
        items-center
        gap-3
        text-white dark:text-gray-900
        transform
        -translate-y-10
        opacity-0
        transition-all
        duration-300
    `;

    toast.innerHTML = `
        <i class="fa-solid ${icon} ${iconColor} text-xl"></i>
        <span class="text-sm font-medium">${message}</span>
    `;

    toastContainer.appendChild(toast);

    requestAnimationFrame(function () {
        toast.classList.remove("-translate-y-10", "opacity-0");
    });

    setTimeout(function () {
        toast.classList.add("-translate-y-10", "opacity-0");
        setTimeout(function () {
            toast.remove();
        }, 300);
    }, 5000); // Notification ko 5 seconds screen par rokne ke liye
}

// =====================================================
// 3. RESUME DOWNLOAD FUNCTION
// =====================================================
function downloadResume(event) {
    event.preventDefault(); 
    const fileUrl = "assets/Curriculum Vitae.pdf"; 
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = "Usama-Hasnat-CV.pdf"; 
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("CV downloaded successfully!", "success");
}

// =====================================================
// 4. MAIN DOM CONTENT LOADED EVENT LISTENERS
// =====================================================
document.addEventListener("DOMContentLoaded", () => {
    typingEffect();

    // CV Buttons Listeners
    const downloadResumeBtn = document.getElementById("downloadResumeBtn");
    const mobileDownloadResumeBtn = document.getElementById("mobileDownloadResumeBtn");

    if (downloadResumeBtn) downloadResumeBtn.addEventListener("click", downloadResume);
    if (mobileDownloadResumeBtn) mobileDownloadResumeBtn.addEventListener("click", downloadResume);

// =====================================================
// MOBILE MENU TOGGLE & AUTO CLOSE LOGIC
// =====================================================
const menuBtn = document.getElementById('menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

if (menuBtn && mobileMenu) {
    // 1. Hamburger menu button click karne par open/close toggle karein
    menuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });

    // 2. Menu ke kisi bhi link ya download button par click hote hi menu close ho jaye
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden'); // Link click hote hi menu ko hide kar dega
        });
    });
}


   // Dark Mode Toggle Logic
const themeToggleBtn = document.getElementById('theme-toggle');
const themeToggleMobileBtn = document.getElementById('theme-toggle-mobile');

const sunIcon = document.getElementById('theme-toggle-sun');
const moonIcon = document.getElementById('theme-toggle-moon');
const sunIconMobile = document.getElementById('theme-toggle-sun-mobile');
const moonIconMobile = document.getElementById('theme-toggle-moon-mobile');

function updateIcons(isDark) {
    if (isDark) {
        document.documentElement.classList.add('dark');
        if (sunIcon) sunIcon.classList.remove('hidden');
        if (moonIcon) moonIcon.classList.add('hidden');
        if (sunIconMobile) sunIconMobile.classList.remove('hidden');
        if (moonIconMobile) moonIconMobile.classList.add('hidden');
    } else {
        document.documentElement.classList.remove('dark');
        if (sunIcon) sunIcon.classList.add('hidden');
        if (moonIcon) moonIcon.classList.remove('hidden');
        if (sunIconMobile) sunIconMobile.classList.add('hidden');
        if (moonIconMobile) moonIconMobile.classList.remove('hidden');
    }
}

// Check local storage or system preference
const isDarkMode = localStorage.getItem('color-theme') === 'dark' || 
    (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);

updateIcons(isDarkMode);

// Event Listeners for both Desktop and Mobile Toggle buttons
if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', toggleTheme);
}
if (themeToggleMobileBtn) {
    themeToggleMobileBtn.addEventListener('click', toggleTheme);
}

function toggleTheme() {
    const isDark = document.documentElement.classList.contains('dark');
    if (isDark) {
        localStorage.setItem('color-theme', 'light');
        updateIcons(false);
    } else {
        localStorage.setItem('color-theme', 'dark');
        updateIcons(true);
    }
}

    // =====================================================
    // 5. REAL-TIME CONTACT FORM HANDLING VIA EMAILJS (FIXED)
    // =====================================================
    const contactForm = document.getElementById("contact-form");
    const sendBtn = document.getElementById("sendBtn");
    const btnText = document.getElementById("btnText");

    if (contactForm) {
        contactForm.addEventListener("submit", function (event) {
            event.preventDefault(); // Page reload hone se rokna

            // Button ko loading state par le jana
            if (sendBtn) sendBtn.disabled = true;
            if (btnText) btnText.innerText = "Sending Message...";

            // Aapki verified IDs
            const serviceID = "service_34iowym";
            const templateID = "template_pwua54k";

            // Form data ko collect karke parameters banana taake accuracy 100% ho
            const templateParams = {
                user_name: document.getElementById("user_name").value,
                user_email: document.getElementById("user_email").value,
                message: document.getElementById("user_message").value
            };

            // sendForm ki jagah send use kar rahe hain jo variables ko direct inject karta hai
            emailjs.send(serviceID, templateID, templateParams)
                .then(() => {
                    // Success Scenario
                    showToast("Your message was sent successfully! Expect a reply within 24 hours.", "success");
                    contactForm.reset(); // Form fields ko khali karna
                }, (err) => {
                    // Error Scenario
                    showToast("Failed to send message. Code: " + err.status + " - " + err.text, "error");
                    console.error("EmailJS Detailed Error:", err);
                })
                .finally(() => {
                    // Button ko wapis normal state mein lana
                    if (sendBtn) sendBtn.disabled = false;
                    if (btnText) btnText.innerText = "Send Message";
                });
        });

    // =====================================================
    // 6. NEWSLETTER SYSTEM WITH LOCALSTORAGE & EMAILJS TOGGLE
    // =====================================================
    const newsletterForm = document.getElementById("newsletterForm");
    const newsletterEmail = document.getElementById("newsletterEmail");
    const newsletterBtn = document.getElementById("newsletterBtn");
    const newsletterBtnText = document.getElementById("newsletterBtnText");
    const newsletterIcon = document.getElementById("newsletterIcon");

    // Static Variable Identifiers
    const serviceID = "service_34iowym";
    const newsletterTemplateID = "template_4r5cn8q"; // Sial Brother, yahan apni nayi template ID paste kar dena

    // Page load hote hi check karna ke kya user pehle se subscribed hai?
    function checkSubscriptionStatus() {
        const isSubscribed = localStorage.getItem("portfolio_subscribed");
        const savedEmail = localStorage.getItem("portfolio_subscriber_email");

        if (isSubscribed === "true" && newsletterBtn) {
            // Button ko Grey state mein convert karna (Enabled hi rahega)
            newsletterBtn.className = "w-full bg-gray-500 hover:bg-gray-600 text-white font-bold text-sm py-3.5 rounded-xl transition-all shadow-md transform active:scale-[0.98] flex items-center justify-center gap-2";
            if (newsletterBtnText) newsletterBtnText.innerText = "Unsubscribe";
            if (newsletterIcon) newsletterIcon.className = "fa-solid fa-bell-slash text-xs";
            if (newsletterEmail) {
                newsletterEmail.value = savedEmail || "";
                newsletterEmail.disabled = true; // Subscribed user bar-bar email change na kare
            }
        } else if (newsletterBtn) {
            // Wapis default Cyan gradient active karna
            newsletterBtn.className = "w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold text-sm py-3.5 rounded-xl transition-all shadow-lg shadow-cyan-500/20 transform active:scale-[0.98] flex items-center justify-center gap-2";
            if (newsletterBtnText) newsletterBtnText.innerText = "Subscribe";
            if (newsletterIcon) newsletterIcon.className = "fa-solid fa-paper-plane text-xs";
            if (newsletterEmail) {
                newsletterEmail.disabled = false;
                newsletterEmail.value = "";
            }
        }
    }

    // Form Submission Behavior
    if (newsletterForm) {
        newsletterForm.addEventListener("submit", function (event) {
            event.preventDefault(); // Default submission reload rokna

            const isSubscribed = localStorage.getItem("portfolio_subscribed") === "true";
            const emailValue = newsletterEmail.value;

            // Loader State handler
            if (newsletterBtnText) newsletterBtnText.innerText = isSubscribed ? "Processing Unsubscribe..." : "Processing Subscribe...";
            if (newsletterBtn) newsletterBtn.disabled = true;

            // Configuration dynamic values mapping
            const currentStatus = isSubscribed ? "Unsubscribed" : "Subscribed";
            const currentTime = new Date().toLocaleString("en-PK", { timeZone: "Asia/Karachi" });

            const templateParams = {
                user_email: emailValue,
                status: currentStatus,
                time: currentTime
            };

            // EmailJS API Integration hit
            emailjs.send(serviceID, newsletterTemplateID, templateParams)
                .then(() => {
                    if (!isSubscribed) {
                        // Action: SUBSCRIBE SCENARIO
                        localStorage.setItem("portfolio_subscribed", "true");
                        localStorage.setItem("portfolio_subscriber_email", emailValue);
                        showToast("You have successfully subscribed to my updates!", "success");
                    } else {
                        // Action: UNSUBSCRIBE SCENARIO
                        localStorage.removeItem("portfolio_subscribed");
                        localStorage.removeItem("portfolio_subscriber_email");
                        showToast("You have successfully unsubscribed from the updates.", "warning");
                    }
                    
                    // UI refresh dynamically
                    checkSubscriptionStatus();
                })
                .catch((err) => {
                    showToast("Newsletter error occurred. Please try again later.", "error");
                    console.error("Newsletter system glitch:", err);
                    
                    // Revert button text back in case of error failure
                    if (newsletterBtnText) newsletterBtnText.innerText = isSubscribed ? "Unsubscribe" : "Subscribe";
                })
                .finally(() => {
                    if (newsletterBtn) newsletterBtn.disabled = false;
                });
        });
    }

    // Script parsing load execution sequence hook inside main listener tree
    checkSubscriptionStatus();

    }
});