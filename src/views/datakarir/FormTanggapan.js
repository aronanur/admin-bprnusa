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
  CTextarea
} from '@coreui/react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { bprNusaServer } from '../../server/api';
import { changeStatusPengajuan } from '../../store/actions/karir';

export default function FormTanggapan({ modal, setModal, selectedKarir }) {
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    status_pengajuan: '',
    message: ''
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
      const { data } = await bprNusaServer.patch(`/karir/admin/patch-status-kerja/${selectedKarir.id}`, form, {
        headers: {
          admin_access_token: localStorage.admin_access_token
        }
      });

      if (data) {
        if (data.statusCode === 200) {
          toast.info(" ✔ " + data.message);
          dispatch(changeStatusPengajuan(selectedKarir.id, form.status_pengajuan));
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
    if (selectedKarir) {
      setForm({
        ...form,
        status_pengajuan: selectedKarir.statusPengajuan
      })
    }
  }, [selectedKarir])

  return (
    <CModal
      show={modal}
      onClose={() => setModal(!modal)}
      color="dark"
    >
      <CModalHeader closeButton>Form Tanggapan</CModalHeader>
      <CModalBody>
        <CContainer>
          <CRow>
            <CCol sm="12">
              <CForm onSubmit={submitTanggapan}>
                <CFormGroup>
                  <CLabel>Status Pengajuan</CLabel>
                  <CSelect onChange={handleInput} value={form.status_pengajuan} name="status_pengajuan">
                    <option value=""> -- Pilih Status Pengajuan -- </option>
                    <option value="Validasi Data"> Validasi Data </option>
                    <option value="Diterima"> Diterima </option>
                  </CSelect>
                  <p className="text-danger pt-2" style={{ fontSize: 12 }}>
                    {validationError["status_pengajuan"] || ""}
                  </p>
                </CFormGroup>
                <CFormGroup>
                  <CLabel>Pesan <span class="text-danger">* wajib isi pesan untuk pendaftar kerja</span></CLabel>
                  <CTextarea name="message" value={form.message} onChange={handleInput} cols={5} rows={5} placeholder="Masukan Pesan" />
                  <p className="text-danger pt-2" style={{ fontSize: 12 }}>
                    {validationError["message"] || ""}
                  </p>
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