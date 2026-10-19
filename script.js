(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  /* ---------- Navigation ---------- */
  var SCREENS = ['welcome', 'digest', 'map', 'auto', 'avoid', 'play'];
  var CAP = {
    welcome: ['Total anonymity', 'No username, no photo, no profile. You only interact through actions: book, confirm, vote, organize. No "hi, how are you".', 'Feature 1 of 6'],
    digest: ['Smart conversation summary', 'Atyrn sits on top of WhatsApp, Instagram and other apps. It reads the group chat for you, removes the small talk and keeps only what needs an action. It also condenses your Instagram feed into the few posts and reels that matter to you.', 'Feature 2 of 6'],
    map: ['Anti-social navigation', 'Like a map app, but it computes the route with the fewest people on it. It avoids shopping streets, crowds and events, and can avoid one specific person.', 'Feature 3 of 6'],
    auto: ['Automatic social life', 'Atyrn answers invitations for you, finds the best date for an event, remembers birthdays and writes polite excuses.', 'Feature 4 of 6'],
    avoid: ['De-meeting', 'The opposite of a dating app. You list the people you want to avoid. Atyrn warns you if you might run into them and suggests another time.', 'Feature 6 of 6'],
    play: ['De-socialization challenges', 'Daily challenges to enjoy being alone: "0 interaction today", "Avoid-everyone route", "Summarize 3 conversations". Badges, levels and stats.', 'Feature 5 of 6']
  };
  var current = 'welcome';
  function show(id) {
    if (SCREENS.indexOf(id) < 0) { id = 'welcome'; }
    current = id;
    SCREENS.forEach(function (s) { $('#s-' + s).hidden = (s !== id); });
    $('#tabs').hidden = (id === 'welcome');
    $('#qr').hidden = (id !== 'welcome');
    $$('#tabs button').forEach(function (b) { if (b.dataset.go === id) { b.setAttribute('aria-current', 'page'); } else { b.removeAttribute('aria-current'); } });
    $$('#dots button').forEach(function (b) { b.setAttribute('aria-current', b.dataset.go === id ? 'true' : 'false'); });
    var c = CAP[id];
    $('#cap-title').textContent = c[0]; $('#cap-text').textContent = c[1]; $('#cap-count').textContent = c[2];
    $('.screens').scrollTop = 0;
    if (id === 'digest' && !settled[src]) { settleScroll(); }
    try { history.replaceState(null, '', '#' + id); } catch (e) {}
  }
  document.addEventListener('click', function (e) {
    var g = e.target.closest('[data-go]');
    if (g) { show(g.dataset.go); }
  });
  /* ---------- Theme ---------- */
  var root = document.documentElement;
  $('#theme').addEventListener('click', function () {
    var cur = root.getAttribute('data-theme');
    var dark = cur ? cur === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.setAttribute('data-theme', dark ? 'light' : 'dark');
  });

  /* ---------- Digest ---------- */
  var CHATS = {
    whatsapp: {
      app: 'WhatsApp', name: 'Family group',
      msgs: [
        ['sep', 'Yesterday'],
        ['Aunt Sylvie', 'Good morning everyone!'], ['Dad', 'morning'], ['Theo', 'hey'],
        ['Cousin Lea', 'new profile pic, do you like it?'], ['Aunt Sylvie', 'beautiful!!'], ['Dad', 'very nice'],
        ['Theo', 'who took it?'], ['Cousin Lea', 'my roommate haha'], ['Grandma', 'Has anyone seen my glasses?'],
        ['Mom', 'they are on the kitchen table, Mom'], ['Grandma', 'Thank you darling'],
        ['Theo', 'did you see the match last night?'], ['Dad', 'incredible second half'], ['Theo', '3-2 at the end!!'],
        ['Aunt Sylvie', "I don't follow football but congrats?"], ['You', 'lol', 0, 1],
        ['Cousin Lea', 'send the recipe for the carrot cake please'], ['Aunt Sylvie', 'sending it tonight'],
        ['Grandma', 'It rained all day here'], ['Dad', 'same here'], ['Theo', 'sunshine here'],
        ['Dad', '<photo: the cat>'], ['Cousin Lea', 'the cat is so fat'], ['Dad', 'he is not fat, he is fluffy'],
        ['sep', 'Today'],
        ['Mom', 'So what are we doing for Christmas this year?', 1],
        ['Aunt Sylvie', 'I can do the 24th or the 25th'], ['Theo', "I'd rather do it before the 24th, I work after"],
        ['Cousin Lea', "I'm free all week"], ['Dad', 'whatever works for me'],
        ['Mom', 'Grandma suggests her place on Tuesday', 1],
        ['Grandma', "Yes, come to my place Tuesday evening, I'm making roast", 1], ['Theo', "haha Grandma's roast"],
        ['Aunt Sylvie', 'perfect for me'], ['Mom', '8 PM okay for everyone?', 1],
        ['Theo', 'ok for 8'], ['Cousin Lea', 'yes'], ['Dad', 'yes'], ['Mom', 'Who brings what?'],
        ['Aunt Sylvie', "I'll take the desserts", 1], ['Theo', 'I can bring drinks', 1], ['Cousin Lea', "I'll bring the decorations"],
        ['Mom', "Great. I'll do the starter.", 1], ['Dad', 'should I wear the ugly sweater'], ['Theo', 'yes!!'],
        ['Cousin Lea', 'yes obviously'], ['Grandma', 'Please no ugly sweaters at the table'], ['Aunt Sylvie', 'haha'],
        ['Mom', 'Can you bring bread?', 1], ['Theo', 'lol'], ['Mom', 'Are you coming Tuesday?', 1],
        ['Aunt Sylvie', 'You there?'], ['Mom', '??']
      ],
      headline: 'Christmas dinner: Tuesday, 8 PM, at Grandma’s house.',
      asks: ['Are you coming on Tuesday?', 'Can you bring bread?'],
      decided: ['Place: Grandma’s house', 'Time: Tuesday at 8 PM', 'Starter: Mom. Desserts: Aunt Sylvie. Drinks: Theo.'],
      replies: [['I’m in', 'I’m in for Tuesday, 8 PM. I’ll bring the bread.'], ['Can’t make it', 'Sorry, I can’t come on Tuesday. Have a great dinner!'], ['Ask me tomorrow', 'I’ll confirm tomorrow, I need to check my schedule.']],
      cal: 'Tue · 8 PM · Christmas dinner'
    },
    instagram: {
      app: 'Instagram', name: 'Project team',
      msgs: [
        ['sep', 'Yesterday'],
        ['Ines', 'hey team'], ['Noah', 'yo'], ['Maya', 'hi!'], ['Noah', 'did you guys watch the new episode'],
        ['Maya', 'yes!! no spoilers'], ['Noah', 'the ending though'], ['Maya', 'NOAH'],
        ['Ines', 'please keep the spoilers for later'], ['Noah', 'sorry sorry'], ['Maya', 'who has the pdf of the course?'],
        ['Ines', "it's in the shared folder"], ['Maya', 'found it, thanks'], ['Noah', 'saw the funniest meme about the teacher'],
        ['Ines', 'send it'], ['Noah', '<photo: meme>'], ['Maya', "haha that's so true"], ['You', 'lol', 0, 1],
        ['Noah', 'anyone up for lunch?'], ['Maya', 'I already ate'], ['Ines', 'me too'],
        ['sep', 'Today'],
        ['Ines', 'ok serious now, meeting Thursday 2 PM?', 1], ['Noah', 'ok for me'], ['Maya', 'works for me'],
        ['Ines', 'room B12 is free, I checked', 1], ['Noah', 'top'], ['Maya', 'should we bring laptops'], ['Ines', 'yes'],
        ['Noah', 'my charger is broken again'], ['Maya', 'borrow mine'],
        ['Ines', 'the deadline is Friday 6 PM, not Saturday', 1], ['Noah', 'wait what'], ['Maya', "we're in trouble"], ['Noah', 'lol'],
        ['Ines', 'Noah you do the bibliography', 1], ['Noah', 'ok'], ['Ines', 'Maya, the introduction', 1], ['Maya', 'ok'],
        ['Ines', 'can you do slides 3 and 4?', 1], ['Noah', 'yes please do'], ['Maya', 'we need you!']
      ],
      headline: 'Project meeting: Thursday, 2 PM, room B12. Deadline Friday, 6 PM.',
      asks: ['Can you do slides 3 and 4?'],
      decided: ['Meeting: Thursday at 2 PM, room B12', 'Deadline: Friday at 6 PM', 'Noah: bibliography. Maya: introduction.'],
      replies: [['Yes, I’ll do them', 'Yes, I’ll do slides 3 and 4.'], ['Can’t, sorry', 'Sorry, I can’t this time. Can someone else take them?'], ['Tell you tonight', 'I’ll tell you tonight.']],
      cal: 'Thu · 2 PM · Project meeting'
    }
  };
  Object.keys(CHATS).forEach(function (k) {
    var c = CHATS[k], hot = 0, total = 0;
    c.msgs.forEach(function (m) { if (m[0] !== 'sep') { total++; if (m[2]) { hot++; } } });
    c.unread = total; c.muted = total - hot;
  });
  var src = 'whatsapp';
  var settled = {};
  function settleScroll() {
    var feed = src === 'feed', box = feed ? $('#posts') : $('#msgs');
    box.scrollTop = feed ? 0 : box.scrollHeight;
    settled[src] = box.clientHeight > 0;
  }
  function renderChat() {
    var isFeed = src === 'feed';
    $('#chat').hidden = isFeed; $('#feed').hidden = !isFeed;
    $('#sheet').hidden = true; $('#sheet-feed').hidden = true; $('#sent').hidden = true;
    var card = isFeed ? $('#feed') : $('#chat'), box = isFeed ? $('#posts') : $('#msgs'), h = '';
    box.style.transition = 'none';
    card.classList.remove('collapsed');
    if (isFeed) {
      var accts = {};
      POSTS.forEach(function (p) {
        accts[p[0]] = 1;
        h += '<div class="post' + (p[3] ? ' hot' : '') + '"><span class="t">' + esc(p[1]) + ' · ' + esc(p[0]) + '</span>' + esc(p[2]) + '</div>';
      });
      $('#feed-acc').textContent = Object.keys(accts).length + ' accounts you follow';
      $('#feed-new').textContent = POSTS.length + ' new';
      $('#hint').textContent = 'Scroll inside the feed to see every post and reel.';
    } else {
      var c = CHATS[src];
      $('#chat-app').textContent = c.app; $('#chat-name').textContent = c.name; $('#chat-unread').textContent = c.unread + ' unread';
      c.msgs.forEach(function (m) {
        if (m[0] === 'sep') { h += '<div class="sep">' + esc(m[1]) + '</div>'; return; }
        h += '<div class="b' + (m[2] ? ' hot' : '') + (m[3] ? ' me' : '') + '"><b>' + esc(m[3] ? 'You' : m[0]) + '</b>' + esc(m[1]) + '</div>';
      });
      $('#hint').textContent = 'Scroll inside the chat to read the whole conversation.';
    }
    box.innerHTML = h;
    settleScroll();
    requestAnimationFrame(function () { requestAnimationFrame(function () { box.style.transition = ''; }); });
  }
  function summarize() {
    var c = CHATS[src];
    $('#chat').classList.add('collapsed');
    $('#d-head').textContent = c.headline;
    $('#d-count').textContent = c.unread + ' messages → 1 info';
    $('#d-asks').innerHTML = c.asks.map(function (a, i) { return '<div class="ev"><span class="n">' + (i + 1) + '</span><span>' + esc(a) + '</span></div>'; }).join('');
    $('#d-decided').innerHTML = c.decided.map(function (a) { return '<div class="ev"><span class="n">✓</span><span>' + esc(a) + '</span></div>'; }).join('');
    $('#d-muted').textContent = c.muted + ' messages muted: greetings, jokes, side talk';
    $('#d-replies').innerHTML = c.replies.map(function (r, i) { return '<button class="btn sm' + (i === 0 ? ' primary' : '') + '" type="button" data-reply="' + i + '">' + esc(r[0]) + '</button>'; }).join('');
    $('#sent').hidden = true;
    $('#sheet').hidden = false;
    $('.screens').scrollTop = 0;
  }
  $('#fab').addEventListener('click', summarize);
  $('#back-chat').addEventListener('click', renderChat);

  /* ---------- Feed digest ---------- */
  var POSTS = [
    ['@lena.daily', 'Post', 'morning coffee, finally a quiet one', 0],
    ['@gym.mornings', 'Reel', '5 min stretching before work', 0],
    ['@travel.nomad', 'Post', 'sunset in Lisbon, no filter', 0],
    ['@funny.dad', 'Reel', 'when the wifi dies during a meeting', 0],
    ['@urban.kicks', 'Reel', 'DROP Friday 6 PM. 20% off for 24 hours', 1],
    ['@sneaker.hub', 'Post', 'Friday 6 PM. Same drop, same discount. Set your alarm', 0],
    ['@nova.beats', 'Reel', 'this new track hits different', 0],
    ['@lena.daily', 'Post', 'my desk setup tour', 0],
    ['@cityfood', 'Reel', 'the best ramen in town, ranked', 0],
    ['@kicks.daily', 'Reel', 'Friday drop incoming, 20% off', 0],
    ['@gym.mornings', 'Post', 'leg day', 0],
    ['@funny.dad', 'Reel', 'dad jokes, part 12', 0],
    ['@tech.weekly', 'Post', 'NEW PHONE announced Tuesday 4 PM. Here is what to expect', 1],
    ['@travel.nomad', 'Reel', 'how I pack in a carry-on', 0],
    ['@uni.life', 'Post', 'Scholarship deadline moved to Oct 30', 1],
    ['@shoe.vault', 'Post', 'the drop everyone is waiting for, Friday 6 PM', 0],
    ['@lena.daily', 'Reel', 'get ready with me', 0],
    ['@nova.beats', 'Post', 'TOUR ANNOUNCED. Paris, Nov 12. Tickets on sale Saturday 10 AM', 1],
    ['@cityfood', 'Post', 'Giveaway: win dinner for two. Ends Sunday', 1],
    ['@funny.dad', 'Reel', 'the group chat at 2 AM', 0],
    ['@travel.nomad', 'Post', 'airport coffee', 0],
    ['@gym.mornings', 'Reel', 'protein pancakes', 0],
    ['@tech.weekly', 'Reel', 'ten tips for your battery', 0],
    ['@uni.life', 'Post', 'library open until midnight this week', 0],
    ['@lena.daily', 'Post', 'new haircut', 0],
    ['@cityfood', 'Reel', 'street food tour', 0],
    ['@urban.kicks', 'Post', 'restock of the white pair', 0]
  ];
  var FEED_TOTAL = POSTS.length;
  var FITEMS = [
    { id: 'concerts', tag: 'Concert', acct: '@nova.beats', text: 'Paris, November 12. Tickets go on sale Saturday at 10 AM.', cal: true },
    { id: 'deals', tag: 'Deal', acct: '@urban.kicks', text: 'Sneaker drop on Friday at 6 PM, 20% off for 24 hours.', dup: 3, covers: 4, cal: true },
    { id: 'deadlines', tag: 'Deadline', acct: '@uni.life', text: 'Scholarship deadline moved to October 30.', cal: true },
    { id: 'giveaways', tag: 'Giveaway', acct: '@cityfood', text: 'Win a dinner for two. Ends Sunday.', cal: true },
    { id: 'launches', tag: 'Launch', acct: '@tech.weekly', text: 'New phone announced on Tuesday at 4 PM.', cal: true },
    { id: 'memes', tag: 'Meme', acct: '@funny.dad', text: 'A new series of meme reels, 3 today.', cal: false, covers: 3 }
  ];
  var INTERESTS = [['concerts', 'Concerts'], ['deals', 'Deals'], ['deadlines', 'Deadlines'], ['giveaways', 'Giveaways'], ['launches', 'Launches'], ['memes', 'Memes']];
  var FON = { concerts: 1, deals: 1, deadlines: 1, giveaways: 1, launches: 1, memes: 0 };
  var FADDED = {};
  function drawFeed() {
    var items = FITEMS.filter(function (i) { return FON[i.id]; }), dups = 0;
    items.forEach(function (i) { dups += i.covers || 1; });
    var n = items.length;
    $('#f-count').textContent = FEED_TOTAL + ' posts and reels → ' + n + ' thing' + (n === 1 ? '' : 's');
    $('#f-head').textContent = n ? (n + ' thing' + (n === 1 ? '' : 's') + ' worth knowing today.') : 'Nothing matches your interests today.';
    $('#f-int').innerHTML = INTERESTS.map(function (t) { return '<button class="chip" type="button" data-int="' + t[0] + '" aria-pressed="' + (FON[t[0]] ? 'true' : 'false') + '">' + t[1] + '</button>'; }).join('');
    $('#f-items').innerHTML = items.map(function (i) {
      return '<div class="ev"><span class="n">✓</span><div class="col"><span class="mono muted small">' + esc(i.tag.toUpperCase()) + ' · ' + esc(i.acct) + '</span><span>' + esc(i.text) + '</span>' +
        (i.dup ? '<span class="chip" style="justify-self:start">+' + i.dup + ' accounts posted the same</span>' : '') +
        (i.cal ? '<button class="btn sm" type="button" data-cal="' + i.id + '" style="justify-self:start"' + (FADDED[i.id] ? ' aria-pressed="true"' : '') + '>' + (FADDED[i.id] ? 'Added to calendar' : 'Add to calendar') + '</button>' : '') + '</div></div>';
    }).join('') || '<p class="muted small">Turn on an interest above.</p>';
    $('#f-muted').textContent = Math.max(0, FEED_TOTAL - dups) + ' items muted: ' + (FON.memes ? '' : 'memes, ') + 'selfies, reposted stories, ads';
  }
  function summarizeFeed() {
    $('#feed').classList.add('collapsed');
    drawFeed();
    $('#sheet-feed').hidden = false;
    $('.screens').scrollTop = 0;
  }
  $('#fab-feed').addEventListener('click', summarizeFeed);
  $('#back-feed').addEventListener('click', renderChat);
  $('#sheet-feed').addEventListener('click', function (e) {
    var t = e.target.closest('[data-int]'), c = e.target.closest('[data-cal]');
    if (t) { FON[t.dataset.int] = FON[t.dataset.int] ? 0 : 1; drawFeed(); }
    else if (c) { FADDED[c.dataset.cal] = !FADDED[c.dataset.cal]; drawFeed(); }
  });
  $('#d-replies').addEventListener('click', function (e) {
    var b = e.target.closest('[data-reply]'); if (!b) { return; }
    var r = CHATS[src].replies[+b.dataset.reply];
    $('#sent-text').textContent = '“' + r[1] + '”';
    $('#sent-cal').textContent = b.dataset.reply === '0' ? 'Added to your calendar: ' + CHATS[src].cal : 'Nothing added to your calendar.';
    $('#sent').hidden = false;
  });
  $$('#src button').forEach(function (b) {
    b.addEventListener('click', function () {
      src = b.dataset.src;
      $$('#src button').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
      renderChat();
    });
  });
  renderChat();

  /* ---------- Map ---------- */
  var BLK = '';
  for (var r = 0; r < 5; r++) { for (var c = 0; c < 6; c++) { BLK += '<rect class="blk" x="' + (12 + c * 57) + '" y="' + (12 + r * 52) + '" width="45" height="40" rx="5"/>'; } }
  $('#blocks').innerHTML = BLK;
  var M = { calm: false, avoid: false };
  var ROUTE = {
    direct: { min: 12, people: 48, avoided: 'No one to avoid on this route', note: '' },
    calm: { min: 15, people: 7, avoided: 'Person A may be near your route (12–2 PM)', note: 'warn' },
    detour: { min: 18, people: 5, avoided: 'Person A avoided: route changed', note: 'ok' }
  };
  function updateMap() {
    var key = !M.calm ? 'direct' : (M.avoid ? 'detour' : 'calm');
    ['direct', 'calm', 'detour'].forEach(function (k) {
      var el = $('#rt-' + k);
      el.classList.toggle('hide', k !== key && !(k === 'direct'));
      el.classList.toggle('act', k === key && k !== 'direct');
      el.classList.toggle('direct', k === 'direct' && key !== 'direct');
    });
    var dir = $('#rt-direct'); if (key === 'direct') { dir.classList.add('act'); dir.classList.remove('direct'); }
    $('#zone').classList.toggle('off', !M.avoid);
    $('#zone-l').style.display = M.avoid ? '' : 'none';
    var d = ROUTE.direct, a = ROUTE[key];
    $('#m-d-min').textContent = d.min + ' min'; $('#m-d-p').textContent = '≈ ' + d.people + ' people crossed';
    $('#m-c-min').textContent = a.min + ' min'; $('#m-c-p').textContent = '≈ ' + a.people + ' people crossed';
    $('#m-c-t').textContent = key === 'direct' ? 'Selected route' : (key === 'calm' ? 'Calm route' : 'Calm + avoid');
    var al = $('#m-alert');
    if (!M.avoid) { al.className = 'alert'; al.textContent = M.calm ? 'Calm route: 3 minutes longer, about 85% fewer people.' : 'This route goes through the shopping street and the market.'; }
    else if (!M.calm) { al.className = 'alert ok'; al.textContent = 'No contact expected with Person A on the direct route. Turn on anti-social mode for fewer people too.'; }
    else { al.className = 'alert ok'; al.textContent = 'Person A usually has lunch near the first calm route (12–2 PM). Atyrn took the northern streets instead.'; }
    $('#m-sw-calm').setAttribute('aria-checked', M.calm); $('#m-sw-avoid').setAttribute('aria-checked', M.avoid);
  }
  $('#m-sw-calm').addEventListener('click', function () { M.calm = !M.calm; updateMap(); });
  $('#m-sw-avoid').addEventListener('click', function () { M.avoid = !M.avoid; updateMap(); });
  updateMap();

  /* ---------- Autopilot ---------- */
  $$('.sw-toggle').forEach(function (b) {
    b.addEventListener('click', function () { b.setAttribute('aria-checked', b.getAttribute('aria-checked') === 'true' ? 'false' : 'true'); });
  });
  $('#let-answer').addEventListener('click', function () {
    this.disabled = true; this.textContent = 'Answered by Atyrn';
    $('#answered').hidden = false;
  });
  $('#bday-send').addEventListener('click', function () {
    this.disabled = true; this.textContent = 'Sent by Atyrn';
  });
  var EXC = {
    tired: 'Thanks for the invitation! I’m very tired at the moment and I’d rather rest. Have a great time, see you next time.',
    busy: 'Thanks for thinking of me! I already have something planned that day, so I can’t make it. Enjoy!',
    far: 'Thank you for the invite! With the trip, it will be difficult for me this time. Have a lovely evening!'
  };
  $$('#exc button').forEach(function (b) {
    b.addEventListener('click', function () {
      $$('#exc button').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
      $('#exc-out').textContent = '“' + EXC[b.dataset.k] + '”';
      $('#exc-out').hidden = false;
    });
  });
  var DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'], STATE = ['busy', 'busy', '', 'busy', '', 'best', ''];
  $('#days').innerHTML = DAYS.map(function (d, i) { return '<div class="d ' + STATE[i] + '"><span>' + d + '</span><b>' + (12 + i) + '</b></div>'; }).join('');

  /* ---------- De-meeting ---------- */
  var AVOID = [
    { id: 'A', zone: 'Cafe Rivoli area', time: '12:00–14:00', alt: ['2:30 PM', '6 PM'] },
    { id: 'B', zone: 'Main train station', time: '8:00–9:00', alt: ['9:30 AM', '5 PM'] }
  ];
  function renderAvoid() {
    $('#av-list').innerHTML = AVOID.map(function (p, i) {
      return '<div class="item"><div class="row"><b>Person ' + esc(p.id) + '</b><button class="btn sm" type="button" data-rm="' + i + '">Remove</button></div>' +
        '<span class="muted small">Usually around: ' + esc(p.zone) + ', ' + esc(p.time) + '</span>' +
        '<div class="chips"><span class="chip">Try instead</span>' + p.alt.map(function (a) { return '<span class="chip">' + esc(a) + '</span>'; }).join('') + '</div></div>';
    }).join('') || '<p class="muted small">Nobody on your list.</p>';
  }
  $('#av-list').addEventListener('click', function (e) {
    var b = e.target.closest('[data-rm]'); if (!b) { return; }
    AVOID.splice(+b.dataset.rm, 1); renderAvoid();
  });
  $('#av-add').addEventListener('click', function () {
    var v = $('#av-code').value.trim();
    if (!v) { return; }
    AVOID.push({ id: v.slice(0, 12), zone: 'Add a place on the map', time: 'any time', alt: ['Later today'] });
    $('#av-code').value = ''; renderAvoid();
  });
  $('#av-remind').addEventListener('click', function () {
    var on = this.getAttribute('aria-pressed') === 'true';
    this.setAttribute('aria-pressed', on ? 'false' : 'true'); this.textContent = on ? 'Remind me at 12:40' : 'Reminder set for 12:40';
  });
  renderAvoid();

  /* ---------- Challenges ---------- */
  var LV = ['Reluctant socialite', 'Quiet type', 'Silent', 'Hermit', 'Invisible legend'];
  function updatePlay() {
    var done = $$('#chs .ch[aria-pressed="true"]').length;
    var xp = 60 + done * 10, lv = Math.min(LV.length - 1, Math.floor(xp / 30));
    $('#xp').textContent = xp + ' XP'; $('#lv').textContent = LV[lv];
    $('#xp-bar').style.width = Math.min(100, ((xp - lv * 30) / 30) * 100) + '%';
    $('#done-n').textContent = done + ' / 3 today';
    $('#bd-3').classList.toggle('on', done === 3);
    $('#bd-2').classList.toggle('on', $('#ch-route').getAttribute('aria-pressed') === 'true');
  }
  $$('#chs .ch').forEach(function (b) {
    b.addEventListener('click', function () {
      b.setAttribute('aria-pressed', b.getAttribute('aria-pressed') === 'true' ? 'false' : 'true');
      $('.tick', b).textContent = b.getAttribute('aria-pressed') === 'true' ? '✓' : '';
      updatePlay();
    });
  });
  updatePlay();

  var h = (location.hash || '').slice(1);
  show(SCREENS.indexOf(h) >= 0 ? h : 'welcome');
})();
