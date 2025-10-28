/* assets/nav.js（ルート相対リンク & 自動展開/ハイライト） */
(function () {
  // ---- 1) ナビデータ（未定義ならデフォルトを用意） ----
  // すべて / から始まる「ルート相対パス」に統一
  if (!Array.isArray(window.PORTAL_NAV)) {
    window.PORTAL_NAV = [
      { id: "customers", label: "顧客管理", items: [
        { label: "基本ルール・定義",         href: "/pages/customers/basics.html" },
        { label: "名刺登録方法",             href: "/pages/customers/business-card.html" },
        { label: "リード登録方法",           href: "/pages/customers/lead-create.html" },
        { label: "取引先責任者登録方法",     href: "/pages/customers/contact-create.html" },
        { label: "取引先登録方法",           href: "/pages/customers/account-create/" }, // index.html 方式
      ]},
      { id: "deals", label: "案件管理", items: [
        { label: "基本ルール・定義",           href: "/pages/deals/basics.html" },
        { label: "新規案件（リード）",         href: "/pages/deals/opportunity-new-lead.html" },
        { label: "新規案件（取引先責任者）",   href: "/pages/deals/opportunity-new-contact.html" },
        { label: "既存案件（リード）",         href: "/pages/deals/opportunity-existing-lead.html" },
        { label: "既存案件（取引先責任者）",   href: "/pages/deals/opportunity-existing-contact.html" },
      ]},
      { id: "activities", label: "活動管理", items: [
        { label: "基本ルール・定義",   href: "/pages/activities/basics.html" },
        { label: "ToDoの登録",         href: "/pages/activities/todo.html" },
        { label: "行動の登録",         href: "/pages/activities/activity-log.html" },
        { label: "メール",             href: "/pages/activities/email.html" },
        { label: "Gmail連携",          href: "/pages/activities/gmail-integration.html" },
      ]},
      { id: "programs", label: "施策管理", items: [
        { label: "基本ルール・定義",           href: "/pages/programs/basics.html" },
        { label: "施策一覧",                   href: "/pages/programs/programs-list.html" },
        { label: "施策作成",                   href: "/pages/programs/program-create.html" },
        { label: "施策ステータス更新",         href: "/pages/programs/program-status.html" },
        { label: "ダッシュボード・レポート一覧", href: "/pages/programs/dashboards-reports.html" },
      ]},
      { id: "governance", label: "管理体制", items: [
        { label: "管理部門・ステークホルダー", href: "/pages/admin/stakeholders.html" },
        { label: "アカウント発行",             href: "/pages/admin/accounts-issue.html" },
        { label: "項目権限の追加・変更",       href: "/pages/admin/permissions.html" },
        { label: "データガバナンス",           href: "/pages/admin/governance.html" },
        { label: "問合せ先",                   href: "/pages/admin/contact.html" },
      ]},
    ];
  } else {
    // 既存 PORTAL_NAV に / を付けて正規化（保険）
    window.PORTAL_NAV.forEach(sec=>{
      (sec.items||[]).forEach(it=>{
        if (!/^([a-z]+:)?\/\//i.test(it.href) && !it.href.startsWith('/')) {
          it.href = '/' + it.href.replace(/^(\.\/)+/,'');
        }
      });
    });
  }

  // ---- 2) .html / index.html / ディレクトリ末尾 を同一視して比較 ----
  function canon(pathname) {
    const p = pathname.replace(/\/+/g,'/');
    let s = p.replace(/\/index\.html?$/i,'/').replace(/\.html?$/i,'/');
    if (!s.startsWith('/')) s = '/'+s;
    if (!s.endsWith('/'))  s = s+'/';
    return s;
  }
  function resolvePath(href) {
    const a = document.createElement('a'); a.href = href;
    return canon(a.pathname);
  }

  // ---- 3) 初期化本体 ----
  window.initPortalNav = function initPortalNav() {
    const NAV = window.PORTAL_NAV || [];
    const container = document.getElementById('primary-menu');
    if (!container) return;

    if (container.dataset.initialized === '1') container.innerHTML = '';
    container.dataset.initialized = '1';

    // 大項目だけ描画
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

    // クリックでトグル
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

    // TOP は未展開、詳細ページは自動展開 & ハイライト
    const herePath = canon(location.pathname);
    const isTop = (herePath === '/');
    if (!isTop) {
      let matchSectionId = null;
      NAV.forEach(sec=>{
        (sec.items||[]).forEach(it=>{
          if (resolvePath(it.href) === herePath) matchSectionId = sec.id;
        });
      });
      if (matchSectionId) {
        openSubmenu(matchSectionId);
        const link = [...document.querySelectorAll('.submenu-link')]
          .find(a => canon(a.pathname) === herePath);
        if (link) link.classList.add('is-current');
      }
    }

    // ホットゾーン & ボタン（従来通り）
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

      document.body.classList.add(OPEN_CLASS); // サイドバー自体は開いた状態で開始
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

  // 自動初期化
  function safeInit(){
    if (document.getElementById('primary-menu')) window.initPortalNav();
    else setTimeout(safeInit, 100);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', safeInit);
  else safeInit();
})();
