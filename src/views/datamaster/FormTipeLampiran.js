import React, { useState, useCallback, useEffect } from 'react'; 
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
import { bprNusaServer } from '../../server/api';
import { addDataTipeLampiran, updateDataTipeLampiran } from '../../store/actions/dataMaster';
import { toast } from 'react-toastify';

const formBodyTipeLampiran = { jenis_lampiran: '' };

export default function FormTipeLampiran({ modal, setModal, action="", selectedItem }){ 
  const dispatch = useDispatch();
  const [form, setForm] = useState({ jenis_lampiran: '' });
  const [validationError, setValidationError] = useState({ jenis_lampiran: '' });
  const [loading, setLoading] = useState(false);

  const handleInput = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  const actionJenisLampiran = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if(action === "Tambah"){
        const { data } = await bprNusaServer.post("/data-master/add-jenis-lampiran", form, {
          headers: {
            admin_access_token: localStorage.admin_access_token
          }
        });
        actionFeedback(data);
      }else{
        const { data } = await bprNusaServer.put(`/data-master/update-jenis-lampiran/${selectedItem.id}`, form, {
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
        dispatch(updateDataTipeLampiran(data.body));
        toast.info(" ✔ " + data.message);
        setModal(false); 
        setForm(formBodyTipeLampiran)
      }else if(data.statusCode === 201){
        dispatch(addDataTipeLampiran(data.body));
        toast.info(" ✔ " + data.message);
        setModal(false); 
        setForm(formBodyTipeLampiran) 
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
      jenis_lampiran: selectedItem.jenis_lampiran,
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
    <CModalHeader closeButton>{ action } Jenis Lampiran</CModalHeader>
      <CModalBody>
      <CContainer>
        <CRow>
          <CCol sm="12"> 
            <CForm
              onSubmit={actionJenisLampiran}>
              <CFormGroup>
                <CLabel>Jenis Lampiran</CLabel>
                  <CInput
                    type="text"
                    name="jenis_lampiran"
                    placeholder="Masukan Jenis Lampiran"
                    value={form.jenis_lampiran}
                    onChange={handleInput}
                  />
                <p  className="text-danger pt-2" style={{ fontSize: 12 }}>{ validationError["jenis_lampiran"] || '' }</p> 
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