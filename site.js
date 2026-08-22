(function () {
  "use strict";

  const config = window.CFO_SITE_CONFIG || {};
  const consentKey = "cfo-cookie-consent";

  function track(eventName, parameters) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: eventName, ...(parameters || {}) });
  }

  function loadAnalytics() {
    const id = String(config.gaMeasurementId || "").trim();
    if (!/^G-[A-Z0-9]+$/i.test(id) || document.querySelector(`script[data-ga-id="${id}"]`)) return;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", id, { anonymize_ip: true });
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
    script.dataset.gaId = id;
    document.head.appendChild(script);
  }

  function addCookieBanner() {
    const saved = localStorage.getItem(consentKey);
    if (saved === "accepted") loadAnalytics();
    if (saved) return;

    const banner = document.createElement("div");
    banner.className = "cookie-banner";
    banner.setAttribute("role", "dialog");
    banner.setAttribute("aria-label", "Cookie preferences");
    banner.innerHTML = `
      <div>
        <strong>Your privacy matters</strong>
        <p>We use essential cookies to run this website. Optional analytics cookies are used only with your permission. Read our <a href="/cookie-policy">Cookie Policy</a>.</p>
      </div>
      <div class="cookie-actions">
        <button type="button" class="btn btn-secondary btn-sm" data-cookie="reject">Reject optional</button>
        <button type="button" class="btn btn-primary btn-sm" data-cookie="accept">Accept analytics</button>
      </div>`;
    document.body.appendChild(banner);
    banner.querySelectorAll("[data-cookie]").forEach((button) => {
      button.addEventListener("click", () => {
        const accepted = button.dataset.cookie === "accept";
        localStorage.setItem(consentKey, accepted ? "accepted" : "rejected");
        if (accepted) loadAnalytics();
        banner.remove();
      });
    });
  }

  function setupInsightNavigation() {
    const toggle = document.getElementById("mobileInsightsToggle");
    const submenu = document.getElementById("mobileInsightsSub");
    if (!toggle || !submenu || toggle.dataset.ready === "true") return;

    toggle.dataset.ready = "true";
    toggle.addEventListener("click", () => {
      const willOpen = !submenu.classList.contains("open");
      submenu.classList.toggle("open", willOpen);
      toggle.setAttribute("aria-expanded", String(willOpen));
      toggle.setAttribute("aria-label", willOpen ? "Hide Insights pages" : "Show Insights pages");
    });
  }

  function addWhatsAppButton() {
    if (document.querySelector(".whatsapp-float")) return;
    const link = document.createElement("a");
    link.className = "whatsapp-float";
    link.href = "https://wa.me/447743468656";
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.setAttribute("aria-label", "Chat with CFO Accounting on WhatsApp");
    link.innerHTML = `<svg viewBox="0 0 32 32" aria-hidden="true"><path fill="currentColor" d="M16.04 3C8.85 3 3 8.73 3 15.78c0 2.25.6 4.45 1.74 6.38L3 29l7.03-1.81a13.2 13.2 0 0 0 6 1.5h.01C23.23 28.69 29 22.96 29 15.9 29 8.83 23.24 3 16.04 3Zm7.65 18.07c-.32.89-1.88 1.7-2.6 1.81-.67.11-1.52.16-2.45-.13-.57-.18-1.3-.42-2.23-.82-3.92-1.66-6.48-5.54-6.68-5.8-.2-.25-1.59-2.08-1.59-3.97 0-1.89 1.01-2.82 1.37-3.21.36-.39.79-.49 1.05-.49h.76c.24.01.57-.09.89.66.32.76 1.09 2.63 1.19 2.82.1.19.16.42.03.68-.13.25-.2.41-.39.63-.2.22-.41.49-.59.66-.2.19-.4.4-.17.79.23.39 1.02 1.65 2.19 2.67 1.51 1.31 2.78 1.71 3.17 1.9.39.19.62.16.85-.1.23-.25.98-1.12 1.24-1.5.26-.38.52-.32.88-.19.36.13 2.29 1.06 2.68 1.25.39.19.65.29.75.45.1.16.1.92-.22 1.81Z"/></svg>`;
    link.addEventListener("click", () => track("whatsapp_click", { link_url: link.href }));
    document.body.appendChild(link);
  }

  document.addEventListener("click", (event) => {
    const link = event.target.closest("a");
    if (!link) return;
    if (link.href.startsWith("tel:")) track("phone_click", { link_url: link.href });
    if (link.href.startsWith("mailto:")) track("email_click", { link_url: link.href });
  });

  document.addEventListener("submit", async (event) => {
    const form = event.target.closest("form[data-live-form]");
    if (!form) return;
    event.preventDefault();
    event.stopImmediatePropagation();

    const consent = form.querySelector('input[name="privacyConsent"]');
    const status = form.querySelector(".form-status");

    if (!form.checkValidity()) {
      if (status) status.textContent = "Please complete the required fields before sending.";
      form.reportValidity();
      return;
    }

    if (consent && !consent.checked) {
      if (status) status.textContent = "Please confirm that you have read the Privacy Policy.";
      consent.focus();
      return;
    }

    const submit = form.querySelector('[type="submit"]');
    if (submit) submit.disabled = true;
    if (status) status.textContent = "Sending your enquiry...";

    const payload = Object.fromEntries(new FormData(form).entries());
    if (!form.dataset.submissionId) {
      form.dataset.submissionId = (window.crypto && typeof window.crypto.randomUUID === "function")
        ? window.crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
    }
    payload.submissionId = form.dataset.submissionId;

    try {
      const response = await fetch(form.dataset.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.message || "Your enquiry could not be sent.");
      track("generate_lead", { form_name: form.id || "website_form" });
      window.location.assign("/thank-you");
    } catch (error) {
      if (status) status.textContent = `${error.message} Please call +44 77491 597650 or email consult@cfoaccounting.co.uk.`;
      if (submit) submit.disabled = false;
    }
  }, true);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      setupInsightNavigation();
      addCookieBanner();
      addWhatsAppButton();
    });
  } else {
    setupInsightNavigation();
    addCookieBanner();
    addWhatsAppButton();
  }
})();
