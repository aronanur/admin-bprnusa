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
import { listPendaftarKerja } from '../../store/actions/karir';

//Component Import 
import KarirTable from './KarirTable';

export default function User() {
  const history = useHistory();
  const dispatch = useDispatch();

  const listPendaftar = useSelector(state => state.karirReducer.listPendaftarKerja);

  //STATE
  const [form, setForm] = useState({
    filter: '',
    sort: ''
  });

  //Get Pendaftar Kerja
  const getPendaftarKerja = async () => {
    try {
      const { data } = await bprNusaServer.get("/karir/admin/list-pengajuan-kerja", {
        headers: {
          admin_access_token: localStorage.admin_access_token
        }
      });

      if (data) {
        if (data.statusCode == 403) {
          toast.error(" ⚠ " + data.message);
          history.goBack("/admin");
        }

        dispatch(listPendaftarKerja(data.body));
      }

    } catch (error) {
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
      const { data } = await bprNusaServer.get(`/karir/admin/list-pengajuan-kerja?filter=${form.filter}&sort=${form.sort}`, {
        headers: {
          admin_access_token: localStorage.admin_access_token
        }
      });

      if (data) {
        dispatch(listPendaftarKerja(data.body));
      }

    } catch (error) {
      toast.error(" ⚠ Terjadi Kesalahan Pada Jaringan, Silahkan Cek Jaringan Anda");
      history.goBack("/admin");
    }
  }

  //LifeCycle
  useEffect(() => {
    getPendaftarKerja();
    return;
  }, [])

  return (
    <CRow>
      <CCol xs={12}>
        <CCard>
          <CCardHeader style={{ fontSize: 18, fontWeight: 'bold' }}>
            Pendaftar Kerja
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
                      <option value="Terdaftar"> Terdaftar </option>
                      <option value="Validasi Data"> Validasi Data </option>
                      <option value="Diterima"> Diterima </option>
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
            <KarirTable
              dataPendaftarKerja={listPendaftar}
            />
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
}