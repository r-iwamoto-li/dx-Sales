/* assets/nav.js */
(function () {
  // 1) どの階層からでも動くように前置パスを算出
  // 例) /index.html → ''、/pages/customers/... → '../../'
  function basePrefix() {
    const p = location.pathname.replace(/\/+/g,'/'); // 正規化
    const depth = (p.match(/\//g) || []).length - 1; // 先頭/含む
    // ルート直下(index.htmlなど)なら '', /pages/... なら '../../' 相当
    // わかりやすく、/pages/ より深い時は '../../' に固定
    return p.includes('/pages/') ? '../../' : '';
  }
  const BASE = basePrefix();

  // 2) ナビデータ（未定義ならデフォルト）
  if (!Array.isArray(window.PORTAL_NAV)) {
    window.PORTAL_NAV = [
      {
        id: "customers", label: "顧客管理",
        items: [
          { label: "基本ルール・定義",         href: BASE + "pages/customers/basics.html" },
          { label: "名刺登録方法",             href: BASE + "pages/customers/business-card.html" },
          { label: "リード登録方法",           href: BASE + "pages/customers/lead-create.html" },
          { label: "取引先責任者登録方法",     href: BASE + "pages/customers/contact-create.html" },
          { label: "取引先登録方法",           href: BASE + "pages/customers/account-create.html" },
        ]
      },
      {
        id: "deals", label: "案件管理",
        items: [
          { label: "基本ルール・定義",           href: BASE + "pages/deals/basics.html" },
          { label: "新規案件（リード）",         href: BASE + "pages/deals/opportunity-new-lead.html" },
          { label: "新規案件（取引先責任者）",   href: BASE + "pages/deals/opportunity-new-contact.html" },
          { label: "既存案件（リード）",         href: BASE + "pages/deals/opportunity-existing-lead.html" },
          { label: "既存案件（取引先責任者）",   href: BASE + "pages/deals/opportunity-existing-contact.html" },
        ]
      },
      {
        id: "activities", label: "活動管理",
        items: [
          { label: "基本ルール・定義",   href: BASE + "pages/activities/basics.html" },
          { label: "ToDoの登録",         href: BASE + "pages/activities/todo.html" },
          { label: "行動の登録",         href: BASE + "pages/activities/activity-log.html" },
          { label: "メール",             href: BASE + "pages/activities/email.html" },
          { label: "Gmail連携",          href: BASE + "pages/activities/gmail-integration.html" },
        ]
      },
      {
        id: "programs", label: "施策管理",
        items: [
          { label: "基本ルール・定義",           href: BASE + "pages/programs/basics.html" },
          { label: "施策一覧",                   href: BASE + "pages/programs/programs-list.html" },
          { label: "施策作成",                   href: BASE + "pages/programs/program-create.html" },
          { label: "施策ステータス更新",         href: BASE + "pages/programs/program-status.html" },
          { label: "ダッシュボード・レポート一覧", href: BASE + "pages/programs/dashboards-reports.html" },
        ]
      },
      {
        id: "governance", label: "管理体制",
        items: [
          { label: "管理部門・ステークホルダー", href: BASE + "pages/admin/stakeholders.html" },
          { label: "アカウント発行",             href: BASE + "pages/admin/accounts-issue.html" },
          { label: "項目権限の追加・変更",       href: BASE + "pages/admin/permissions.html" },
          { label: "データガバナンス",           href: BASE + "pages/admin/governance.html" },
          { label: "問合せ先",                   href: BASE + "pages/admin/contact.html" },
        ]
      },
    ];
  } else {
    // 既存 PORTAL_NAV にも BASE を付与（相対リンクだった場合の保険）
    window.PORTAL_NAV.forEach(sec=>{
      (sec.items||[]).forEach(it=>{
        if (!/^([a-z]+:)?\/\//i.test(it.href) && !it.href.startsWith('/') && !it.href.startsWith(BASE)) {
          it.href = BASE + it.href.replace(/^(\.\/)+/, '');
        }
      });
    });
  }

  // 3) 初期化本体
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

  // 4) 自動初期化
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
