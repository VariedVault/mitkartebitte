import { el, backLink } from '../ui/components.js';
import { navigate } from '../router.js';

function pageShell(title) {
  const container = el('div', {});
  container.appendChild(backLink('Back to map', () => navigate('')));
  container.appendChild(el('h1', {}, title));
  const card = el('div', { class: 'card', style: 'max-width:720px' });
  container.appendChild(card);
  return { container, card };
}

function section(card, heading) {
  if (heading) card.appendChild(el('h3', {}, heading));
}

function paras(card, texts) {
  for (const t of [].concat(texts)) card.appendChild(el('p', { style: 'color:var(--ink-soft);line-height:1.6' }, t));
}

function englishNote(card, texts) {
  const box = el('div', { class: 'rule-box' });
  box.appendChild(el('p', { style: 'margin:0 0 4px;font-size:11px;letter-spacing:.05em;text-transform:uppercase;color:var(--ink-soft)' }, 'English summary (informal — the German text above is legally binding)'));
  for (const t of [].concat(texts)) box.appendChild(el('p', { style: 'margin:6px 0 0' }, t));
  card.appendChild(box);
}

// ---------------------------------------------------------------- Impressum

export async function renderImpressum(container) {
  const { container: root, card } = pageShell('Impressum');
  container.innerHTML = '';
  container.appendChild(root);

  card.appendChild(el('p', { style: 'font-family:var(--font-mono);font-size:12px;letter-spacing:.04em;text-transform:uppercase;color:var(--ink-soft)' }, 'Angaben gemäß § 5 DDG'));

  const identity = el('div', { style: 'font-family:var(--font-mono);font-size:14px;line-height:1.7;margin:10px 0 20px' });
  identity.appendChild(el('div', {}, 'Balaji Jayakumar'));
  identity.appendChild(el('div', {}, 'Pasewalker Str.'));
  identity.appendChild(el('div', {}, '13127 Berlin'));
  identity.appendChild(el('div', {}, 'Deutschland'));
  card.appendChild(identity);

  section(card, 'Kontakt');
  card.appendChild(
    el('p', { style: 'color:var(--ink-soft)' }, ['E-Mail: ', el('a', { href: 'mailto:balaji.jayakumar17@gmail.com', style: 'color:var(--gold)' }, 'balaji.jayakumar17@gmail.com')])
  );

  paras(card, 'Kleinunternehmer gemäß § 19 UStG — keine Umsatzsteuer-Identifikationsnummer.');

  section(card, 'Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV');
  paras(card, 'Balaji Jayakumar (Anschrift wie oben)');

  section(card, 'Haftung für Inhalte');
  paras(
    card,
    'Als Diensteanbieter sind wir gemäß § 7 Abs. 1 DDG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 DDG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen. Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.'
  );
  englishNote(
    card,
    'As a service provider, we are responsible for our own content on these pages under general law. We are not obligated to monitor third-party information we transmit or store, or to investigate circumstances pointing to illegal activity. Obligations to remove or block information remain unaffected. Liability is only possible from the point at which a concrete legal violation becomes known. We will remove such content promptly upon becoming aware of it.'
  );

  section(card, 'Haftung für Links');
  paras(
    card,
    'Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar. Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.'
  );
  englishNote(
    card,
    'Our site contains links to external third-party websites over whose content we have no influence, and for which we therefore accept no liability. The respective provider or operator of each linked page is always responsible for its content. Linked pages were checked for legal violations at the time of linking; none were recognizable at that time. Permanent monitoring of linked pages without concrete evidence of a violation is not reasonable. We will remove such links promptly upon becoming aware of a violation.'
  );

  section(card, 'Urheberrecht');
  paras(
    card,
    'Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet. Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.'
  );
  englishNote(
    card,
    'Content and works created by the site operators on these pages are subject to German copyright law. Reproduction, editing, distribution, and any form of use beyond the scope of copyright law require the written consent of the respective author or creator. Downloads and copies of this page are permitted only for private, non-commercial use. Third-party content is marked as such where it was not created by the operator. If you nevertheless become aware of a copyright infringement, please let us know — we will remove such content promptly.'
  );
}

// ---------------------------------------------------------------- Datenschutz

export async function renderDatenschutz(container) {
  const { container: root, card } = pageShell('Datenschutzerklärung');
  container.innerHTML = '';
  container.appendChild(root);

  section(card, '1. Verantwortlicher');
  const identity = el('div', { style: 'font-family:var(--font-mono);font-size:13.5px;line-height:1.7;margin:6px 0 16px;color:var(--ink-soft)' });
  identity.appendChild(el('div', {}, 'Balaji Jayakumar'));
  identity.appendChild(el('div', {}, 'Pasewalker Str., 13127 Berlin, Deutschland'));
  identity.appendChild(el('div', {}, ['E-Mail: ', el('a', { href: 'mailto:balaji.jayakumar17@gmail.com', style: 'color:var(--gold)' }, 'balaji.jayakumar17@gmail.com')]));
  card.appendChild(identity);

  section(card, '2. Grundsatz: keine Datenerhebung durch uns');
  paras(
    card,
    '"mit Karte, bitte" ist eine rein clientseitige Web-App ohne Server-Backend. Es gibt kein Nutzerkonto, keine Registrierung, keine Analyse-Tools (Analytics), keine Cookies und keine Werbung. Wir erheben, speichern oder verarbeiten keinerlei personenbezogene Daten auf unseren Servern — aus dem einfachen Grund, dass es keinen Server gibt, der Daten empfängt.'
  );
  englishNote(card, 'This is a purely client-side app with no backend server. No accounts, no analytics, no cookies, no ads. We have no server to collect data on, so we don’t.');

  section(card, '3. Lokale Datenspeicherung (localStorage)');
  paras(
    card,
    'Ihr Lernfortschritt, Ihre Profile und der Status Ihres Karteikarten-Systems (SRS) werden ausschließlich lokal in Ihrem Browser gespeichert (localStorage). Diese Daten verlassen Ihr Gerät zu keinem Zeitpunkt, werden nicht an uns oder Dritte übertragen und sind für uns nicht einsehbar. Sie haben jederzeit die volle Kontrolle: Sie können Ihre Daten über die Funktionen "Profil zurücksetzen" bzw. "Alle Daten zurücksetzen" in den Einstellungen der App löschen, oder indem Sie die Browserdaten dieser Seite in Ihren Browser-Einstellungen löschen.'
  );
  englishNote(
    card,
    'Your progress, profiles, and SRS state are stored only in your browser’s localStorage. This data never leaves your device, is never transmitted to us or anyone else, and we cannot see it. You can delete it anytime via "Reset this profile" / "Reset all data" in Settings, or by clearing this site’s data in your browser.'
  );

  section(card, '4. Sprachausgabe (Text-to-Speech)');
  paras(
    card,
    'Die App nutzt die im Browser eingebaute SpeechSynthesis-Schnittstelle, um deutsche Wörter und Sätze vorzulesen. Je nach Betriebssystem und Browser kann die Sprachausgabe von einem Dienst des jeweiligen Betriebssystem- oder Browser-Herstellers (z. B. Apple, Google, Microsoft) erzeugt werden, lokal auf Ihrem Gerät nach dessen eigenen Mechanismen. Wir selbst erhalten dabei keine Daten.'
  );
  englishNote(
    card,
    'The app uses your browser’s built-in SpeechSynthesis API to read German words and sentences aloud. Depending on your OS and browser, pronunciation may be generated by your device manufacturer’s own voice service (e.g. Apple, Google, Microsoft), processed locally on your device by its own mechanisms. We receive no data from this.'
  );

  section(card, '5. Ausgehende Links');
  paras(
    card,
    'Der Footer dieser Seite enthält Links zu externen Seiten (buymeacoffee.com und github.com). Diese werden nur aktiv, wenn Sie ausdrücklich darauf klicken. Für die Datenverarbeitung auf diesen externen Seiten gelten ausschließlich deren eigene Datenschutzerklärungen; wir haben darauf keinen Einfluss.'
  );
  englishNote(card, 'The footer links to buymeacoffee.com and github.com. These are only ever contacted if you click them, and are governed entirely by their own privacy policies.');

  section(card, '6. Schriftarten (Fonts)');
  paras(card, 'Alle Schriftarten dieser Website werden lokal ausgeliefert (self-hosted). Es findet keine Verbindung zu Google-Servern oder anderen externen Schriftarten-Anbietern statt.');
  englishNote(card, 'All fonts on this site are self-hosted. No connection is made to Google or any other external font provider.');

  section(card, '7. Cookies');
  paras(card, 'Diese Website setzt keine Cookies und keine vergleichbaren Tracking-Technologien. Ein Cookie-Banner ist daher nicht erforderlich.');
  englishNote(card, 'This site sets no cookies and no comparable tracking technology. No cookie banner is required.');

  section(card, '8. Ihre Rechte nach der DSGVO');
  paras(
    card,
    'Da sämtliche Daten ausschließlich lokal auf Ihrem Gerät gespeichert und niemals an uns übermittelt werden, haben Sie jederzeit vollständige und alleinige Kontrolle über Ihre Daten. Ihr Recht auf Auskunft (Art. 15 DSGVO) und Löschung (Art. 17 DSGVO) ist dadurch bereits vollumfänglich erfüllt: Sie können Ihre Daten jederzeit selbst einsehen, exportieren oder vollständig löschen (siehe Punkt 3). Da wir keine Daten empfangen, gibt es auf unserer Seite keine Daten, über die wir Auskunft geben oder die wir löschen könnten. Bei Fragen zum Datenschutz erreichen Sie uns unter der oben genannten E-Mail-Adresse.'
  );
  englishNote(
    card,
    'Since all data stays only on your device and is never sent to us, you already have full and sole control over it. Your right to access (Art. 15 GDPR) and erasure (Art. 17 GDPR) is already fully satisfied: you can view, export, or delete your data yourself at any time (see section 3). Because we never receive any data, there is nothing on our end to disclose or delete. Questions? Reach us at the email address above.'
  );

  card.appendChild(el('p', { style: 'margin-top:20px;font-size:11px;color:var(--ink-soft)' }, 'Stand / Last updated: August 2026'));
}

// ---------------------------------------------------------------- Contact

export async function renderContact(container) {
  const { container: root, card } = pageShell('Contact');
  container.innerHTML = '';
  container.appendChild(root);

  card.appendChild(el('p', { style: 'color:var(--ink-soft)' }, 'This is a static site with no backend, so there’s no contact form here (and no third-party form service either) — just a real inbox.'));

  card.appendChild(el('h3', {}, 'Questions or feedback? Email me:'));
  card.appendChild(
    el('p', {}, [el('a', { href: 'mailto:balaji.jayakumar17@gmail.com', style: 'color:var(--gold);font-family:var(--font-mono);font-size:15px' }, 'balaji.jayakumar17@gmail.com')])
  );

  card.appendChild(el('h3', {}, 'Found a bug or have a suggestion?'));
  card.appendChild(
    el('p', {}, [
      'Open an issue on ',
      el('a', { href: 'https://github.com/VariedVault/mitkartebitte/issues', target: '_blank', rel: 'noopener noreferrer', style: 'color:var(--gold)' }, 'GitHub'),
      '.',
    ])
  );
}
