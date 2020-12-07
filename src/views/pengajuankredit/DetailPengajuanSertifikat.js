import React, { useState, useEffect } from 'react';
import {
  CRow,
  CCol,
  CCard,
  CCardHeader,
  CCardBody,
  CButton,
  CFormGroup,
  CLabel
} from '@coreui/react';
import { useParams, useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { bprNusaServer } from '../../server/api';
import Helper from '../../helpers/helper';

export default function DetailPengajuanSertifikat() {
  const history = useHistory();
  const dispatch = useDispatch();
  const { kreditId } = useParams();
  const [detailDth, setDetailDth] = useState([]);
  const [loading, setLoading] = useState(false);

  const getDetailDth = async () => {
    try {
      const { data } = await bprNusaServer.get(`/pengajuan-kredit/admin/data/detail-sertifikat/${kreditId}`, {
        headers: {
          admin_access_token: localStorage.admin_access_token
        }
      });

      if (data) {
        if (data.statusCode == 200) {
          setDetailDth(data.body);
        }
      }

    } catch (error) {
      console.log(error, " << ")
      toast.error(" ⚠ Terjadi Kesalahan Pada Jaringan, Silahkan Cek Jaringan Anda");
    }
  }

  useEffect(() => {
    getDetailDth()
  }, []);

  return (
    <CRow>
      <CCol xs={12}>
        <CCard>
          <CCardHeader style={{ fontSize: 18, fontWeight: 'bold' }}>
            Detail Pengajuan Sertifikat
            <div className="card-header-actions">
              <CButton
                size="sm"
                color="danger"
                onClick={() => history.goBack()}>
                <span style={{ position: "relative", top: 2 }}>Kembali</span>
              </CButton>
            </div>
          </CCardHeader>
          <CCardBody>
            {
              detailDth[0]
                ?
                <>
                  <CCol xs={12}>
                    <h5>1. Informasi User</h5>
                    <CRow>
                      <CCol
                        className="mt-2"
                        md={4}>
                        <CFormGroup>
                          <CLabel style={{ fontWeight: 'bold' }}>Nomor Handphone</CLabel>
                          <p style={{ fontSize: 12 }}>{detailDth[0].noHp}</p>
                        </CFormGroup>
                      </CCol>
                      <CCol
                        md={4}>
                        <CFormGroup>
                          <CLabel style={{ fontWeight: 'bold' }}>Email</CLabel>
                          <p style={{ fontSize: 12 }}>{detailDth[0].email}</p>
                        </CFormGroup>
                      </CCol>
                      <CCol
                        md={4}>
                        <CFormGroup>
                          <CLabel style={{ fontWeight: 'bold' }}>Nama Lengkap</CLabel>
                          <p style={{ fontSize: 12 }}>{detailDth[0].namaLengkap}</p>
                        </CFormGroup>
                      </CCol>
                      <CCol
                        md={4}>
                        <CFormGroup>
                          <CLabel style={{ fontWeight: 'bold' }}>Alamat</CLabel>
                          <p style={{ fontSize: 12 }}>{detailDth[0].alamat}</p>
                        </CFormGroup>
                      </CCol>
                      <CCol
                        md={4}>
                        <CFormGroup>
                          <CLabel style={{ fontWeight: 'bold' }}>Kabupaten / Kota</CLabel>
                          <p style={{ fontSize: 12 }}>{detailDth[0].kota}</p>
                        </CFormGroup>
                      </CCol>
                      <CCol
                        md={4}>
                        <CFormGroup>
                          <CLabel style={{ fontWeight: 'bold' }}>Kecamatan</CLabel>
                          <p style={{ fontSize: 12 }}>{detailDth[0].kecamatan}</p>
                        </CFormGroup>
                      </CCol>
                      <CCol
                        md={4}>
                        <CFormGroup>
                          <CLabel style={{ fontWeight: 'bold' }}>Kelurahan  / Desa</CLabel>
                          <p style={{ fontSize: 12 }}>{detailDth[0].kelurahan}</p>
                        </CFormGroup>
                      </CCol>
                      <CCol
                        md={4}>
                        <CFormGroup>
                          <CLabel style={{ fontWeight: 'bold' }}>Nomor KTP</CLabel>
                          <p style={{ fontSize: 12 }}>{detailDth[0].noKtp}</p>
                        </CFormGroup>
                      </CCol>
                      <CCol
                        md={4}>
                        <CFormGroup>
                          <CLabel style={{ fontWeight: 'bold' }}>Foto KTP</CLabel>
                          <p>
                            <a href={detailDth[0].fotoKtp} style={{ cursor: 'pointer' }}><img src={detailDth[0].fotoKtp} style={{ width: 250, height: 150, borderRadius: 10 }} /></a>
                          </p>
                        </CFormGroup>
                      </CCol>
                    </CRow>
                  </CCol>
                  <CCol className="mt-2" xs={12}>
                    <h5>2. Informasi Data Pengajuan Kredit</h5>
                    <CRow>
                      <CCol
                        md={4}>
                        <CFormGroup>
                          <CLabel style={{ fontWeight: 'bold' }}>Tanggal Pengajuan</CLabel>
                          <p style={{ fontSize: 12 }}>{detailDth[0].tglPengajuan ? Helper.dateFormat(detailDth[0].tglPengajuan) : '-'}</p>
                        </CFormGroup>
                      </CCol>
                      <CCol
                        md={4}>
                        <CFormGroup>
                          <CLabel style={{ fontWeight: 'bold' }}>Tanggal Pencairan</CLabel>
                          <p style={{ fontSize: 12 }}>{detailDth[0].tglPencairan ? Helper.dateFormat(detailDth[0].tglPencairan) : '-'}</p>
                        </CFormGroup>
                      </CCol>
                      <CCol
                        md={4}>
                        <CFormGroup>
                          <CLabel style={{ fontWeight: 'bold' }}>Deadline Pembayaran</CLabel>
                          <p style={{ fontSize: 12 }}>{detailDth[0].deadlinePembayaran ? Helper.dateFormat(detailDth[0].deadlinePembayaran) : '-'}</p>
                        </CFormGroup>
                      </CCol>
                      <CCol
                        md={4}>
                        <CFormGroup>
                          <CLabel style={{ fontWeight: 'bold' }}>Pinjaman Terbayar</CLabel>
                          <p style={{ fontSize: 12 }}>{detailDth[0].pinjamanTerbayar ? Helper.AmountFormat(detailDth[0].pinjamanTerbayar) : 'Rp. 0'}</p>
                        </CFormGroup>
                      </CCol>
                      <CCol
                        md={4}>
                        <CFormGroup>
                          <CLabel style={{ fontWeight: 'bold' }}>Nomor Akun</CLabel>
                          <p style={{ fontSize: 12 }}>{detailDth[0].noAkun || "-"}</p>
                        </CFormGroup>
                      </CCol>
                      <CCol
                        md={4}>
                        <CFormGroup>
                          <CLabel style={{ fontWeight: 'bold' }}>Nomor Pengajuan</CLabel>
                          <p style={{ fontSize: 12 }}>{detailDth[0].noPengajuan || "-"}</p>
                        </CFormGroup>
                      </CCol>
                    </CRow>
                  </CCol>
                  <CCol
                    className="mt-2"
                    xs={12}>
                    <h5>3. Informasi Data Pinjaman</h5>
                    <CRow>
                      <CCol
                        md={4}>
                        <CFormGroup>
                          <CLabel style={{ fontWeight: 'bold' }}>Dana Pinjaman</CLabel>
                          <p style={{ fontSize: 12 }}>{detailDth[0].danaPinjaman ? "Rp. " + Helper.AmountFormat(detailDth[0].danaPinjaman) : 'Rp. 0'}</p>
                        </CFormGroup>
                      </CCol>
                      <CCol
                        md={4}>
                        <CFormGroup>
                          <CLabel style={{ fontWeight: 'bold' }}>Jangka Waktu</CLabel>
                          <p style={{ fontSize: 12 }}>{detailDth[0].jangkaWaktu} Bulan</p>
                        </CFormGroup>
                      </CCol>
                    </CRow>
                  </CCol>
                  <CCol
                    className="mt-2"
                    xs={12}>
                    <h5>4. Informasi Data Jaminan</h5>
                    <CRow>
                      <CCol
                        md={4}>
                        <CFormGroup>
                          <CLabel style={{ fontWeight: 'bold' }}>Nomor Sertifikat</CLabel>
                          <p style={{ fontSize: 12 }}>{detailDth[0].noSertifikat}</p>
                        </CFormGroup>
                      </CCol>
                      <CCol
                        md={4}>
                        <CFormGroup>
                          <CLabel style={{ fontWeight: 'bold' }}>Luas Tanah</CLabel>
                          <p style={{ fontSize: 12 }}>{detailDth[0].luasTanah ? Helper.AmountFormat(detailDth[0].luasTanah) + "m²" : '-'}</p>
                        </CFormGroup>
                      </CCol>
                      <CCol
                        md={4}>
                        <CFormGroup>
                          <CLabel style={{ fontWeight: 'bold' }}>Luas Bangunan</CLabel>
                          <p style={{ fontSize: 12 }}>{detailDth[0].luasBangunan ? Helper.AmountFormat(detailDth[0].luasBangunan) + "m²" : '-'}</p>
                        </CFormGroup>
                      </CCol>
                      <CCol
                        md={4}>
                        <CFormGroup>
                          <CLabel style={{ fontWeight: 'bold' }}>Alamat Jaminan</CLabel>
                          <p style={{ fontSize: 12 }}>{detailDth[0].alamatJaminan ? Helper.AmountFormat(detailDth[0].alamatJaminan) + "m²" : 'Menggunakan alamat akun'}</p>
                        </CFormGroup>
                      </CCol>
                      <CCol
                        md={4}>
                        <CFormGroup>
                          <CLabel style={{ fontWeight: 'bold' }}>Lebar Akses Jalan</CLabel>
                          <p style={{ fontSize: 12 }}>{detailDth[0].lebarAksesJalan ? Helper.AmountFormat(detailDth[0].lebarAksesJalan) + "m²" : '-'}</p>
                        </CFormGroup>
                      </CCol>
                      <CCol
                        md={4}>

                      </CCol>
                      <CCol
                        md={4}>
                        <CFormGroup>
                          <CLabel style={{ fontWeight: 'bold' }}>Foto Kartu Keluarga</CLabel>
                          <p>
                            <a href={detailDth[0].fotoKk} style={{ cursor: 'pointer' }}><img src={detailDth[0].fotoKk} style={{ width: 250, height: 150, borderRadius: 10 }} /></a>
                          </p>
                        </CFormGroup>
                      </CCol>
                      <CCol
                        md={4}>
                        <CFormGroup>
                          <CLabel style={{ fontWeight: 'bold' }}>Foto Sertifikat</CLabel>
                          <p>
                            <a href={detailDth[0].fotoSertifikat} style={{ cursor: 'pointer' }}><img src={detailDth[0].fotoSertifikat} style={{ width: 250, height: 150, borderRadius: 10 }} /></a>
                          </p>
                        </CFormGroup>
                      </CCol>
                    </CRow>
                  </CCol>
                </>
                :
                <h5 style={{ textAlign: 'center', paddingTop: 30 }}>Sedang memuat data...</h5>
            }
          </CCardBody>
        </CCard>
      </CCol>
    </CRow >
  );
}