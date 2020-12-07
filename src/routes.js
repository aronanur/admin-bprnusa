import React from 'react';

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'));
const Staff = React.lazy(() => import('./views/datapengguna/Staff'));
const DataMaster = React.lazy(() => import('./views/datamaster/DataMaster'));
const User = React.lazy(() => import('./views/datapengguna/User'));
const Konten = React.lazy(() => import('./views/datakonten/Konten'));
const FormAddKonten = React.lazy(() => import("./views/datakonten/FormAddKonten"));
const FormUser = React.lazy(() => import("./views/datapengguna/FormUser"));
const Karir = React.lazy(() => import("./views/datakarir/Karir"));
const PengajuanKredit = React.lazy(() => import("./views/pengajuankredit/PengajuanKredit"));
const DetailDth = React.lazy(() => import("./views/pengajuankredit/DetailPengajuanDTH"));
const DetailSertifikat = React.lazy(() => import("./views/pengajuankredit/DetailPengajuanSertifikat"));
const DetailKendaraan = React.lazy(() => import("./views/pengajuankredit/DetailPengajuanKendaraan"));
const Kontak = React.lazy(() => import("./views/datakontak/Kontak"));
const Produk = React.lazy(() => import("./views/dataproduk/Produk"));
const FormAddProduk = React.lazy(() => import("./views/dataproduk/FormAddProduk"));

const routes = [
  { path: '/admin', exact: true, name: 'Home' },
  { path: '/admin/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/admin/data-master', exact: true, name: 'Data Master', component: DataMaster },
  { path: '/admin/cms-kontak', exact: true, name: 'Kontak', component: Kontak },
  { path: '/admin/cms-produk', exact: true, name: 'Produk', component: Produk },
  { path: '/admin/cms-produk/form', name: 'Form Add Produk', component: FormAddProduk },
  { path: '/admin/cms-produk/edit-form/:produkId', name: 'Form Edit Produk', component: FormAddProduk },
  { path: '/admin/cms-konten', exact: true, name: 'Konten', component: Konten },
  { path: '/admin/cms-konten/form', name: 'Form Add Konten', component: FormAddKonten },
  { path: '/admin/cms-konten/edit-form/:kontenId', name: 'Form Edit Konten', component: FormAddKonten },
  { path: '/admin/data-pengguna', exact: true, name: 'Data Pengguna', component: Staff },
  { path: '/admin/main/pendaftar-kerja', exact: true, name: 'Pendaftar Kerja', component: Karir },
  { path: '/admin/main/pendaftar-kerja/detail-dana-talangan-haji/:kreditId', exact: true, name: 'Detail Dana Talangan Haji', component: DetailDth },
  { path: '/admin/main/pendaftar-kerja/detail-sertifikat/:kreditId', exact: true, name: 'Detail Pengajuan Sertifikat', component: DetailSertifikat },
  { path: '/admin/main/pendaftar-kerja/detail-kendaraan/:kreditId', exact: true, name: 'Detail Pengajuan Kendaraan', component: DetailKendaraan },
  { path: '/admin/main/pengajuan-kredit', exact: true, name: 'Pengajuan Kredit', component: PengajuanKredit },
  { path: '/admin/data-pengguna/staff', name: 'Staff', component: Staff },
  { path: '/admin/data-pengguna/user', exact: true, name: 'User', component: User },
  { path: '/admin/data-pengguna/user/user-registration', name: 'Form User', component: FormUser },
  { path: '/admin/data-pengguna/user/user-update/:userId', name: 'Form User Update', component: FormUser }
];

export default routes;
