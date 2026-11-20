const menu = document.querySelector('.menu');
const navigation = document.querySelector('#navigation');
menu.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded', String(open)); navigation.classList.toggle('open', open); });
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', () => { menu.setAttribute('aria-expanded', 'false'); navigation.classList.remove('open'); }));
document.addEventListener('keydown', event => { if(event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true'){menu.setAttribute('aria-expanded','false');navigation.classList.remove('open');menu.focus();} });
document.querySelector('#year').textContent = new Date().getFullYear();
document.querySelector('#enquiry-form').addEventListener('submit', event => {
  event.preventDefault();
  if (!event.currentTarget.reportValidity()) return;
  const data = new FormData(event.currentTarget);
  const clean = key => String(data.get(key) || '').trim();
  const subject = `Commercial enquiry — ${clean('interest')} — ${clean('company').replace(/[\r\n]/g, ' ')}`;
  const body = `Name: ${clean('name')}\nCompany: ${clean('company')}\nEmail: ${clean('email')}\nArea of interest: ${clean('interest')}\n\nRequirements:\n${clean('message')}`;
  document.querySelector('#prepared-enquiry').value = `To: info@nbkdiesel.com\nSubject: ${subject}\n\n${body}`;
  document.querySelector('#enquiry-preview').hidden = false;
  const status = document.querySelector('#form-status');
  status.textContent = 'Enquiry prepared for info@nbkdiesel.com. Nothing has been sent. Review and send it in your email app, or use the copy below.';
  const target = `mailto:info@nbkdiesel.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  // Long mailto links are not handled reliably by every browser and email app.
  if (target.length > 1800) {
    status.textContent = 'Enquiry prepared. Your message is too long to open reliably in every email app. Copy the text below and email it to info@nbkdiesel.com. Nothing has been sent.';
    return;
  }
  try { window.location.href = target; }
  catch { status.textContent = 'Enquiry prepared, but your email app could not be opened. Copy the text below and email it to info@nbkdiesel.com. Nothing has been sent.'; }
});
document.querySelector('#copy-enquiry').addEventListener('click', async () => {
  const field = document.querySelector('#prepared-enquiry');
  const status = document.querySelector('#form-status');
  try {
    if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
    await navigator.clipboard.writeText(field.value);
    status.textContent = 'Enquiry copied. Paste it into your email app and send it to info@nbkdiesel.com. Nothing has been sent by this website.';
  } catch {
    field.focus(); field.select();
    status.textContent = 'Select and copy the highlighted enquiry, then email it to info@nbkdiesel.com. Nothing has been sent.';
  }
});
