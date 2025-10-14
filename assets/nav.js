<script>
/* ===========================================================
   NAV（共通メニュー）— これ1本を全ページで読み込むだけ
   - 相対パスは自動で補正（TOP/下層どちらでもOK）
   - 現在ページに一致する中項目があれば自動展開＆ハイライト
   - 左端ホットゾーン（カーソルで出し入れ）も自動セット
   - 既存の styles.css のクラス（.menu / .submenu 等）を使用
   =========================================================== */

/* --- サイト共通：メニュー定義（日本語表示／root 相対の href） --- */
const NAV_DATA = [
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
      { label: "基本ルール・定義",         href: "pages/deals/basics.html" },
      { label: "新規案件（リード）",       href: "pages/deals/opportunity-new-lead.html" },
      { label: "新規案件（取引先責任者）", href: "pages/deals/opportunity-new-contact.html" },
      { label: "既存案件（リード）",       href: "pages/deals/opportunity-existing-lead.html" },
      { label: "既存案件（取引先責任者）", href: "pages/deals/opportunity-existing-contact.html" },
    ]
  },
  {
    id: "activities", label: "活動管理",
    items: [
      { label: "基本ルール・定義",         href: "pages/activities/basics.html" },
      { label: "ToDo の登録",              href: "pages/activities/todo.html" },
      { label: "行動の登録",               href: "pages/activities/activity-log.html" },
      { label: "メール",                   href: "pages/activities/email.html" },
      { label: "Gmail 連携",               href: "pages/activities/gmail-integration.html" },
    ]
  },
  {
    id: "programs", label: "施策管理",
    items: [
      { label: "基本ルール・定義",         href: "pages/programs/basics.html" },
      { label: "施策一覧",                 href: "pages/programs/programs-list.html" },
      { label: "施策作成",                 href: "pages/programs/program-create.html" },
      { label: "施策ステータス更新",       href: "pages/programs/program-status.html" },
      { label: "ダッシュボード・レポート一覧", href: "pages/programs/dashboards-reports.html" },
    ]
  },
  {
    id: "admin", label: "管理体制",
    items: [
      { label: "管理部門・ステークホルダー", href: "pages/admin/stakeholders.html" },
      { label: "アカウント発行",             href: "pages/admin/accounts-issue.html" },
      { label: "項目権限の追加・変更",       href: "pages/admin/permissions.html" },
      { label: "データガバナンス",           href: "pages/admin/governance.html" },
      { label: "問い合わせ先",               href: "pages/admin/contact.html" },
    ]
  },
];

/* --- util: 現在のページ深度からサイト root への相対を推定 --- */
function detectBase() {
  // 例: /index.html -> ''
  //     /pages/deals/xxx.html -> '../../'
  const path = location.pathname.replace(/\\/g, '/'); // Win 対策
  const i = path.indexOf('/pages/');
  if (i === -1) return ''; // ルート直下
  // /pages/ 以降のスラッシュの数で深さ決定
  const rest = path.slice(i + '/pages/'.length);
  const depth = (rest.match(/\//g) || []).length; // 例: deals/xxx.html -> 1
  // ルートからの相対: '../../' + ('../' を depth-1 回) だが、/pages/までは必ず'../..'
  return '../'.repeat(2 + Math.max(0, depth));
}

/* --- サイドバー構築（#primary-menu があるときだけ動く） --- */
function buildSidebar(options = {}) {
  const base = options.base ?? detectBase();
  const holder = document.getElementById('primary-menu');
  if (!holder) return;

  // 1) ルート相対 href を base 付きに
  const resolve = (href) => base + href.replace(/^\/?/, '');

  // 2) メニュー描画
  holder.innerHTML = '';
  NAV_DATA.forEach(sec => {
    const li = document.createElement('li');
    li.className = 'menu-item';
    li.innerHTML = `
      <button class="menu-btn" data-id="${sec.id}">${sec.label}</button>
      <ul class="submenu" data-parent="${sec.id}" hidden></ul>
    `;
    holder.appendChild(li);
  });

  // 3) サブメニューを開く関数
  function openSubmenu(id) {
    document.querySelectorAll('.submenu').forEach(ul => { ul.hidden = true; ul.innerHTML=''; });
    document.querySelectorAll('.menu-btn').forEach(b => b.classList.toggle('active', b.dataset.id === id));
    const sec = NAV_DATA.find(s => s.id === id); if (!sec) return;
    const ul = document.querySelector(`.submenu[data-parent="${id}"]`);
    sec.items.forEach(item => {
      const li = document.createElement('li');
      li.innerHTML = `<a class="submenu-link" href="${resolve(item.href)}">${item.label}</a>`;
      ul.appendChild(li);
    });
    ul.hidden = false;
  }

  // 4) クリックで開閉
  holder.addEventListener('click', (e) => {
    if (!e.target.matches('.menu-btn')) return;
    const id = e.target.dataset.id;
    const active = e.target.classList.contains('active');
    if (active) {
      document.querySelector(`.submenu[data-parent="${id}"]`).hidden = true;
      e.target.classList.remove('active');
    } else {
      openSubmenu(id);
    }
  });

  // 5) 現在ページに一致するセクションを自動展開＆ハイライト
  const here = location.pathname.replace(/\\/g,'/'); // 実URL（/で正規化）
  // どのセクションに属しているか判定
  const matched = NAV_DATA.find(sec => sec.items.some(it => here.endsWith('/' + it.href)));
  if (matched) {
    openSubmenu(matched.id);
    // ハイライト（リンク描画後に実行）
    const target = [...document.querySelectorAll('.submenu-link')]
      .find(a => here.endsWith('/' + a.getAttribute('href').replace(base,'')));
    if (target) target.classList.add('is-current');
  }

  // 6) 左端ホットゾーン（カーソル出し入れ）自動セット
  (function(){
    const zone = document.createElement('div');
    zone.className = 'edge-hotzone';
    document.body.appendChild(zone);

    const OPEN_CLASS = 'sidebar-open';
    let timer = null;
    const open = () => { if (timer) { clearTimeout(timer); timer=null; } document.body.classList.add(OPEN_CLASS); };
    const close= () => { if (timer) clearTimeout(timer); timer=setTimeout(()=>document.body.classList.remove(OPEN_CLASS), 200); };

    zone.addEventListener('mouseenter', open);
    zone.addEventListener('mouseleave', close);
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) { sidebar.addEventListener('mouseenter', open); sidebar.addEventListener('mouseleave', close); }
    document.addEventListener('keydown', e => { if (e.key === 'Escape') document.body.classList.remove(OPEN_CLASS); });
    document.body.classList.remove(OPEN_CLASS); // 初期は閉じる
  })();
}

/* --- 公開関数 --- */
window.initPortalNav = function(options){ buildSidebar(options); };
</script>
