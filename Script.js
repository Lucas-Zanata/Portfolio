// Mobile menu toggle
  const burger = document.getElementById('burgerBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  burger.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('open');
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
  }));

  // Scrollspy for nav
  const sections = ['identidade','resumo','projetos','contato'].map(id => document.getElementById(id));
  const navLinks = document.querySelectorAll('#deskNav a');
  const spy = () => {
    let current = '';
    sections.forEach(sec => {
      if (!sec) return;
      const rect = sec.getBoundingClientRect();
      if (rect.top <= 120 && rect.bottom >= 120) current = sec.id;
    });
    navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + current));
  };
  document.addEventListener('scroll', spy, { passive: true });
  spy();

  // Rotating role line
  const roles = ["Desenvolvedor Fullstack", "Entusiasta de Java & Spring Boot"];
  const roleLine = document.getElementById('roleLine');
  let ri = 0;
  function setRole(i){
    roleLine.innerHTML = roles[i] + '<span class="caret"></span>';
  }
  setRole(0);
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    setInterval(() => { ri = (ri + 1) % roles.length; setRole(ri); }, 3200);
  }

  // Typewriter code panel (single orchestrated intro moment)
  const codeLines = [
    [['tok-com','// perfil.java']],
    [['tok-kw','public'],['tok-plain',' '],['tok-kw','class'],['tok-plain',' '],['tok-type','Lucas'],['tok-plain',' {']],
    [['tok-plain','  '],['tok-kw','String'],['tok-plain',' cargo = '],['tok-str','"Desenvolvedor Fullstack"'],['tok-plain',';']],
    [['tok-plain','  '],['tok-kw','String'],['tok-plain',' foco = '],['tok-str','"Java + Spring Boot"'],['tok-plain',';']],
    [['tok-plain','  '],['tok-kw','String[]'],['tok-plain',' stack = { '],['tok-str','"React"'],['tok-plain',', '],['tok-str','"MySQL"'],['tok-plain',', '],['tok-str','"Git"'],['tok-plain',' };']],
    [['tok-plain','']],
    [['tok-plain','  '],['tok-kw','public'],['tok-plain',' '],['tok-kw','void'],['tok-plain',' '],['tok-fn','aprender'],['tok-plain','() {']],
    [['tok-plain','    '],['tok-com','// todos os dias, um pouco mais']],
    [['tok-plain','  }']],
    [['tok-plain','}']],
  ];
  const codeBody = document.getElementById('codeBody');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function renderStatic(){
    codeBody.innerHTML = codeLines.map((line, idx) => {
      const html = line.map(([cls,txt]) => `<span class="${cls}">${txt}</span>`).join('');
      return `<div><span class="ln">${idx+1}</span>${html}</div>`;
    }).join('');
  }

  if (reduceMotion) {
    renderStatic();
  } else {
    let li = 0;
    function typeLine(){
      if (li >= codeLines.length) return;
      const line = codeLines[li];
      const row = document.createElement('div');
      const lnSpan = document.createElement('span');
      lnSpan.className = 'ln';
      lnSpan.textContent = (li+1);
      row.appendChild(lnSpan);
      codeBody.appendChild(row);
      let ci = 0, ti = 0;
      function typeChar(){
        if (ci >= line.length) { li++; setTimeout(typeLine, 90); return; }
        const [cls, txt] = line[ci];
        let span = row.lastChild && row.lastChild.dataset && row.lastChild.dataset.cls === cls ? row.lastChild : null;
        if (!span) { span = document.createElement('span'); span.className = cls; span.dataset.cls = cls; row.appendChild(span); }
        span.textContent += txt[ti];
        ti++;
        if (ti >= txt.length) { ci++; ti = 0; }
        codeBody.scrollTop = codeBody.scrollHeight;
        setTimeout(typeChar, 10);
      }
      if (line.length === 0 || (line.length===1 && line[0][1]==='')) { li++; setTimeout(typeLine, 60); }
      else typeChar();
    }
    typeLine();
  }

  // Copy email
  const copyBtn = document.getElementById('copyEmailBtn');
  const emailText = document.getElementById('emailText');
  copyBtn.addEventListener('click', async () => {
    const email = 'lucasdbzanata@gmail.com';
    try {
      await navigator.clipboard.writeText(email);
      emailText.textContent = 'Copiado!';
      emailText.classList.add('copied');
      setTimeout(() => { emailText.textContent = email; emailText.classList.remove('copied'); }, 1800);
    } catch (e) {
      window.location.href = 'mailto:' + email;
    }
  });

  // Skill filter -> highlights matching projects
  const skillButtons = document.querySelectorAll('.skill-icon-btn');
  const projectCards = document.querySelectorAll('.proj-card[data-skills]');
  const clearFilterBtn = document.getElementById('clearFilterBtn');
  let selectedSkills = new Set();

  function applyFilter(){
    clearFilterBtn.classList.toggle('show', selectedSkills.size > 0);
    projectCards.forEach(card => {
      const tools = (card.dataset.skills || '').split(',');
      card.classList.remove('dim', 'match');
      if (selectedSkills.size === 0) return;
      const hasMatch = tools.some(t => selectedSkills.has(t));
      card.classList.add(hasMatch ? 'match' : 'dim');
    });
  }

  skillButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const skill = btn.dataset.skill;
      if (selectedSkills.has(skill)) { selectedSkills.delete(skill); btn.classList.remove('active'); }
      else { selectedSkills.add(skill); btn.classList.add('active'); }
      applyFilter();
    });
  });

  clearFilterBtn.addEventListener('click', () => {
    selectedSkills.clear();
    skillButtons.forEach(b => b.classList.remove('active'));
    applyFilter();
  });

  // Certifications accordion
  document.querySelectorAll('.cert-toggle').forEach(toggle => {
    toggle.addEventListener('click', () => {
      const item = toggle.closest('.cert-item');
      const isOpen = item.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  });