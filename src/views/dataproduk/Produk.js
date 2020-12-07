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
import TableProduk from './TableProduk';
import { listProduk } from '../../store/actions/dataProduk';
import { bprNusaServer } from '../../server/api';
import { Link, useRouteMatch } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

export default function Konten() {
  const dispatch = useDispatch();
  const dataProduk = useSelector(state => state.dataProdukReducer.listProduk);
  const [form, setForm] = useState({
    keyword: '',
    sort: '',
  });
  const { path } = useRouteMatch();

  const handleInput = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const getDataProduk = useCallback(async () => {
    try {
      const { data } = await bprNusaServer.get(`/data-produk/admin/list-produk`, {
        headers: {
          admin_access_token: localStorage.admin_access_token
        }
      });

      if (data) {
        console.log(data, " <<< ")
        dispatch(listProduk(data.body));
      }

    } catch (error) {
      console.log(error)
    }
  }, [dispatch]);

  const searchDataProduk = async (e) => {
    e.preventDefault();
    try {
      const { data } = await bprNusaServer.get(`/data-produk/admin/list-produk/?keyword=${form.keyword}&sort=${form.sort}`, {
        headers: {
          admin_access_token: localStorage.admin_access_token
        }
      });

      if (data) {
        dispatch(listProduk(data.body));
      }

    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getDataProduk();
  }, [getDataProduk])

  return (
    <CRow>
      <CCol xs={12}>
        <CCard>
          <CCardHeader style={{ fontSize: 18, fontWeight: 'bold' }}>
            CMS Produk
            <div className="card-header-actions">
              <div>
                <CButton
                  as={Link}
                  to={`${path}/form`}
                  size="sm"
                  color="dark">
                  <CIcon name="cil-notes" />
                  <span style={{ position: "relative", top: 2 }}>&nbsp;Input Produk</span>
                </CButton>
              </div>
            </div>
          </CCardHeader>
          <CCardBody>
            <CForm
              onSubmit={searchDataProduk}>
              <CCol
                className="d-flex justify-content-start ml-4 p-2">
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                  <CInput
                    style={{ width: 250 }}
                    onChange={handleInput}
                    className="mr-2"
                    name="keyword"
                    type="text"
                    placeholder="Cari data produk..." />
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
            <CCol
              md={12}>
              <TableProduk
                dataProduk={dataProduk}
              />
            </CCol>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
}