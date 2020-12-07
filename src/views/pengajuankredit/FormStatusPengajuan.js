import React, { useState, useEffect } from 'react';
import {
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CButton,
  CRow,
  CContainer,
  CCol,
  CForm,
  CLabel,
  CFormGroup,
  CSelect,
  CInput
} from '@coreui/react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { bprNusaServer } from '../../server/api';

export default function FormStatusPengajuan({ modal, setModal, selectedPengajuan, getAction }) {
  const history = useHistory();
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    status_pengajuan: '',
    tanggal_pencairan: '',
    deadline_pembayaran: '',
    pinjaman_terbayar: '',
    no_akun: '',
  });
  const [validationError, setValidationError] = useState({});
  const [loading, setLoading] = useState(false);

  const handleInput = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const submitTanggapan = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await bprNusaServer.put(`/pengajuan-kredit/admin/action/update-status-pengajuan/${selectedPengajuan.id}`, form, {
        headers: {
          admin_access_token: localStorage.admin_access_token
        }
      });

      if (data) {
        if (data.statusCode === 200) {
          toast.info(" ✔ " + data.message);
          getAction();
          setModal(false);
        } else if (data.statusCode === 400) {
          setValidationError(data.message);
        } else {
          toast.error(" ⚠ " + data.message);
        }
        setLoading(false);
      }

    } catch (error) {
      toast.error(" ⚠ Terjadi Kesalahan Pada Jaringan, Silahkan Cek Jaringan Anda");
    }
  }

  useEffect(() => {
    if (selectedPengajuan) {
      setForm({
        ...form,
        status_pengajuan: selectedPengajuan.statusPengajuan,
        tanggal_pencairan: selectedPengajuan.tglPencairan,
        deadline_pembayaran: selectedPengajuan.deadlinePembayaran,
        pinjaman_terbayar: selectedPengajuan.pinjamanTerbayar,
        no_akun: selectedPengajuan.noAkun,
      })
    }
  }, [selectedPengajuan]);

  return (
    <CModal
      show={modal}
      onClose={() => setModal(!modal)}
      color="dark"
    >
      <CModalHeader closeButton>Form Status Pengajuan</CModalHeader>
      <CModalBody>
        <CContainer>
          <CRow>
            <CCol sm="12">
              <CForm onSubmit={submitTanggapan}>
                <CFormGroup>
                  <CLabel>Status Pengajuan</CLabel>
                  <CSelect onChange={handleInput} value={form.status_pengajuan} name="status_pengajuan">
                    <option value=""> Pilih Status Pengajuan </option>
                    <option value="Pengajuan"> Pengajuan </option>
                    <option value="Proses"> Proses </option>
                    <option value="Hasil"> Hasil </option>
                    <option value="Berjalan"> Berjalan </option>
                    <option value="Lunas"> Lunas </option>
                  </CSelect>
                  <p className="text-danger pt-2" style={{ fontSize: 12 }}>
                    {validationError["status_pengajuan"] || ""}
                  </p>
                </CFormGroup>
                <CFormGroup>
                  <CLabel>Tanggal Pencairan</CLabel>
                  <CInput type="date" name="tanggal_pencairan" placeholder="date" value={form.tanggal_pencairan} onChange={handleInput} />
                  <p className="text-danger pt-2" style={{ fontSize: 12 }}>
                    {validationError["tanggal_pencairan"] || ""}
                  </p>
                </CFormGroup>
                <CFormGroup>
                  <CLabel>Deadline Pembayaran</CLabel>
                  <CInput type="date" name="deadline_pembayaran" placeholder="date" value={form.deadline_pembayaran} onChange={handleInput} />
                  <p className="text-danger pt-2" style={{ fontSize: 12 }}>
                    {validationError["deadline_pembayaran"] || ""}
                  </p>
                </CFormGroup>
                <CFormGroup>
                  <CLabel>Angsuran / Bulan</CLabel>
                  <CInput type="number" maxLength={12} name="pinjaman_terbayar" placeholder="Masukan Angsuran  / Bulan" value={form.pinjaman_terbayar} onChange={handleInput} />
                  <p className="text-danger pt-2" style={{ fontSize: 12 }}>{validationError["pinjaman_terbayar"] || ''}</p>
                </CFormGroup>
                <CFormGroup>
                  <CLabel>Nomor Akun</CLabel>
                  <CInput maxLength={12} name="no_akun" placeholder="Masukan Nomor Akun" value={form.no_akun} onChange={handleInput} />
                  <p className="text-danger pt-2" style={{ fontSize: 12 }}>{validationError["no_akun"] || ''}</p>
                </CFormGroup>
                <CButton type="submit" color="primary btn-block">{loading ? "Loading..." : "Kirim"}</CButton>
              </CForm>
            </CCol>
          </CRow>
        </CContainer>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={() => setModal(!modal)}>Batal</CButton>
      </CModalFooter>
    </CModal>
  );
}