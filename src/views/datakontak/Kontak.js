import React, { useState, useCallback, useEffect } from 'react';
import {
  CRow,
  CCol,
  CCard,
  CCardHeader,
  CCardBody,
  CButton,
  CInput,
  CSelect, CForm
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import TableKontak from './TableKontak';
import TambahKontak from './FormAddKontak';
import { listKontak } from '../../store/actions/dataKontak';
import { bprNusaServer } from '../../server/api';
import { Link, useRouteMatch } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

export default function Konten() {
  const dispatch = useDispatch();
  const dataKontak = useSelector(state => state.dataKontakReducer.listKontak);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({
    keyword: '',
    sort: '',
    filter: ''
  });
  const { path } = useRouteMatch();

  const handleInput = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const getDataKontak = useCallback(async () => {
    try {
      const { data } = await bprNusaServer.get(`/data-kontak/list-kontak`, {
        headers: {
          admin_access_token: localStorage.admin_access_token
        }
      });

      if (data) {
        dispatch(listKontak(data.body));
      }

    } catch (error) {
      console.log(error)
    }
  }, [dispatch])

  useEffect(() => {
    getDataKontak();
  }, [getDataKontak])

  return (
    <CRow>
      <CCol xs={12}>
        <CCard>
          <CCardHeader style={{ fontSize: 18, fontWeight: 'bold' }}>
            CMS Kontak
            <div className="card-header-actions">
              <div>
                <CButton
                  onClick={() => setModal(true)}
                  size="sm"
                  color="dark">
                  <CIcon name="cil-notes" />
                  <span style={{ position: "relative", top: 2 }}>&nbsp;Input Kontak</span>
                </CButton>
              </div>
            </div>
          </CCardHeader>
          <CCardBody>
            <CCol
              md={12}>
              <TableKontak
                dataKontak={dataKontak}
                getAction={getDataKontak}
              />
            </CCol>
          </CCardBody>
        </CCard>
      </CCol>
      { modal && <TambahKontak getAction={getDataKontak} modal={modal} setModal={setModal} />}
    </CRow>
  );
}