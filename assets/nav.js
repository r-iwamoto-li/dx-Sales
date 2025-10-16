/* assets/nav.js －－－－－－－－－－－－－－－－－－－－－ */
(function () {
  // ===== ルート相対URLで統一（/pages/.../） =====
  // もしサブディレクトリ配下にサイトを置く場合は、
  // window.NAV_ROOT = '/your/subpath'; を index.html 等で定義してください（末尾スラッシュなし）
  const ROOT = (typeof window.NAV_ROOT === 'string' ? window.NAV_ROOT.replace(/\/$/, '') : '');

  // クリーンURLに正規化： .html を外し、末尾スラッシュを付ける（クエリ・ハッシュは温存）
  function toDirUrl(href) {
    if (!href) return href;
    // 絶対URL(http/https)はそのまま
    if (/^[a-z]+:\/\//i.test(href)) return href;

    // 先頭に ROOT が付いていなければ付与（/pages/... を想定）
    let url = href.startsWith('/') ? href : ('/'+href).replace(/\/{2,}/g,'/');

    // 末尾 .html → / に置換（例: /pages/foo.html → /pages/foo/）
    url = url.replace(/\/index\.html$/i, '/');     // index.html 明示のとき
    url = url.replace(/\.html$/i, '/');            // 通常の .html

    // 末尾に / を必ずつける（ただし ? や # がある場合はその手前で調整）
    if (/[?#]/.test(url)) {
      // /path/file?x → /path/file/?x
      url = url.replace(/([^/])(?=[?#])/, '$1/');
      url = url.replace(/\/+(?=[?#])/, '/'); // スラッシュの重複抑止
    } else if (!url.endsWith('/')) {
      url += '/';
    }

    // ROOT を前置（ROOT は '' か '/subpath'）
    if (ROOT && !url.startsWith(ROOT + '/')) {
      url = (ROOT + url).replace(/\/{2,}/g,'/');
    }
    return url;
  }

  // ===== 1) ナビデータ（未定義ならデフォルトを用意） =====
  if (!Array.isArray(window.PORTAL_NAV)) {
    window.PORTAL_NAV = [
      {
        id: "customers", label: "顧客管理",
        items: [
          { label: "基本ルール・定義",         href: toDirUrl('/pages/customers/basics') },
          { label: "名刺登録方法",             href: toDirUrl('/pages/customers/business-card') },
          { label: "リード登録方法",           href: toDirUrl('/pages/customers/lead-create') },
          { label: "取引先責任者登録方法",     href: toDirUrl('/pages/customers/contact-create') },
          { label: "取引先登録方法",           href: toDirUrl('/pages/customers/account-create') },
        ]
      },
      {
        id: "deals", label: "案件管理",
        items: [
          { label: "基本ルール・定義",           href: toDirUrl('/pages/deals/basics') },
          { label: "新規案件（リード）",         href: toDirUrl('/pages/deals/opportunity-new-lead') },
          { label: "新規案件（取引先責任者）",   href: toDirUrl('/pages/deals/opportunity-new-contact') },
          { label: "既存案件（リード）",         href: toDirUrl('/pages/deals/opportunity-existing-lead') },
          { label: "既存案件（取引先責任者）",   href: toDirUrl('/pages/deals/opportunity-existing-contact') },
        ]
      },
      {
        id: "activities", label: "活動管理",
        items: [
          { label: "基本ルール・定義",   href: toDirUrl('/pages/activities/basics') },
          { label: "ToDoの登録",         href: toDirUrl('/pages/activities/todo') },
          { label: "行動の登録",         href: toDirUrl('/pages/activities/activity-log') },
          { label: "メール",             href: toDirUrl('/pages/activities/email') },
          { label: "Gmail連携",          href: toDirUrl('/pages/activities/gmail-integration') },
        ]
      },
      {
        id: "programs", label: "施策管理",
        items: [
          { label: "基本ルール・定義",           href: toDirUrl('/pages/programs/basics') },
          { label: "施策一覧",                   href: toDirUrl('/pages/programs/programs-list') },
          { label: "施策作成",                   href: toDirUrl('/pages/programs/program-create') },
          { label: "施策ステータス更新",         href: toDirUrl('/pages/programs/program-status') },
          { label: "ダッシュボード・レポート一覧", href: toDirUrl('/pages/programs/dashboards-reports') },
        ]
      },
      {
        id: "governance", label: "管理体制",
        items: [
          { label: "管理部門・ステークホルダー", href: toDirUrl('/pages/admin/stakeholders') },
          { label: "アカウント発行",             href: toDirUrl('/pages/admin/accounts-issue') },
          { label: "項目権限の追加・変更",       href: toDirUrl('/pages/admin/permissions') },
          { label: "データガバナンス",           href: toDirUrl('/pages/admin/governance') },
          { label: "問合せ先",                   href: toDirUrl('/pages/admin/contact') },
        ]
      },
    ];
  } else {
    // 既存 PORTAL_NAV があれば、各 href をクリーンURLへ正規化
    window.PORTAL_NAV.forEach(sec=>{
      (sec.items||[]).forEach(it=>{
        it.href = toDirUrl(it.href);
      });
    });
  }

  // ===== 2) 初期化本体（サイドバー生成） =====
  window.initPortalNav = function initPortalNav() {
    const NAV = window.PORTAL_NAV || [];
    const container = document.getElementById('primary-menu');
    if (!container) return;

    if (container.dataset.initialized === '1') container.innerHTML = '';
    container.dataset.initialized = '1';

    NAV.forEach((s) => {
      const li = document.createElement('li');
      li.className = 'menu-item';
      li.innerHTML = `
        <button class="menu-btn" data-id="${s.id}">${s.label}</button>
        <ul class="submenu" data-parent="${s.id}" hidden></ul>
      `;
      container.appendChild(li);
    });

    function openSubmenu(id) {
      document.querySelectorAll('.submenu').forEach(ul => { ul.hidden = true; ul.innerHTML = ''; });
      document.querySelectorAll('.menu-btn').forEach(b => b.classList.toggle('active', b.dataset.id === id));
      const sec = NAV.find(s => s.id === id);
      if (!sec) return;
      const holder = document.querySelector(`.submenu[data-parent="${id}"]`);
      (sec.items||[]).forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `<a class="submenu-link" href="${item.href}">${item.label}</a>`;
        holder.appendChild(li);
      });
      holder.hidden = false;
    }

    if (!container.dataset.clickBound) {
      container.addEventListener('click', (e) => {
        if (!e.target.matches('.menu-btn')) return;
        const id = e.target.dataset.id;
        const isActive = e.target.classList.contains('active');
        if (isActive) {
          document.querySelector(`.submenu[data-parent="${id}"]`).hidden = true;
          e.target.classList.remove('active');
        } else {
          openSubmenu(id);
        }
      });
      container.dataset.clickBound = '1';
    }

    if (NAV[0]) openSubmenu(NAV[0].id);

    // ===== ホットゾーン＆トグル（初期は開いた状態でスタート） =====
    if (!document.querySelector('.edge-hotzone')) {
      const zone = document.createElement('div');
      zone.className = 'edge-hotzone';
      zone.style.zIndex = '2000';
      document.body.appendChild(zone);

      const OPEN_CLASS = 'sidebar-open';
      let timer = null;
      const openSidebar = () => { if (timer) { clearTimeout(timer); timer = null; } document.body.classList.add(OPEN_CLASS); };
      const maybeClose   = () => { if (timer) clearTimeout(timer); timer = setTimeout(()=>document.body.classList.remove(OPEN_CLASS),200); };

      zone.addEventListener('mouseenter', openSidebar);
      zone.addEventListener('mouseleave', maybeClose);

      const sidebar = document.querySelector('.sidebar');
      if (sidebar) {
        sidebar.addEventListener('mouseenter', openSidebar);
        sidebar.addEventListener('mouseleave', maybeClose);
      }
      document.addEventListener('keydown', (e) => { if (e.key === 'Escape') document.body.classList.remove(OPEN_CLASS); });

      // 初期表示は展開状態
      document.body.classList.add(OPEN_CLASS);
    }

    if (!document.getElementById('nav-toggle')) {
      const btn = document.createElement('button');
      btn.id = 'nav-toggle';
      btn.type = 'button';
      btn.textContent = '≡ メニュー';
      Object.assign(btn.style, {
        position:'fixed', left:'10px', bottom:'12px', zIndex:'2001',
        padding:'6px 10px', borderRadius:'8px', border:'1px solid #334155',
        background:'#0f172a', color:'#fff', cursor:'pointer'
      });
      btn.addEventListener('click', () => document.body.classList.toggle('sidebar-open'));
      document.body.appendChild(btn);
    }
  };

  // ===== 3) 自動初期化 =====
  function safeInit(){
    if (document.getElementById('primary-menu')) {
      window.initPortalNav();
    } else {
      setTimeout(safeInit, 100);
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', safeInit);
  else safeInit();
})();
