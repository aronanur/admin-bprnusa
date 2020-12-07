import React, { useState } from 'react';
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
  CSelect
} from '@coreui/react';
import { ToastContainer, toast } from 'react-toastify';
import { bprNusaServer } from '../../server/api';

export default function TambahStaff({ modal, setModal, getStaffData }){
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState({});
  const [form, setForm] = useState({
    email: "",
    no_hp: "",
    password: "",
    roles: ""
  });

  const handleInput = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  const doAddStaff = async(e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await bprNusaServer.post("/users/admin/registrasi-admin", form, {
        headers: {
          admin_access_token: localStorage.admin_access_token
        }
      });

      if(data){
        if(data.statusCode === 201){
          setForm({ email: '', no_hp: '', password: '', roles: '' });
          toast.info(" ✔ " + data.message);
          getStaffData();
          setModal(false);
        } else if(data.statusCode === 400){
          setValidationError(data.message);
        }else{
          toast.error(" ⚠ " + data.message); 
        }
        setLoading(false);
      }

    } catch (error) {
      console.log(error);
    }
  }

  return(
    <CModal
        show={modal}
        onClose={() => setModal(!modal)}
        color="dark"
      > 
      <CModalHeader closeButton>Tambah Staff</CModalHeader>
        <CModalBody>
        <CContainer>
          <CRow>
            <CCol sm="12">
            <CForm onSubmit={doAddStaff}>
                <CFormGroup>
                  <CLabel>Email</CLabel>
                  <CInput
                    type="text"
                    name="email"
                    placeholder="Masukan Email"
                    value={form.email}
                    onChange={handleInput}
                  />
                <p  className="text-danger pt-2" style={{ fontSize: 12 }}>{ validationError["email"] || '' }</p> 
                </CFormGroup>
                <CFormGroup>
                  <CLabel>Nomor Hp</CLabel>
                  <CInput
                    type="text"
                    name="no_hp"
                    placeholder="Masukan Nomor Hp"
                    value={form.no_hp}
                    onChange={handleInput} 
                  />
                <p  className="text-danger pt-2" style={{ fontSize: 12 }}>{ validationError["no_hp"] || '' }</p> 
                </CFormGroup>
                <CFormGroup>
                  <CLabel>Password</CLabel>
                  <CInput
                    type="password"
                    name="password"
                    placeholder="Masukan Password.."
                    onChange={handleInput}
                  />
                <p className="text-danger pt-2" style={{ fontSize: 12 }}> 
                  { validationError["password"] || "" }
                  </p> 
                </CFormGroup>
                <CFormGroup>
                  <CLabel>Roles</CLabel>
                  <CSelect onChange={handleInput} name="roles">
                      <option value="1"> -- Pilih Roles --</option>
                      <option value="admin">Admin</option>
                      <option value="superadmin">Super Admin</option> 
                    </CSelect>
                <p className="text-danger pt-2" style={{ fontSize: 12 }}> 
                  { validationError["roles"] || "" }
                  </p> 
                </CFormGroup>
                <CButton type="submit" disabled={loading} color="primary">{ loading ? "Loading..." : "Tambah" }</CButton> 
              </CForm>
            </CCol>
          </CRow>
      </CContainer>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setModal(!modal)}>Batal</CButton>
        </CModalFooter>
        <ToastContainer />
      </CModal> 
  );
}