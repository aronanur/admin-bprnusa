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
  CTextarea,
  CInput
} from '@coreui/react';
import { useDispatch } from 'react-redux';
import { bprNusaServer } from '../../server/api';
import { addDataJenisKredit, updateDataJenisKredit } from '../../store/actions/dataMaster';
import { toast } from 'react-toastify';

const formBodyJenisKredit = { jenis_kredit: '', keterangan: '' }; 

export default function FormJenisKredit({modal, setModal, action, selectedItem = "" }){
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(formBodyJenisKredit);
  const [validationError, setValidationError] = useState({});

  const handleInput = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }
  
  const actionJenisKredit = async (e) => { 
    e.preventDefault();
    try {
      setLoading(true);
      if(action === "Tambah"){
        const { data } = await bprNusaServer.post("/data-master/add-jenis-kredit", form, {
          headers: {
            admin_access_token: localStorage.admin_access_token
          }
        });
        actionFeedback(data);
      }else{
        const { data } = await bprNusaServer.put(`/data-master/update-jenis-kredit/${selectedItem.id}`, form, {
          headers: {
            admin_access_token: localStorage.admin_access_token
          }
        });
        actionFeedback(data);
      } 

    } catch (error) {
      console.log(error);
    }
  }

  const actionFeedback = (data) => {
    if(data){
      if(data.statusCode === 200){
        dispatch(updateDataJenisKredit(data.body));
        toast.info(" ✔ " + data.message);
        setModal(false); 
        setForm(formBodyJenisKredit)
      }else if(data.statusCode === 201){
        dispatch(addDataJenisKredit(data.body));
        toast.info(" ✔ " + data.message);
        setModal(false); 
        setForm(formBodyJenisKredit) 
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
      jenis_kredit: selectedItem.jenis_kredit,
      keterangan: selectedItem.keterangan
    })
  }, [selectedItem])

  useEffect(() => {
    if(action !== "Tambah"){
      setValue()
    }
  }, [action, setValue])

  return(
    <CModal
      size="sm"
      show={modal}
      onClose={() => setModal(!modal)}
      color="dark"
    > 
    <CModalHeader closeButton>{ action } Jenis Kredit</CModalHeader>
      <CModalBody>
      <CContainer>
        <CRow>
          <CCol sm="12"> 
            <CForm
              onSubmit={actionJenisKredit}>
              <CFormGroup>
                <CLabel>Jenis Kredit</CLabel>
                  <CInput
                    type="text"
                    name="jenis_kredit"
                    placeholder="Masukan Jenis Kredit"
                    value={form.jenis_kredit}
                    onChange={handleInput}
                  />
                <p  className="text-danger pt-2" style={{ fontSize: 12 }}>{ validationError["jenis_kredit"] || '' }</p> 
              </CFormGroup>
              <CFormGroup>
                    <CLabel>Keterangan</CLabel> 
                    <CTextarea
                      name="keterangan"
                      value={form.keterangan}
                      onChange={handleInput} 
                      placeholder="Masukan keterangan"/> 
                  <p  className="text-danger pt-2" style={{ fontSize: 12 }}>{ validationError["keterangan"] || '' }</p> 
              </CFormGroup>
              <CButton type="submit" disabled={loading} color="primary">{ loading ? "Loading..." : action }</CButton> 
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