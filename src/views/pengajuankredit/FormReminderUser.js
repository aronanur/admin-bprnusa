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
  CInput,
  CTextarea
} from '@coreui/react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { bprNusaServer } from '../../server/api';

export default function FormTanggapan({ modal, setModal, selectedPengajuan }) {
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    jenis_notifikasi: '',
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
      const { data } = await bprNusaServer.post(`/pengajuan-kredit/admin/action/reminder-user/${selectedPengajuan.id}`, form, {
        headers: {
          admin_access_token: localStorage.admin_access_token
        }
      });

      if (data) {
        if (data.statusCode === 200) {
          toast.info(" ✔ " + data.message);
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

  return (
    <CModal
      show={modal}
      onClose={() => setModal(!modal)}
      color="dark"
    >
      <CModalHeader closeButton>Form Reminder User</CModalHeader>
      <CModalBody>
        <CContainer>
          <CRow>
            <CCol sm="12">
              <CForm onSubmit={submitTanggapan}>
                <CFormGroup>
                  <CLabel>Judul</CLabel>
                  <CInput type="text" name="jenis_notifikasi" placeholder="Masukan Judul" value={form.jenis_notifikasi} onChange={handleInput} />
                  <p className="text-danger pt-2" style={{ fontSize: 12 }}>
                    {validationError["jenis_notifikasi"] || ""}
                  </p>
                </CFormGroup>
                <CFormGroup>
                  <CLabel>Pesan <span class="text-danger">* wajib isi pesan untuk info kepada user</span></CLabel>
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