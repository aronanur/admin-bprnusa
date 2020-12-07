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
import CIcon from '@coreui/icons-react';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { userData } from '../../store/actions/actionUser';
import { bprNusaServer } from '../../server/api';

//Component Import 
import UserTable from './UserTable';

export default function User() {
  const history = useHistory();
  const dispatch = useDispatch();

  const dataUser = useSelector(state => state.userReducer.userData);

  //STATE
  const [form, setForm] = useState({
    keyword: '',
    filter: '',
    sort: ''
  });

  //Get User Data
  const getUserData = async () => {
    try {
      const { data } = await bprNusaServer.get("/users/admin/list-user", {
        headers: {
          admin_access_token: localStorage.admin_access_token
        }
      });

      if (data) {
        dispatch(userData(data.body));
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
      const { data } = await bprNusaServer.get(`/users/admin/list-user?keyword=${form.keyword}&filter=${form.filter}&sort=${form.sort}`, {
        headers: {
          admin_access_token: localStorage.admin_access_token
        }
      });

      if (data) {
        dispatch(userData(data.body));
      }

    } catch (error) {
      toast.error(" ⚠ Terjadi Kesalahan Pada Jaringan, Silahkan Cek Jaringan Anda");
      history.goBack("/admin");
    }
  }

  //LifeCycle
  useEffect(() => {
    getUserData();
  }, [])

  return (
    <CRow>
      <CCol xs={12}>
        <CCard>
          <CCardHeader style={{ fontSize: 18, fontWeight: 'bold' }}>
            User
            <div className="card-header-actions">

            </div>
          </CCardHeader>
          <CCardBody>
            <CCol
              className="d-flex justify-content-between">
              <div>
                {/* <CButton
                  size="sm"
                  color="success"
                  className="mt-2"
                  onClick={() => history.push("/admin/data-pengguna/user/user-registration")}>
                  <CIcon name="cil-userFollow" />
                  <span style={{ position: "relative", top: 2 }}>&nbsp;Daftarkan User</span>
                </CButton> */}
              </div>
              <CForm
                onSubmit={searchAction}>
                <CCol
                  className="d-flex justify-content-start ml-4 p-2">
                  <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <CInput
                      style={{ width: 250 }}
                      onChange={handleInput}
                      className="mr-2"
                      name="keyword"
                      type="text"
                      placeholder="Cari data user..." />
                    <CSelect
                      onChange={handleInput}
                      className="mr-2"
                      name="filter"
                      style={{ width: 150 }}>
                      <option value=""> Filter </option>
                      <option value="1"> Active </option>
                      <option value="0"> Inactive </option>
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
            <UserTable
              dataUser={dataUser}
            />
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
}