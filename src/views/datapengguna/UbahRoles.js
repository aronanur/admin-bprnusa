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
  CSelect
} from '@coreui/react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { bprNusaServer } from '../../server/api';
import { changeRoles } from '../../store/actions/actionUser';

export default function UbahRoles({ modal, setModal, selectedUser }){ 
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    roles: ''
  });
  const [validationError, setValidationError] = useState({});
  const [loading, setLoading] = useState(false);

  const handleInput = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  } 

  const doChangeRoles = async (e) => {
    e.preventDefault();
    try { 
      setLoading(true);
      const { data } = await bprNusaServer.patch(`/users/admin/change-roles-admin/${selectedUser.id}`, form, {
        headers: {
          admin_access_token: localStorage.admin_access_token
        }
      });

      if(data){
        if(data.statusCode === 200){ 
          dispatch(changeRoles(selectedUser.id, form["roles"]));
          setModal(false);
          toast.info(" ✔ " + data.message); 
        }else if(data.statusCode === 400){
          setValidationError(data.message);
        }else{
          toast.error(" ⚠ " + data.message); 
          setModal(false);
        }
        setLoading(false);
      }

    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    setForm({ 
      roles: selectedUser.roles
    })
  }, [selectedUser])

  return(
    <CModal
      size="sm"
      show={modal}
      onClose={() => setModal(!modal)}
      color="dark"
    > 
    <CModalHeader closeButton>Ubah Profile</CModalHeader>
      <CModalBody>
      <CContainer>
        <CRow>
          <CCol sm="12">
           <CForm onSubmit={doChangeRoles}> 
            <CFormGroup>
                <CLabel>Roles</CLabel>
                <CSelect onChange={handleInput} value={form['roles']} name="roles">
                    <option value=""> -- Pilih Roles --</option>
                    <option value="admin">Admin</option>
                    <option value="superadmin">Super Admin</option> 
                  </CSelect>
              <p className="text-danger pt-2" style={{ fontSize: 12 }}> 
                { validationError["roles"] || "" }
                </p> 
              </CFormGroup>
             <CButton type="submit" color="primary btn-block">{ loading ? "Loading..." : "Simpan" }</CButton>
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