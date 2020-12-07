import React, { useState, useEffect, useCallback } from 'react';
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
  CInput
} from '@coreui/react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { bprNusaServer } from '../../server/api';
import { addDataTipeKonten, updateDataTipeKonten } from '../../store/actions/dataMaster';

const formBody = { tipe_konten: '' };

export default function FormTipeKonten({ modal, setModal, action, selectedItem = "" }){ 
  const dispatch = useDispatch();
  const [form, setForm] = useState(formBody);
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState({});

  const handleInput = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const actionTipeKonten = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if(action === "Tambah"){
        const { data } = await bprNusaServer.post("/data-master/add-tipe-konten", form, {
          headers: {
            admin_access_token: localStorage.admin_access_token
          }
        });
        actionFeedBack(data);
      }else{
        const { data } = await bprNusaServer.put(`/data-master/update-tipe-konten/${selectedItem.id}`, form, {
          headers: {
            admin_access_token: localStorage.admin_access_token
          }
        });
        actionFeedBack(data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const actionFeedBack = (data) => {
    if(data){
      if(data.statusCode === 200){
        dispatch(updateDataTipeKonten(data.body));
        toast.info(" ✔ " + data.message);
        setModal(false); 
        setForm(formBody)
      }else if(data.statusCode === 201){
        console.log(data, "ini")
        dispatch(addDataTipeKonten(data.body));
        toast.info(" ✔ " + data.message);
        setModal(false); 
        setForm(formBody) 
      }else if(data.statusCode === 400){
        setValidationError(data.message);
      }else{
        toast.error(" ⚠ " + data.message); 
        setModal(false);
      }
      setLoading(false);
    }
  }

  const setValue = useCallback(() => {
    setForm({ 
      tipe_konten: selectedItem.tipe_konten
    })
  }, [selectedItem]);

  useEffect(() => {
    if(action !== "Tambah"){
      setValue()
    }
  }, [setValue, action]);
  
  return(
    <CModal
      size="sm"
      show={modal}
      onClose={() => setModal(!modal)}
      color="dark"
    > 
    <CModalHeader closeButton>{ action } Tipe Konten</CModalHeader>
      <CModalBody>
      <CContainer>
        <CRow>
          <CCol sm="12">
           <CForm
            onSubmit={actionTipeKonten}> 
            <CFormGroup>
                <CLabel>Tipe Konten</CLabel>
                <CInput
                    type="text"
                    name="tipe_konten"
                    placeholder="Tuliskan tipe konten"
                    onChange={handleInput}
                    value={form.tipe_konten}
                  />
                <p className="text-danger pt-2" style={{ fontSize: 12 }}> 
                { validationError["tipe_konten"] || "" }
                </p> 
              </CFormGroup>
             <CButton type="submit" color="primary btn-block">{ loading ? "Loading..." : action }</CButton>
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