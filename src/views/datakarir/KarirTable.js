import React, { useState } from 'react';
import {
  CCol,
  CDataTable,
  CBadge,
  CButton,
  CTooltip
} from '@coreui/react';

import CIcon from '@coreui/icons-react';
import Helper from '../../helpers/helper';

import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
// import { confirmAlert } from 'react-confirm-alert';

// import { bprNusaServer } from '../../server/api';
import FormTanggapan from './FormTanggapan';

export default function KarirTable({ dataPendaftarKerja }) {
  const history = useHistory();
  const dispatch = useDispatch();

  //STATE
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const [selectedKarir, setSelectedKarir] = useState(null);

  const getBadge = status => {
    switch (status) {
      case 'Terdaftar': return 'info'
      case 'Validasi Data': return 'warning'
      case 'Diterima': return 'success'
      default: return 'primary'
    }
  };

  //Open Modal
  const openModalTanggapan = (item) => {
    setSelectedKarir(item);
    setModal(true);
  }

  return (
    <CCol className="my-3">
      <CDataTable
        items={dataPendaftarKerja}
        fields={["noHp", "email", "jabatanDilamar", 'cv', 'suratLamaran', 'kk', 'referensi', 'tanggalPendaftaran', 'statusPengajuan', 'action']}
        striped
        itemsPerPage={10}
        pagination
        scopedSlots={{
          "jabatanDilamar": (item) => (
            <td className="text-center">
              { item.jabatanDilamar}
            </td>
          ),
          "cv": (item) => (
            <td>
              <CTooltip content="Klik untuk download cv" placement="bottom">
                <a href={item.cv} style={{ cursor: 'pointer', fontWeight: 'bold' }} className="text-info">Download File</a>
              </CTooltip>
            </td>
          ),
          "suratLamaran": (item) => (
            <td>
              <CTooltip content="Klik untuk download surat lamaran" placement="bottom">
                <a href={item.suratLamaran} style={{ cursor: 'pointer', fontWeight: 'bold' }} className="text-info">Download File</a>
              </CTooltip>
            </td>
          ),
          "kk": (item) => (
            <td>
              <CTooltip content="Klik untuk download kk" placement="bottom">
                <a href={item.kk} style={{ cursor: 'pointer', fontWeight: 'bold' }} className="text-info">Download File</a>
              </CTooltip>
            </td>
          ),
          "referensi": (item) => (
            <td>
              {
                item.referensi
                  ?
                  <CTooltip content="Klik untuk download referensi" placement="bottom">
                    <a href={item.referensi} style={{ cursor: 'pointer', fontWeight: 'bold' }} className="text-info">Download File</a>
                  </CTooltip>
                  : 'Tidak disertakan'
              }
            </td>
          ),
          "tanggalPendaftaran": (item) => (
            <td>
              <span>{Helper.dateFormat(item.tanggalPendaftaran)}</span>
            </td>
          ),
          "statusPengajuan": (item) => (
            <td className="text-center">
              <CBadge color={getBadge(item.statusPengajuan)}>
                {item.statusPengajuan}
              </CBadge>
            </td>
          ),
          "action": (item) => (
            <td>
              <CTooltip content="Konfirmasi Pendaftaran" placement="bottom">
                {item.statusPengajuan !== 'Diterima' ?
                  <CButton disabled={loading} onClick={() => openModalTanggapan(item)} size="sm" color="success">
                    Beri Tanggapan
                </CButton>
                  :
                  <span class="badge badge-dark">Proses Selesai</span>
                }
              </CTooltip>
            </td>
          )
        }}
      />
      <FormTanggapan
        modal={modal}
        setModal={setModal}
        selectedKarir={selectedKarir}
      />
    </CCol>
  );
}