export default [
  {
    _tag: 'CSidebarNavItem',
    name: 'Dashboard',
    to: '/admin/dashboard',
    icon: 'cil-home',
  },
  {
    _tag: 'CSidebarNavTitle',
    _children: ['Data']
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Data Master',
    to: '/admin/data-master',
    icon: 'cil-notes',
    badge: {
      color: 'danger',
      text: 'SuperAdmin',
    },
  },
  {
    _tag: 'CSidebarNavDropdown',
    name: 'Data Pengguna',
    route: '/admin/data-pengguna',
    icon: 'cil-user',
    _children: [
      {
        _tag: 'CSidebarNavItem',
        name: 'Staff',
        to: '/admin/data-pengguna/staff',
        badge: {
          color: 'danger',
          text: 'SuperAdmin',
        },
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'User',
        to: '/admin/data-pengguna/user',
        badge: {
          color: 'danger',
          text: 'SuperAdmin',
        },
      },
    ],
  },
  {
    _tag: 'CSidebarNavTitle',
    _children: ['CMS']
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Konten',
    to: '/admin/cms-konten',
    icon: 'cil-circle',
    badge: {
      color: 'danger',
      text: 'SuperAdmin',
    },
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Kontak',
    to: '/admin/cms-kontak',
    icon: 'cil-circle',
    badge: {
      color: 'danger',
      text: 'SuperAdmin',
    },
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Produk',
    to: '/admin/cms-produk',
    icon: 'cil-circle',
    badge: {
      color: 'danger',
      text: 'SuperAdmin',
    },
  },
  {
    _tag: 'CSidebarNavTitle',
    _children: ['Fitur Utama']
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Pengajuan Kredit',
    to: '/admin/main/pengajuan-kredit',
    icon: 'cil-circle',
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Pendaftar Kerja',
    to: '/admin/main/pendaftar-kerja',
    icon: 'cil-circle',
    badge: {
      color: 'success',
      text: 'HRD',
    },
  }
]

