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
} from '@coreui/react';
import { bprNusaServer } from '../../server/api';
import { toast } from 'react-toastify';

export default function EditProfile({ modal, setModal, user }){
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState({});
  const [form, setForm] = useState({
    email: user.email,
    no_hp: user.no_hp,
    password: ""
  });

  const handleInput = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  const doUpdateStaff = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await bprNusaServer.put("/users/admin/update-admin", form, {
        headers: {
          admin_access_token: localStorage.admin_access_token
        }
      });

      if(data){
        if(data.statusCode === 200){
          toast.info(" ✔ " + data.message);
          setModal(false);
        }else if(data.statusCode === 400){
          setValidationError(data.message);
        }else{
          toast.error(" ⚠ " + data.message);
        }
        setLoading(false);
      }

    } catch (error) {
      console.log(error)
    }
  } 
  
  return (
    <CModal
      show={modal}
      onClose={() => setModal(!modal)}
      color="dark"
    > 
    <CModalHeader closeButton>Ubah Profile</CModalHeader>
      <CModalBody>
      <CContainer>
        <CRow>
          <CCol sm="12">
         <CForm onSubmit={doUpdateStaff}>
              <CFormGroup>
                <CLabel htmlFor="nf-email">Email</CLabel>
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
                <CLabel htmlFor="nf-email">Nomor Hp</CLabel>
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
                <CLabel htmlFor="nf-password">Password</CLabel>
                <CInput
                  type="password"
                  name="password"
                  placeholder="Masukan Password.."
                  onChange={handleInput}
                />
              <p className="text-danger pt-2" style={{ fontSize: 12 }}> 
                { validationError["password"] || "Password tidak harus diisi jika memang tidak ingin menggantinya" }
                </p> 
              </CFormGroup>
             <CButton type="submit" color="primary">{ loading ? "Loading..." : "Simpan" }</CButton>
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