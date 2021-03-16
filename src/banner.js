import bannerHtml from './banner.html';
import bannerCss from './style.scss';

function hideCookieBanner() {
  document.getElementById('cookiebanner').style.display = 'none';
}

function showCookieConfirmation(confirmationMessage) {
  document.getElementById('nhsuk-cookie-confirmation-banner').hidden = false;
  document.getElementById('govuk-cookie-banner__message').innerHTML = confirmationMessage;
}

function addFocusCookieConfirmation() {
  const cookieConfirmationMessage = document.getElementById('nhsuk-success-banner__message');
  cookieConfirmationMessage.setAttribute('tabIndex', '-1');
  cookieConfirmationMessage.focus();
}

function removeFocusCookieConfirmation() {
  const cookieConfirmationMessage = document.getElementById('nhsuk-success-banner__message');
  cookieConfirmationMessage.addEventListener('blur', () => {
    cookieConfirmationMessage.removeAttribute('tabIndex');
  });
}

function hideCookieConfirmation() {
  const cookieBannerCloseButton = document.getElementById('govuk-cookie-banner__close');
  cookieBannerCloseButton.addEventListener('click', () => {
    document.getElementById('nhsuk-cookie-confirmation-banner').hidden = true;
  })
}

/**
 * Call common methods on link click as well as consent type callback
 * @param {function} consentCallback callback to be called based on which link has been clicked.
 */
function handleLinkClick(consentCallback, confirmationMessage) {
  hideCookieBanner();
  consentCallback();
  showCookieConfirmation(confirmationMessage);
  addFocusCookieConfirmation();
  removeFocusCookieConfirmation();
  hideCookieConfirmation();
}

/**
 * Insert the cookie banner at the top of a page.
 * @param {function} onAccept callback that is called when necessary consent is accepted.
 * @param {function} onAnalyticsAccept callback that is called analytics consent is accepted.
 * @param {function} hitLoggingUrl function that is makes request to logging URL.
 */
export default function insertCookieBanner(onAccept, onAnalyticsAccept, hitLoggingUrl) {
  // add a css block to the inserted html
  const div = document.createElement('div');
  div.innerHTML = bannerHtml;
  div.innerHTML += `<style>${bannerCss.toString()}</style>`;
  document.body.insertBefore(div, document.body.firstChild);
  hitLoggingUrl('seen');

  document.getElementById('nhsuk-cookie-banner__link_accept').addEventListener('click', (e) => {
    e.preventDefault();
    hitLoggingUrl('declined');
    const confirmationMessage = 'You have rejected additional cookies.';
    handleLinkClick(onAccept, confirmationMessage);
  });

  document.getElementById('nhsuk-cookie-banner__link_accept_analytics').addEventListener('click', (e) => {
    e.preventDefault();
    hitLoggingUrl('accepted');
    const confirmationMessage = 'You have accepted additional cookies.';
    handleLinkClick(onAnalyticsAccept, confirmationMessage);
  });
}
