import React, { useState } from 'react';
import {
  CCol,
  CDataTable,
  CBadge,
  CButton,
  CTooltip,
} from '@coreui/react';

import CIcon from '@coreui/icons-react';
import Helper from '../../helpers/helper';

import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
// import { confirmAlert } from 'react-confirm-alert';

// import { bprNusaServer } from '../../server/api';
import FormStatusPengajuan from './FormStatusPengajuan';
import FormReminderUser from './FormReminderUser';

export default function PengajuanKreditTable({ dataPengajuanKredit, getAction }) {
  const history = useHistory();
  const dispatch = useDispatch();

  //STATE
  const [loading, setLoading] = useState(false);
  const [modalStatus, setModalStatus] = useState(false);
  const [modalReminder, setModalReminder] = useState(false);
  const [selectedPengajuan, setSelectedPengajuan] = useState(null);

  const getBadge = status => {
    switch (status) {
      case 'Pengajuan': return 'info'
      case 'Proses': return 'warning'
      case 'Hasil': return 'primary'
      case 'Berjalan': return 'secondary'
      case 'Lunas': return 'success'
      default: return 'primary'
    }
  };

  //Open Modal Status
  const openModalStatusPengajuan = (item) => {
    setSelectedPengajuan(item);
    setModalStatus(true);
  }
  //Open Modal Reminder
  const openModalReminder = (item) => {
    setSelectedPengajuan(item);
    setModalReminder(true);
  }
  //Open Modal Status
  const openDetailPopup = (item) => {

    if (item.jenisKredit == 'Kendaraan Roda Empat') {
      history.push(`/admin/main/pendaftar-kerja/detail-kendaraan/${item.id}`);
    } else if (item.jenisKredit == 'Kendaraan Roda Dua') {
      history.push(`/admin/main/pendaftar-kerja/detail-kendaraan/${item.id}`);
    } else if (item.jenisKredit == 'Sertifikat') {
      history.push(`/admin/main/pendaftar-kerja/detail-sertifikat/${item.id}`);
    } else if (item.jenisKredit == 'Dana Talangan Haji') {
      history.push(`/admin/main/pendaftar-kerja/detail-dana-talangan-haji/${item.id}`);
    }

  }

  return (
    <CCol className="my-3">
      <CDataTable
        items={dataPengajuanKredit}
        fields={[
          "tglPengajuan",
          "noAkun",
          "noHp",
          "namaLengkap",
          "jenisKredit",
          "danaPinjaman",
          "jangkaWaktu",
          "statusPengajuan",
          "action"
        ]}
        striped
        itemsPerPage={10}
        pagination
        scopedSlots={{
          "tglPengajuan": (item) => (
            <td style={{ verticalAlign: 'middle', fontSize: 12 }}>
              <span>{Helper.dateFormat(item.tglPengajuan)}</span>
            </td>
          ),
          "noAkun": (item) => (
            <td style={{ verticalAlign: 'middle', fontSize: 12 }}>
              {item.noAkun || "-"}
            </td>
          ),
          "noHp": (item) => (
            <td style={{ verticalAlign: 'middle', fontSize: 12 }}>
              {item.noHp || "-"}
            </td>
          ),
          "namaLengkap": (item) => (
            <td style={{ verticalAlign: 'middle', fontSize: 12 }}>
              {item.namaLengkap || "-"}
            </td>
          ),
          "jenisKredit": (item) => (
            <td style={{ verticalAlign: 'middle', fontSize: 12 }}>
              {item.jenisKredit || "-"}
            </td>
          ),
          "danaPinjaman": (item) => (
            <td style={{ verticalAlign: 'middle', fontSize: 12 }}>
              Rp. {Helper.AmountFormat(item.danaPinjaman)}
            </td>
          ),
          "jangkaWaktu": (item) => (
            <td style={{ verticalAlign: 'middle', fontSize: 12 }}>
              {item.jangkaWaktu} Bulan
            </td>
          ),
          "statusPengajuan": (item) => (
            <td style={{ verticalAlign: 'middle' }}>
              <CBadge color={getBadge(item.statusPengajuan)}>
                {item.statusPengajuan}
              </CBadge>
            </td>
          ),
          "action": (item) => (
            <td>
              <CTooltip content="Ubah Status Pengajuan" placement="bottom">
                <CButton disabled={loading} onClick={() => openModalStatusPengajuan(item)} className="mr-1" size="sm" color="info">
                  <CIcon name="cil-pencil" />
                </CButton>
              </CTooltip>
              <CTooltip content="Reminder User" placement="bottom">
                <CButton disabled={loading} onClick={() => openModalReminder(item)} className="mr-1" size="sm" color="warning">
                  <CIcon name="cil-bell" />
                </CButton>
              </CTooltip>
              <CTooltip content="Detail Pengajuan" placement="bottom">
                <CButton disabled={loading} onClick={() => openDetailPopup(item)} className="mr-1" size="sm" color="success">
                  <CIcon name="cil-notes" />
                </CButton>
              </CTooltip>
            </td>
          )
        }}
      />
      <FormStatusPengajuan
        getAction={getAction}
        modal={modalStatus}
        setModal={setModalStatus}
        selectedPengajuan={selectedPengajuan}
      />
      <FormReminderUser
        modal={modalReminder}
        setModal={setModalReminder}
        selectedPengajuan={selectedPengajuan}
      />
    </CCol>
  );
}