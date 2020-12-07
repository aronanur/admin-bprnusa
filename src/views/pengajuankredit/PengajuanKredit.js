import React, { useEffect, useState } from 'react';
import {
  CRow,
  CCol,
  CCard,
  CCardHeader,
  CCardBody,
  CButton,
  CInput,
  CForm,
  CSelect
} from '@coreui/react';
// import CIcon from '@coreui/icons-react';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { bprNusaServer } from '../../server/api';
import { listPengajuanKredit } from '../../store/actions/pengajuanKredit';

//Component Import 
import PengajuanKreditTable from './PengajuanKreditTable';

export default function User() {
  const history = useHistory();
  const dispatch = useDispatch();

  const listKredit = useSelector(state => state.pengajuanKreditReducer.listPengajuanKredit);

  //STATE
  const [form, setForm] = useState({
    filter: '',
    sort: ''
  });

  const getPengajuanKredit = async () => {
    try {
      const { data } = await bprNusaServer.get(`/pengajuan-kredit/admin/data/list-pengajuan?keyword=${form.filter}&sort=DESC`, {
        headers: {
          admin_access_token: localStorage.admin_access_token
        }
      });

      if (data) {
        dispatch(listPengajuanKredit(data.body));
      }

    } catch (error) {
      console.log(error)
      toast.error(" ⚠ Terjadi Kesalahan Pada Jaringan, Silahkan Cek Jaringan Anda");
      history.goBack("/admin");
    }
  }

  //Handle Search
  const handleInput = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  const searchAction = async (e) => {
    e.preventDefault();
    try {
      const { data } = await bprNusaServer.get(`/pengajuan-kredit/admin/data/list-pengajuan?keyword=${form.filter}&sort=${form.sort}`, {
        headers: {
          admin_access_token: localStorage.admin_access_token
        }
      });

      if (data) {
        dispatch(listPengajuanKredit(data.body));
      }

    } catch (error) {
      toast.error(" ⚠ Terjadi Kesalahan Pada Jaringan, Silahkan Cek Jaringan Anda");
      history.goBack("/admin");
    }
  }

  //LifeCycle
  useEffect(() => {
    getPengajuanKredit();
  }, [])

  return (
    <CRow>
      <CCol xs={12}>
        <CCard>
          <CCardHeader style={{ fontSize: 18, fontWeight: 'bold' }}>
            Pengajuan Kredit
            <div className="card-header-actions">

            </div>
          </CCardHeader>
          <CCardBody>
            <CCol
              className="d-flex justify-content-between">
              <div>
              </div>
              <CForm
                onSubmit={searchAction}>
                <CCol
                  className="d-flex justify-content-end ml-4 p-2">
                  <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <CSelect
                      onChange={handleInput}
                      className="mr-2"
                      name="filter"
                      style={{ width: 200 }}>
                      <option value=""> Status Pengajuan </option>
                      <option value="Pengajuan"> Pengajuan </option>
                      <option value="Proses"> Proses </option>
                      <option value="Hasil"> Hasil </option>
                      <option value="Berjalan"> Berjalan </option>
                      <option value="Lunas"> Lunas </option>
                    </CSelect>
                    <CSelect
                      onChange={handleInput}
                      className="mr-2"
                      name="sort"
                      style={{ width: 150 }}>
                      <option value=""> Sort </option>
                      <option value="ASC"> Ascending </option>
                      <option value="DESC"> Descending </option>
                    </CSelect>
                    <CButton
                      type="submit"
                      size="sm"
                      style={{ width: 80, backgroundColor: '#07689f', color: 'white', fontSize: 13 }}
                    >Search</CButton>
                  </div>
                </CCol>
              </CForm>
            </CCol>
            <PengajuanKreditTable
              getAction={getPengajuanKredit}
              dataPengajuanKredit={listKredit}
            />
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
}