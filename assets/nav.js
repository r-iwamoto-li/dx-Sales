<script>
// =======================
// 共通ナビ (PORTAL_NAV)
// =======================
window.PORTAL_NAV = [
  {
    id: "customers", label: "顧客管理",
    items: [
      { label: "基本ルール・定義",         href: "pages/customers/basics.html" },
      { label: "名刺登録方法",             href: "pages/customers/business-card.html" },
      { label: "リード登録方法",           href: "pages/customers/lead-create.html" },
      { label: "取引先責任者登録方法",     href: "pages/customers/contact-create.html" },
      { label: "取引先登録方法",           href: "pages/customers/account-create.html" },
    ]
  },
  {
    id: "deals", label: "案件管理",
    items: [
      { label: "基本ルール・定義",           href: "pages/deals/basics.html" },
      { label: "新規案件（リード）",         href: "pages/deals/opportunity-new-lead.html" },
      { label: "新規案件（取引先責任者）",   href: "pages/deals/opportunity-new-contact.html" },
      { label: "既存案件（リード）",         href: "pages/deals/opportunity-existing-lead.html" },
      { label: "既存案件（取引先責任者）",   href: "pages/deals/opportunity-existing-contact.html" },
    ]
  },
  {
    id: "activities", label: "活動管理",
    items: [
      { label: "基本ルール・定義",   href: "pages/activities/basics.html" },
      { label: "ToDoの登録",         href: "pages/activities/todo.html" },
      { label: "行動の登録",         href: "pages/activities/activity-log.html" },
      { label: "メール",             href: "pages/activities/email.html" },
      { label: "Gmail連携",          href: "pages/activities/gmail-integration.html" },
    ]
  },
  {
    id: "programs", label: "施策管理",
    items: [
      { label: "基本ルール・定義",           href: "pages/programs/basics.html" },
      { label: "施策一覧",                   href: "pages/programs/programs-list.html" },
      { label: "施策作成",                   href: "pages/programs/program-create.html" },
      { label: "施策ステータス更新",         href: "pages/programs/program-status.html" },
      { label: "ダッシュボード・レポート一覧", href: "pages/programs/dashboards-reports.html" },
    ]
  },
  {
    id: "governance", label: "管理体制",
    items: [
      { label: "管理部門・ステークホルダー", href: "pages/admin/stakeholders.html" },
      { label: "アカウント発行",             href: "pages/admin/accounts-issue.html" },
      { label: "項目権限の追加・変更",       href: "pages/admin/permissions.html" },
      { label: "データガバナンス",           href: "pages/admin/governance.html" },
      { label: "問合せ先",                   href: "pages/admin/contact.html" },
    ]
  },
];

// =======================
// サイドバー生成（重複防止）
// =======================
window.initPortalNav = function initPortalNav() {
  const NAV = window.PORTAL_NAV || [];
  const container = document.getElementById('primary-menu');
  if (!container) return;

  // ★重複防止：毎回初期化
  if (container.dataset.initialized === '1') {
    container.innerHTML = '';
  }
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
    sec.items.forEach(item => {
      const li = document.createElement('li');
      li.innerHTML = `<a class="submenu-link" href="${item.href}">${item.label}</a>`;
      holder.appendChild(li);
    });
    holder.hidden = false;
  }

  // クリックでアコーディオン
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

  // 初期は最初のセクションを展開
  if (NAV[0]) openSubmenu(NAV[0].id);

  // =======================
  // ホットゾーン（重複防止）
  // =======================
  if (!document.querySelector('.edge-hotzone')) {
    const zone = document.createElement('div');
    zone.className = 'edge-hotzone';
    document.body.appendChild(zone);

    const OPEN_CLASS = 'sidebar-open';
    let timer = null;
    const openSidebar = () => {
      if (timer) { clearTimeout(timer); timer = null; }
      document.body.classList.add(OPEN_CLASS);
    };
    const maybeClose = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => document.body.classList.remove(OPEN_CLASS), 200);
    };

    zone.addEventListener('mouseenter', openSidebar);
    zone.addEventListener('mouseleave', maybeClose);

    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
      sidebar.addEventListener('mouseenter', openSidebar);
      sidebar.addEventListener('mouseleave', maybeClose);
    }
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') document.body.classList.remove(OPEN_CLASS);
    });

    // 初期状態：閉じる
    document.body.classList.remove(OPEN_CLASS);
  }
};
</script>
