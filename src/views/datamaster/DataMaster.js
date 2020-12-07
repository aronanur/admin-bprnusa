import React, { useState, useEffect, useCallback } from 'react';
import {
  CRow,
  CCol,
  CCard,
  CCardHeader,
  CCardBody,
  CButton
} from '@coreui/react';
import FormJenisKredit from './FormJenisKredit';
import FormTipeKonten from './FormTipeKonten';
import FormTipeLampiran from './FormTipeLampiran';
import TableJenisKredit from './TableJenisKredit';
import TableTipeKonten from './TableTipeKonten';
import TableTipeLampiran from './TableTipeLampiran';
import { bprNusaServer } from '../../server/api';
import { useHistory} from 'react-router-dom';
import { dataJenisKredit, dataTipeKonten, dataTipeLampiran } from '../../store/actions/dataMaster';
import { toast } from 'react-toastify'; 
import { useDispatch, useSelector } from 'react-redux';

export default function DataMaster(){
  const dispatch = useDispatch();
  const history = useHistory();
  const listJenisKredit = useSelector(state => state.dataMasterReducer.dataJenisKredit);
  const listTipeKonten = useSelector(state => state.dataMasterReducer.dataTipeKonten);
  const listTipeLampiran = useSelector(state => state.dataMasterReducer.dataTipeLampiran); 
  const [modalJenisKredit, setModalJenisKredit] = useState(false); 
  const [modalTipeKonten, setModalTipeKonten] = useState(false);
  const [modalTipeLampiran, setModalTipeLampiran] = useState(false); 
  const [actionType, setActionType] = useState(""); 

  const openModal = (type, action) => {
    setActionType(action);
    if(type === "Jenis Kredit"){
      setModalJenisKredit(true);
    }else if(type === "Tipe Konten"){
      setModalTipeKonten(true)
    }else if(type === "Tipe Lampiran"){
      setModalTipeLampiran(true);
    }
  }

  const getDataJenisKredit = useCallback(async () => {
    try {
      const { data } = await bprNusaServer.get("/data-master/data-jenis-kredit", {
        headers: {
          admin_access_token: localStorage.admin_access_token
        }
      });

      if(data){
        if(data.statusCode === 200){
          dispatch(dataJenisKredit(data.body));
        }else{
          toast.error(" ⚠ " + data.message); 
          history.push("/admin");
        }
      }

    } catch (error) {
      console.log(error);
    }
  }, [history, dispatch]);

  const getDataTipeKonten = useCallback(async () => {
    try {
      const { data } = await bprNusaServer.get("/data-master/data-tipe-konten", {
        headers: {
          admin_access_token: localStorage.admin_access_token
        }
      });

      if(data){
        if(data.statusCode === 200){
          dispatch(dataTipeKonten(data.body));
        }
      }

    } catch (error) {
      console.log(error);
    }
  }, [dispatch]);

  const getDataTipeLampiran = useCallback(async () => {
    try {
      const { data } = await bprNusaServer.get("/data-master/data-jenis-lampiran", {
        headers: {
          admin_access_token: localStorage.admin_access_token
        }
      }); 
      
      if(data){
        if(data.statusCode === 200){
          dispatch(dataTipeLampiran(data.body));
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, [dispatch]);

  useEffect(() => {
    getDataJenisKredit();
    getDataTipeKonten();
    getDataTipeLampiran();
  }, [getDataJenisKredit, getDataTipeKonten, getDataTipeLampiran]);

  return(
    <CRow>
    <CCol xs={12}>
      <CCard>
        <CCardHeader style={{ fontSize: 18, fontWeight: 'bold' }}>
          Jenis Kredit
          <div className="card-header-actions"> 
          </div>
        </CCardHeader>
        <CCardBody> 
        <CCol
          className="d-flex justify-content-between">
            <div></div>
            <div>
              <CButton 
                size="sm"
                color="dark"
                onClick={() => openModal("Jenis Kredit", "Tambah")}>
                <span>&nbsp;Tambah Jenis Kredit</span> 
              </CButton>
            </div> 
        </CCol> 
        <TableJenisKredit 
          dataJenisKredit={listJenisKredit}
        />
        </CCardBody>
      </CCard>
    </CCol> 
    <CCol xs={6}>
      <CCard>
        <CCardHeader style={{ fontSize: 18, fontWeight: 'bold' }}>
          Tipe Konten
          <div className="card-header-actions"> 
          </div>
        </CCardHeader>
        <CCardBody> 
        <CCol
          className="d-flex justify-content-between">
          <div></div>
            <div>
              <CButton 
                size="sm"
                color="dark"
                onClick={() => openModal("Tipe Konten", "Tambah")}>
                <span>&nbsp;Tambah Tipe Konten</span> 
              </CButton>
            </div> 
        </CCol> 
            <TableTipeKonten 
              dataTipeKonten={listTipeKonten}
            />
        </CCardBody>
      </CCard>
    </CCol> 
    <CCol xs={6}>
      <CCard>
        <CCardHeader style={{ fontSize: 18, fontWeight: 'bold' }}>
          Tipe Lampiran
          <div className="card-header-actions"> 
          </div>
        </CCardHeader>
        <CCardBody> 
        <CCol
          className="d-flex justify-content-between">
          <div></div>
            <div>
              <CButton 
                size="sm"
                color="dark"
                onClick={() => openModal("Tipe Lampiran", "Tambah")}>
                <span>&nbsp;Tambah Tipe Lampiran</span> 
              </CButton>
            </div> 
        </CCol> 
            <TableTipeLampiran 
              dataTipeLampiran={listTipeLampiran}
            />
        </CCardBody>
      </CCard>
    </CCol>
    <FormJenisKredit 
      modal={modalJenisKredit}
      setModal={setModalJenisKredit} 
      action={actionType}
      selectedItem={""}
    />
    <FormTipeKonten 
      modal={modalTipeKonten}
      setModal={setModalTipeKonten}
      action={actionType}
      selectedItem={""}
    />
    <FormTipeLampiran 
      modal={modalTipeLampiran}
      setModal={setModalTipeLampiran}
      action={actionType}
      selectedItem={""}
    />
  </CRow>
  );
}