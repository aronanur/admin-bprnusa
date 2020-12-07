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
import TableKonten from './TableKonten';
import { listKonten } from '../../store/actions/dataKonten';
import { bprNusaServer } from '../../server/api';
import { Link, useRouteMatch } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

export default function Konten() {
  const dispatch = useDispatch();
  const dataKonten = useSelector(state => state.dataKontenReducer.listKonten);
  const [form, setForm] = useState({
    keyword: '',
    sort: '',
    filter: ''
  });
  const { path } = useRouteMatch();
  const [tipeKonten, setTipeKonten] = useState([]);

  const handleInput = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const getDataTipeKonten = useCallback(async () => {
    try {
      const { data } = await bprNusaServer.get("/data-master/data-tipe-konten", {
        headers: {
          admin_access_token: localStorage.admin_access_token
        }
      });

      if (data) {
        if (data.statusCode === 200) {
          setTipeKonten(data.body)
        }
      }

    } catch (error) {
      console.log(error);
    }
  }, [])

  const parseKontenIntoSelect = useCallback(() => {
    if (tipeKonten.length > 0) {
      return (
        tipeKonten.map((konten, i) => {
          return (
            <option key={i} value={konten.id}>{konten.tipe_konten}</option>
          );
        })
      );
    }
  }, [tipeKonten]);

  const getDataKonten = useCallback(async () => {
    try {
      const { data } = await bprNusaServer.get(`/data-konten/list-konten`, {
        headers: {
          admin_access_token: localStorage.admin_access_token
        }
      });

      if (data) {
        dispatch(listKonten(data.body));
      }

    } catch (error) {
      console.log(error)
    }
  }, [dispatch])

  const searchDataKonten = async (e) => {
    e.preventDefault();
    try {
      const { data } = await bprNusaServer.get(`/data-konten/list-konten/?keyword=${form.keyword}&filter=${form.filter}&sort=${form.sort}`, {
        headers: {
          admin_access_token: localStorage.admin_access_token
        }
      });

      if (data) {
        dispatch(listKonten(data.body));
      }

    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getDataTipeKonten();
    getDataKonten();
  }, [getDataTipeKonten, getDataKonten])

  return (
    <CRow>
      <CCol xs={12}>
        <CCard>
          <CCardHeader style={{ fontSize: 18, fontWeight: 'bold' }}>
            CMS Konten
            <div className="card-header-actions">
              <div>
                <CButton
                  as={Link}
                  to={`${path}/form`}
                  size="sm"
                  color="dark">
                  <CIcon name="cil-notes" />
                  <span style={{ position: "relative", top: 2 }}>&nbsp;Buat Konten</span>
                </CButton>
              </div>
            </div>
          </CCardHeader>
          <CCardBody>
            <CForm
              onSubmit={searchDataKonten}>
              <CCol
                className="d-flex justify-content-start ml-4 p-2">
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                  <CInput
                    style={{ width: 250 }}
                    onChange={handleInput}
                    className="mr-2"
                    name="keyword"
                    // value={form.keyword}
                    type="text"
                    placeholder="Cari data konten..." />
                  <CSelect
                    onChange={handleInput}
                    className="mr-2"
                    name="filter"
                    // value={form.filter}
                    style={{ width: 150 }}>
                    <option value=""> Filter By </option>
                    {parseKontenIntoSelect()}
                  </CSelect>
                  <CSelect
                    onChange={handleInput}
                    className="mr-2"
                    name="sort"
                    // value={form.sort}
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
            <CCol
              md={12}>
              <TableKonten
                dataKonten={dataKonten}
              />
            </CCol>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
}