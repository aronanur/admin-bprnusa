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
  CInput,
  CFormGroup,
  CTextarea
} from '@coreui/react';
import { toast } from 'react-toastify';
import { bprNusaServer } from '../../server/api';

const formBody = {
  alamat: '',
  email: '',
  whatsapp: '',
  fb: '',
  ig: '',
  website: '',
  nama_kantor: ''
}

export default function TambahKontak({ modal, setModal, selectedItem = null, type = 'create', getAction }) {

  const [form, setForm] = useState(formBody);
  const [validationError, setValidationError] = useState(formBody);
  const [loading, setLoading] = useState(false);

  const handleInput = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (selectedItem !== null && type == 'update') {
        const { data } = await bprNusaServer.put(`/data-kontak/admin/update-kontak/${selectedItem.id}`, form, {
          headers: {
            admin_access_token: localStorage.admin_access_token
          }
        });

        actionFeedBack(data);

      } else {
        const { data } = await bprNusaServer.post(`/data-kontak/admin/insert-kontak`, form, {
          headers: {
            admin_access_token: localStorage.admin_access_token
          }
        });

        actionFeedBack(data);
      }


    } catch (error) {
      toast.error(" ⚠ Terjadi Kesalahan Pada Jaringan, Silahkan Cek Jaringan Anda");
    }
  }

  const actionFeedBack = (data) => {
    if (data) {
      if (data.statusCode === 200) {
        toast.info(" ✔ " + data.message);
        getAction();
        setModal(false);
      } else if (data.statusCode === 201) {
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
  }

  useEffect(() => {
    if (selectedItem !== null) {
      console.log(selectedItem.id)
      setForm(selectedItem);
    }
  }, [selectedItem]);

  return (
    <CModal
      show={modal}
      onClose={() => setModal(!modal)}
      color="dark"
    >
      <CModalHeader closeButton>Tambah Kontak</CModalHeader>
      <CModalBody>
        <CForm onSubmit={submitHandler}>
          <CCol md={12}>
            <CFormGroup>
              <CLabel>Kantor / Cabang <span class="text-danger">* wajib diisi</span></CLabel>
              <CInput type="text" name="nama_kantor" placeholder="Masukan Kantor  /  Cabang" value={form.nama_kantor} onChange={handleInput} />
              <p className="text-danger pt-2" style={{ fontSize: 12 }}>
                {validationError["nama_kantor"] || ""}
              </p>
            </CFormGroup>
            <CFormGroup>
              <CLabel>Alamat <span class="text-danger">* wajib diisi</span></CLabel>
              <CTextarea name="alamat" value={form.alamat} onChange={handleInput} cols={2} rows={2} placeholder="Masukan Alamat" />
              <p className="text-danger pt-2" style={{ fontSize: 12 }}>
                {validationError["alamat"] || ""}
              </p>
            </CFormGroup>
            <CFormGroup>
              <CLabel>Email</CLabel>
              <CInput type="text" name="email" placeholder="Masukan email" value={form.email} onChange={handleInput} />
              <p className="text-danger pt-2" style={{ fontSize: 12 }}>
                {validationError["email"] || ""}
              </p>
            </CFormGroup>
            <CFormGroup>
              <CLabel>Whatsapp</CLabel>
              <CInput type="text" name="whatsapp" placeholder="Masukan nomor whatsapp" value={form.whatsapp} onChange={handleInput} />
              <p className="text-danger pt-2" style={{ fontSize: 12 }}>
                {validationError["whatsapp"] || ""}
              </p>
            </CFormGroup>
            <CFormGroup>
              <CLabel>Facebook</CLabel>
              <CInput type="text" name="fb" placeholder="Masukan akun facebook" value={form.fb} onChange={handleInput} />
              <p className="text-danger pt-2" style={{ fontSize: 12 }}>
                {validationError["fb"] || ""}
              </p>
            </CFormGroup>
            <CFormGroup>
              <CLabel>Instagram</CLabel>
              <CInput type="text" name="ig" placeholder="Masukan akun instagram" value={form.ig} onChange={handleInput} />
              <p className="text-danger pt-2" style={{ fontSize: 12 }}>
                {validationError["ig"] || ""}
              </p>
            </CFormGroup>
            <CFormGroup>
              <CLabel>Website</CLabel>
              <CInput type="text" name="website" placeholder="Masukan alamat website" value={form.website} onChange={handleInput} />
              <p className="text-danger pt-2" style={{ fontSize: 12 }}>
                {validationError["website"] || ""}
              </p>
            </CFormGroup>
            <CButton type="submit" color="primary btn-block">{loading ? "Loading..." : "Simpan"}</CButton>
          </CCol>
        </CForm>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={() => setModal(!modal)}>Batal</CButton>
      </CModalFooter>
    </CModal>
  );
}