// ══════════════════════════════════════════
//  DATA  – community averages & habits
// ══════════════════════════════════════════
const DATA = {
  urban: {
    avgSleep: 6.2,
    avgScreen: 2.4,
    avgWork: 9.1,
    habits: [
      { en: 'Avoiding screens 30 min before bed',     dz: 'གཉིད་སྔོན་དུས་ཚོད་ཕྱེད་ཀར་སྐར་ཆས་མི་བཀོལ།',     pct: 68 },
      { en: 'Fixed wake-up time every day',            dz: 'ཉིན་རེར་སད་དུས་གཅིག་གཏན་ལ་ཕབ།',                   pct: 61 },
      { en: 'Brief walk or light exercise after work', dz: 'ལས་ཀ་རྗེས་ལམ་སྐྱོད་ཀྱང་རུང་རྩལ་འགྲེམས།',           pct: 54 },
      { en: 'Keeping bedroom dark & quiet',            dz: 'གཉིད་ཁང་མུན་ཏིམ་དང་ཀ་འཇམ་པར་བཞག།',               pct: 47 },
      { en: 'Butter tea instead of coffee after 6 pm', dz: 'དགོང་མོ་ཕྱི་ལ་མར་གྱི་ཇ་བཀོལ།',                    pct: 39 },
    ]
  },
  semi: {
    avgSleep: 6.8,
    avgScreen: 1.8,
    avgWork: 8.5,
    habits: [
      { en: 'Going to bed before 10 pm',              dz: 'མཚན་མོ་བཅུ་མ་སོན་གཉིད་འགྲོ།',                     pct: 72 },
      { en: 'Short prayers or meditation before sleep',dz: 'གཉིད་སྔོན་མཚམས་ཀྱི་སྨོན་ལམ་ཡང་ན་སྒོམ།',           pct: 65 },
      { en: 'Avoiding heavy meals at night',           dz: 'མཚན་མོ་ཟས་ལྗིད་མི་ཟ།',                            pct: 58 },
      { en: 'Fixed wake-up time every day',            dz: 'ཉིན་རེར་སད་དུས་གཅིག་གཏན་ལ་ཕབ།',                   pct: 50 },
      { en: 'Fresh air / window open at night',       dz: 'མཚན་མོ་སྒང་ཁ་ཕྱེ་བཞག',                            pct: 43 },
    ]
  },
  rural: {
    avgSleep: 7.4,
    avgScreen: 0.8,
    avgWork: 8.0,
    habits: [
      { en: 'Natural sleep schedule (sunrise–sunset)',  dz: 'ཉི་མའི་དུས་ཚོད་དང་མཐུན་པའི་གཉིད་དུས།',           pct: 81 },
      { en: 'Short prayers or meditation before sleep', dz: 'གཉིད་སྔོན་མཚམས་ཀྱི་སྨོན་ལམ་ཡང་ན་སྒོམ།',          pct: 76 },
      { en: 'Physical farm/household work during day',  dz: 'ཉིན་མོ་ལས་ཀ་རྒྱལ་ས་ཀྱིས་ཤུགས་རྩལ་འཕྲོད།',       pct: 69 },
      { en: 'Going to bed before 9:30 pm',             dz: 'མཚན་མོ་དགུ་ཕྱེད་མ་སོན་གཉིད་འགྲོ།',               pct: 64 },
      { en: 'Herbal tea (artemisia / ginger) at night', dz: 'མཚན་མོ་ སྨན་ཇ་ (ཀི་ལི་མ་ / སྒ་) བཀོལ།',         pct: 57 },
    ]
  }
};

const GROUP_LABELS = {
  urban: { en: 'Urban Group',      dz: 'གྲོང་ཁྱེར་སྡེ་ཚན།' },
  semi:  { en: 'Semi-urban Group', dz: 'གྲོང་ཞིང་འབར་མའི་སྡེ་ཚན།' },
  rural: { en: 'Rural Group',      dz: 'གྲོང་གསེབ་སྡེ་ཚན།' },
};

// ══════════════════════════════════════════
//  LANGUAGE
// ══════════════════════════════════════════
let currentLang = 'en';

function setLang(lang) {
  currentLang = lang;
  document.querySelectorAll('[data-en]').forEach(el => {
    if (lang === 'dz' && el.getAttribute('data-dz')) {
      el.textContent = el.getAttribute('data-dz');
    } else {
      el.textContent = el.getAttribute('data-en');
    }
  });

  // select options
  document.querySelectorAll('select option').forEach(opt => {
    if (lang === 'dz' && opt.getAttribute('data-dz')) {
      opt.textContent = opt.getAttribute('data-dz');
    } else {
      opt.textContent = opt.getAttribute('data-en');
    }
  });

  // insight visibility
  const iEn = document.getElementById('insightEn');
  const iDz = document.getElementById('insightDz');
  if (iEn) iEn.style.display = lang === 'en' ? '' : 'none';
  if (iDz) iDz.style.display = lang === 'dz' ? '' : 'none';

  document.getElementById('btnEn').classList.toggle('active', lang === 'en');
  document.getElementById('btnDz').classList.toggle('active', lang === 'dz');
}

// ══════════════════════════════════════════
//  SLIDER
// ══════════════════════════════════════════
function updateSlider(el, valId, min, max) {
  const pct = ((el.value - min) / (max - min)) * 100;
  el.style.setProperty('--pct', pct + '%');
  document.getElementById(valId).textContent = el.value + 'h';
}

// init sliders on page load
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('input[type="range"]').forEach(el => {
    const id = el.id;
    const map = { workHours: 'workVal', screenTime: 'screenVal', sleepHours: 'sleepVal' };
    const min = parseFloat(el.min), max = parseFloat(el.max);
    updateSlider(el, map[id], min, max);
  });
});

// ══════════════════════════════════════════
//  SCORE CALCULATION
// ══════════════════════════════════════════
function calcScore(sleep, screen, work, group) {
  const idealSleep = 7.5, idealScreen = 0.5, idealWork = 8;
  const d = DATA[group];

  let s = 100;
  // sleep: -8 per hr under ideal, -4 over
  const sleepDiff = sleep - idealSleep;
  if (sleepDiff < 0) s += sleepDiff * 8;
  else s -= sleepDiff * 4;
  // screen: -12 per hr over 0.5
  s -= Math.max(0, screen - 0.5) * 12;
  // work: -5 per hr over 9
  s -= Math.max(0, work - 9) * 5;
  // bonus for being close to group avg
  const sleepBonus = Math.abs(sleep - d.avgSleep) < 0.5 ? 5 : 0;
  s += sleepBonus;

  return Math.min(100, Math.max(0, Math.round(s)));
}

function getInsight(score, sleep, screen, group, lang) {
  const d = DATA[group];
  const sleepDiff = (sleep - d.avgSleep).toFixed(1);
  const isMore = sleepDiff >= 0;
  const diffText = isMore ? `${sleepDiff}h more` : `${Math.abs(sleepDiff)}h less`;
  const diffTextDz = isMore ? `ཆུ་ཚོད་ ${Math.abs(sleepDiff)} མང་ཆེ་བ།` : `ཆུ་ཚོད་ ${Math.abs(sleepDiff)} ཉུང་བ།`;

  let en = '', dz = '';
  if (score >= 75) {
    en = `Your sleep of ${sleep}h is ${diffText} than your group average — you're resting well and likely have steady energy throughout the day.`;
    dz = `ཁྱེད་ཀྱི་གཉིད་གཡང་ ${sleep} ཆུ་ཚོད་ བྱུང་ནས་ཁྱེད་ཀྱི་སྡེ་ཚན་གྱི་སྤྱི་ཚད་ལས་ ${diffTextDz} — ཁྱེད་ཀྱི་གཉིད་གཡང་ལེགས་པ་ཡོད། ཉིན་གྲུབ་ཤུགས་རྩལ་གཡུར་མི་ཉུང་།`;
  } else if (score >= 50) {
    en = `Your sleep is ${diffText} than your group's average. High screen time or long work hours may be reducing the quality of your rest.`;
    dz = `ཁྱེད་ཀྱི་གཉིད་གཡང་ཁྱེད་ཀྱི་སྡེ་ཚན་གྱི་སྤྱི་ཚད་ལས་ ${diffTextDz} — སྐར་བལྟ་ཡང་ན་ལས་ཀ་ལྗིད་མོ་དེས་ཁྱེད་ཀྱི་གཉིད་གཡང་གི་གཟུགས་བམ་ཆུང་བར་བཏང་ཡོད་ངེས།`;
  } else {
    en = `You're sleeping ${diffText} than your group average and your score suggests poor rest. Reducing screen time before bed could make an immediate difference.`;
    dz = `ཁྱེད་ཀྱི་གཉིད་གཡང་ཁྱེད་ཀྱི་སྡེ་ཚན་གྱི་སྤྱི་ཚད་ལས་ ${diffTextDz} — ཁྱེད་ཀྱི་གཉིད་གཡང་གི་གཟུགས་བམ་ཉམས་ཡོད། གཉིད་སྔོན་སྐར་ཆས་མི་བཀོལ་བ་དེ་གལ་འགའ་ཡིན།`;
  }
  return { en, dz };
}

// ══════════════════════════════════════════
//  CALCULATE & RENDER
// ══════════════════════════════════════════
function calculateResults() {
  const sleep  = parseFloat(document.getElementById('sleepHours').value);
  const screen = parseFloat(document.getElementById('screenTime').value);
  const work   = parseFloat(document.getElementById('workHours').value);
  const group  = document.getElementById('residence').value;
  const d      = DATA[group];

  const score = calcScore(sleep, screen, work, group);
  const insight = getInsight(score, sleep, screen, group, currentLang);

  // toggle
  document.getElementById('formSection').style.display = 'none';
  document.getElementById('results').style.display = 'block';

  // group label
  const gl = GROUP_LABELS[group];
  document.getElementById('groupLabel').textContent = currentLang === 'dz' ? gl.dz : gl.en;

  // score
  document.getElementById('scoreNum').textContent = score;

  // sub
  const subMap = {
    en: `Compared to others in your ${gl.en.toLowerCase()}`,
    dz: `ཁྱེད་ཀྱི་${gl.dz}དང་གཞི་བསྟུན།`
  };
  document.getElementById('resultSub').textContent = currentLang === 'dz' ? subMap.dz : subMap.en;

  // bars (max 12h for sleep, 6h for screen)
  const sleepPct  = (sleep / 12) * 100;
  const avgSlpPct = (d.avgSleep / 12) * 100;
  const scrPct    = (screen / 6) * 100;
  const avgScrPct = (d.avgScreen / 6) * 100;

  setTimeout(() => {
    document.getElementById('barYouSleep').style.width  = sleepPct + '%';
    document.getElementById('barAvgSleep').style.width  = avgSlpPct + '%';
    document.getElementById('barYouScreen').style.width = Math.max(scrPct, 3) + '%';
    document.getElementById('barAvgScreen').style.width = Math.max(avgScrPct, 3) + '%';
  }, 80);

  document.getElementById('barYouSleep').textContent  = sleep + 'h';
  document.getElementById('barAvgSleep').textContent  = d.avgSleep + 'h';
  document.getElementById('barYouScreen').textContent = screen + 'h';
  document.getElementById('barAvgScreen').textContent = d.avgScreen + 'h';
  document.getElementById('numYouSleep').textContent  = sleep + 'h';
  document.getElementById('numAvgSleep').textContent  = d.avgSleep + 'h';
  document.getElementById('numYouScreen').textContent = screen + 'h';
  document.getElementById('numAvgScreen').textContent = d.avgScreen + 'h';

  // insight
  document.getElementById('insightEn').textContent = insight.en;
  document.getElementById('insightDz').textContent = insight.dz;
  document.getElementById('insightEn').style.display = currentLang === 'dz' ? 'none' : '';
  document.getElementById('insightDz').style.display = currentLang === 'dz' ? '' : 'none';

  // habits
  const list = document.getElementById('habitsList');
  list.innerHTML = '';
  d.habits.forEach((h, i) => {
    const row = document.createElement('div');
    row.className = 'habit-row';
    row.style.animationDelay = (0.4 + i * 0.08) + 's';
    row.innerHTML = `
      <div class="habit-name">
        ${currentLang === 'dz' ? h.dz : h.en}
        <span class="dz-small">${currentLang === 'dz' ? h.en : h.dz}</span>
      </div>
      <div class="habit-bar-track">
        <div class="habit-bar-fill" style="width:0%" data-pct="${h.pct}"></div>
      </div>
      <div class="habit-pct">${h.pct}%</div>
    `;
    list.appendChild(row);
  });

  setTimeout(() => {
    document.querySelectorAll('.habit-bar-fill').forEach(el => {
      el.style.width = el.dataset.pct + '%';
    });
  }, 200);

  // re-apply lang to new nodes
  setLang(currentLang);
}

function resetForm() {
  document.getElementById('results').style.display = 'none';
  document.getElementById('formSection').style.display = 'block';
}
