'use strict';
(() => {
  const root = document.documentElement;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!reducedMotion.matches && 'IntersectionObserver' in window) {
    root.classList.add('motion-ready');
    document.querySelectorAll('.stagger').forEach(group => {
      [...group.children].forEach((item, index) => item.style.setProperty('--reveal-delay', `${Math.min(index * 80, 240)}ms`));
    });
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -20px 0px' });
    document.querySelectorAll('.reveal').forEach(item => observer.observe(item));
    window.addEventListener('beforeprint', () => document.querySelectorAll('.reveal').forEach(item => item.classList.add('visible')));
  }
  reducedMotion.addEventListener('change', event => {
    if (event.matches) root.classList.remove('motion-ready');
  });

  const menuButton = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  function closeMenu() {
    mobileNav.hidden = true;
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Ouvrir le menu');
  }
  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    mobileNav.hidden = !open;
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
  });
  mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  window.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
  const desktopMedia = window.matchMedia('(min-width: 681px)');
  desktopMedia.addEventListener('change', event => { if (event.matches) closeMenu(); });
  const header = document.querySelector('.site-header');
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => { header.classList.toggle('scrolled', scrollY > 20); ticking = false; });
      ticking = true;
    }
  }, { passive: true });

  const heroExamples = [
    { user: 'Papa doit renouveler son ordonnance.', answer: 'Je prépare la demande. Vous pourrez la vérifier avant de l’envoyer.', title: 'Demande de rendez-vous', detail: 'Médecin prescripteur · brouillon', status: 'À valider', icon: '#calendar' },
    { user: 'L’ordonnance est restée chez maman.', answer: 'Vous pourrez ajouter sa photo au suivi. Le document sera plus simple à retrouver.', title: 'Ordonnance du proche', detail: 'Document à ajouter au suivi', status: 'À ajouter', icon: '#document' },
    { user: 'Comment garder le fil des prises ?', answer: 'Nous pourrons préparer les rappels à partir du planning prescrit, après vérification.', title: 'Planning des rappels', detail: 'Horaires à vérifier', status: 'À vérifier', icon: '#bell' }
  ];
  const heroTabs = [...document.querySelectorAll('[data-hero-step]')];
  const heroPanel = document.getElementById('hero-conversation');
  if (heroPanel) {
    heroPanel.setAttribute('role', 'tabpanel');
    heroPanel.setAttribute('aria-labelledby', 'hero-tab-0');
  }
  function animateSwap(target) {
    target.classList.remove('content-switch');
    void target.offsetWidth;
    target.classList.add('content-switch');
  }
  function selectHero(index) {
    const example = heroExamples[index];
    heroTabs.forEach((tab, i) => { tab.setAttribute('aria-selected', String(i === index)); tab.tabIndex = i === index ? 0 : -1; });
    heroPanel.setAttribute('aria-labelledby', `hero-tab-${index}`);
    document.getElementById('hero-user').textContent = example.user;
    document.getElementById('hero-answer').textContent = example.answer;
    document.getElementById('hero-task-title').textContent = example.title;
    document.getElementById('hero-task-detail').textContent = example.detail;
    document.getElementById('hero-task-status').textContent = example.status;
    document.getElementById('hero-task-icon').setAttribute('href', example.icon);
    animateSwap(heroPanel);
  }
  heroTabs.forEach((tab, index) => tab.addEventListener('click', () => selectHero(index)));
  function keyboardTabs(tabs, callback, vertical = false) {
    tabs.forEach((tab, index) => tab.addEventListener('keydown', event => {
      let next;
      if (event.key === (vertical ? 'ArrowDown' : 'ArrowRight')) next = (index + 1) % tabs.length;
      if (event.key === (vertical ? 'ArrowUp' : 'ArrowLeft')) next = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next !== undefined) { event.preventDefault(); callback(next); tabs[next].focus(); }
    }));
  }
  keyboardTabs(heroTabs, selectHero);

  const documentDemo = '<div class="demo-document"><div class="document-sheet" aria-hidden="true"><span></span><span></span><span></span><span></span></div><div><strong>Ordonnance du proche</strong><small>Photo du document · aperçu</small></div></div><div class="demo-detail"><span>Un document à retrouver</span><span>Suivi partagé envisagé</span></div>';
  const pharmacyDemo = '<div class="demo-pharmacy"><div><span class="pharmacy-cross" aria-hidden="true">+</span><span>Pharmacie de votre choix<br><small>Destinataire à confirmer</small></span></div><p><svg class="icon"><use href="#document"/></svg> Ordonnance à joindre à la demande</p></div><div class="demo-detail"><span>Transmission envisagée</span><span>À confirmer</span></div>';
  const calendarDemo = '<div class="demo-calendar"><div class="calendar-tile" aria-hidden="true"><small>NOV.</small><strong>15</strong></div><div><p>Préparer le renouvellement</p><span>Échéance fictive renseignée par l’aidant</span></div></div><div class="demo-detail"><span>Demande de rendez-vous</span><span>Brouillon à valider</span></div>';
  const reminderDemo = '<div class="demo-pill-row"><svg class="icon"><use href="#bell"/></svg><strong>Rappel du matin</strong><span>À définir</span><i class="demo-toggle" aria-hidden="true"></i></div><div class="demo-pill-row"><svg class="icon"><use href="#bell"/></svg><strong>Rappel du soir</strong><span>À définir</span><i class="demo-toggle" aria-hidden="true"></i></div><div class="demo-detail"><span>Selon le planning prescrit</span><span>À vérifier</span></div>';
  const modules = [
    { title: 'L’ordonnance,<br>au même endroit.', shortTitle: 'Retrouver l’ordonnance', demo: documentDemo, ai: 'Je vous aide à retrouver le document et à préparer la prochaine étape.', explanation: 'Ajouter une photo de l’ordonnance au suivi du proche, pour faciliter sa consultation.' },
    { title: 'La bonne pharmacie.<br>Le document prêt.', shortTitle: 'Préparer la transmission', demo: pharmacyDemo, ai: 'Vous choisissez la pharmacie. Les modalités d’envoi seront précisées lors des tests.', explanation: 'Faciliter la transmission de l’ordonnance à la pharmacie choisie, avec des modalités à valider.' },
    { title: 'Le renouvellement,<br>à anticiper.', shortTitle: 'Anticiper le renouvellement', demo: calendarDemo, ai: 'Je prépare une demande de rendez-vous. Le professionnel décide de la suite.', explanation: 'Préparer une demande de rendez-vous à partir d’une échéance renseignée et vérifiée.' },
    { title: 'Un planning clair.<br>Des rappels utiles.', shortTitle: 'Accompagner les prises', demo: reminderDemo, ai: 'Les rappels sont à programmer selon le planning prescrit, après vérification.', explanation: 'Programmer les rappels de prise. Une notification ne confirme pas la prise effective du médicament.' }
  ];
  const moduleTabs = [...document.querySelectorAll('[data-module-step]')];
  const modulePanel = document.getElementById('module-preview');
  let moduleIndex = 0;
  function selectModule(index, animate = true) {
    moduleIndex = index;
    moduleTabs.forEach((tab, i) => { tab.classList.toggle('active', i === index); tab.setAttribute('aria-selected', String(i === index)); tab.tabIndex = i === index ? 0 : -1; });
    const panel = document.getElementById('module-preview');
    panel.setAttribute('aria-labelledby', `module-tab-${index}`);
    document.getElementById('module-title').innerHTML = modules[index].title;
    document.getElementById('module-demo').innerHTML = modules[index].demo;
    document.getElementById('module-ai-text').textContent = modules[index].ai;
    if (animate) animateSwap(panel);
  }
  moduleTabs.forEach((tab, index) => tab.addEventListener('click', () => { selectModule(index); stopModuleAutoplay(); }));
  keyboardTabs(moduleTabs, index => { selectModule(index); stopModuleAutoplay(); }, true);
  selectModule(0);

  // Défilement automatique des cartes, une seule fois : 3 s par carte, fondu sortant puis entrant.
  // Démarre quand la carte devient visible, s'arrête sur la dernière ou dès que l'utilisateur choisit une carte.
  // En pause au survol ou au focus, désactivé si l'utilisateur réduit les animations.
  const MODULE_CARD_MS = 3000;
  const MODULE_FADE_MS = 600;
  const moduleLayout = document.querySelector('.module-layout');
  let moduleTimer;
  let modulePaused = false;
  let moduleAutoplay = false;
  function scheduleModuleStep() {
    clearTimeout(moduleTimer);
    if (!moduleAutoplay || modulePaused || reducedMotion.matches) return;
    if (moduleIndex >= modules.length - 1) { moduleAutoplay = false; return; }
    moduleTimer = setTimeout(() => {
      modulePanel.classList.add('fading');
      moduleTimer = setTimeout(() => {
        selectModule(moduleIndex + 1, false);
        modulePanel.classList.remove('fading');
        scheduleModuleStep();
      }, MODULE_FADE_MS);
    }, MODULE_CARD_MS - MODULE_FADE_MS);
  }
  function stopModuleAutoplay() {
    moduleAutoplay = false;
    clearTimeout(moduleTimer);
    modulePanel.classList.remove('fading');
  }
  function setModulePaused(paused) {
    modulePaused = paused;
    if (paused) { clearTimeout(moduleTimer); modulePanel.classList.remove('fading'); }
    else scheduleModuleStep();
  }
  moduleLayout.addEventListener('mouseenter', () => setModulePaused(true));
  moduleLayout.addEventListener('mouseleave', () => setModulePaused(moduleLayout.contains(document.activeElement)));
  moduleLayout.addEventListener('focusin', () => setModulePaused(true));
  moduleLayout.addEventListener('focusout', event => { if (!moduleLayout.contains(event.relatedTarget)) setModulePaused(moduleLayout.matches(':hover')); });
  if ('IntersectionObserver' in window) {
    const moduleObserver = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        moduleObserver.disconnect();
        moduleAutoplay = true;
        scheduleModuleStep();
      }
    }, { threshold: 0.5 });
    moduleObserver.observe(modulePanel);
  }

  const prototypeDialog = document.getElementById('prototype-dialog');
  let demoIndex = 0;
  function renderDemo() {
    const module = modules[demoIndex];
    const demo = document.getElementById('modal-demo');
    // Only static illustrative content is inserted as HTML.
    demo.innerHTML = `<h3>${module.shortTitle}</h3>${module.demo}<p>${module.explanation}</p>`;
    document.getElementById('demo-counter').textContent = `0${demoIndex + 1} / 04`;
    animateSwap(demo);
  }
  function openDialog(dialog) {
    dialog.showModal();
    document.body.classList.add('body-modal-open');
  }
  document.querySelectorAll('[data-open-demo]').forEach(button => button.addEventListener('click', () => { demoIndex = 0; renderDemo(); openDialog(prototypeDialog); }));
  document.getElementById('demo-next').addEventListener('click', () => { demoIndex = (demoIndex + 1) % modules.length; renderDemo(); });
  document.getElementById('demo-prev').addEventListener('click', () => { demoIndex = (demoIndex - 1 + modules.length) % modules.length; renderDemo(); });
  document.querySelector('.modal-contact').addEventListener('click', () => prototypeDialog.close());
  document.querySelectorAll('dialog').forEach(dialog => {
    dialog.querySelector('.modal-close').addEventListener('click', () => dialog.close());
    dialog.addEventListener('close', () => document.body.classList.remove('body-modal-open'));
    dialog.addEventListener('click', event => {
      if (event.target === dialog) {
        const box = dialog.getBoundingClientRect();
        if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
      }
    });
  });

  const contact = window.RENAI_CONTACT || {};
  const hubspot = contact.HUBSPOT || {};
  const hubspotEndpoint = hubspot.PORTAL_ID && hubspot.FORM_GUID
    ? `${hubspot.API_HOST || 'https://api.hsforms.com'}/submissions/v3/integration/submit/${encodeURIComponent(hubspot.PORTAL_ID)}/${encodeURIComponent(hubspot.FORM_GUID)}`
    : '';
  const endpoint = hubspotEndpoint || contact.CONTACT_ENDPOINT || '';
  const email = contact.CONTACT_EMAIL || '';
  // Correspondance entre les champs du formulaire et les propriétés de contact HubSpot.
  const hubspotFields = { firstname: 'firstname', lastname: 'lastname', organization: 'company', email: 'email', context: 'message' };
  function hubspotPayload(data) {
    const hutk = document.cookie.match(/(?:^|;\s*)hubspotutk=([^;]+)/)?.[1];
    const fields = Object.entries(hubspotFields)
      .map(([key, name]) => ({ objectTypeId: '0-1', name, value: String(data[key] || '').trim() }))
      .filter(field => field.value);
    return { fields, context: { ...(hutk && { hutk }), pageUri: location.href, pageName: document.title } };
  }
  const form = document.getElementById('pilot-form');
  const submit = form.querySelector('[type=submit]');
  function requestText(data) {
    return `Bonjour,\n\nJe souhaite échanger sur les premiers tests et un projet de pilote Renai.\n\nPrénom et nom : ${data.firstname} ${data.lastname}\nOrganisme : ${data.organization}\nE-mail : ${data.email}\n\nContexte :\n${data.context || 'À préciser lors de notre échange.'}\n\nMerci,\n${data.firstname} ${data.lastname}`;
  }
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = Object.fromEntries(new FormData(form));
    if (data.website) return;
    delete data.website;
    const status = form.querySelector('.form-status');
    status.textContent = '';
    if (endpoint) {
      if (!endpoint.startsWith('https://')) { status.textContent = 'L’envoi est indisponible. Veuillez réessayer plus tard.'; return; }
      submit.disabled = true;
      submit.setAttribute('aria-busy', 'true');
      try {
        const body = hubspotEndpoint ? hubspotPayload(data) : data;
        const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(body), signal: AbortSignal.timeout(15000) });
        if (!response.ok) {
          console.error('Renai — échec de l’envoi du formulaire', response.status, await response.text().catch(() => ''));
          throw new Error('Request failed');
        }
        status.style.color = 'var(--renee-cobalt)';
        status.textContent = 'Votre demande a été envoyée. Merci pour votre intérêt pour Renai.';
        form.reset();
      } catch {
        status.style.color = 'var(--renee-brique)';
        status.textContent = 'L’envoi n’a pas pu être confirmé. Vos informations restent dans le formulaire.';
      } finally { submit.disabled = false; submit.removeAttribute('aria-busy'); }
    } else if (email) {
      window.location.href = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent('Projet de pilote Renai — ' + data.organization)}&body=${encodeURIComponent(requestText(data))}`;
      status.style.color = 'var(--renee-cobalt)';
      status.textContent = 'Votre e-mail est préparé. Son envoi reste à confirmer dans votre messagerie.';
    } else {
      document.getElementById('request-text').value = requestText(data);
      document.getElementById('copy-status').textContent = '';
      openDialog(document.getElementById('request-dialog'));
    }
  });
  document.getElementById('copy-request').addEventListener('click', async () => {
    const textarea = document.getElementById('request-text');
    const status = document.getElementById('copy-status');
    try {
      await navigator.clipboard.writeText(textarea.value);
      status.textContent = 'Demande copiée.';
    } catch {
      textarea.focus();
      textarea.select();
      status.textContent = 'Sélectionnez et copiez le texte de votre demande.';
    }
  });
  document.getElementById('download-request').addEventListener('click', () => {
    const blob = new Blob([document.getElementById('request-text').value], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url; anchor.download = 'demande-pilote-renai.txt';
    document.body.append(anchor); anchor.click(); anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
})();
