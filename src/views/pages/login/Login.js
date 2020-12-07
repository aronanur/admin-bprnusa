import React, { useState, useEffect } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CInput,
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupText,
  CRow,
  CImg
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import Logo from '../../../assets/logo/logo_bpr_nusa.png';
import { useHistory } from 'react-router-dom';
import { bprNusaServer } from '../../../server/api';
import { toast } from 'react-toastify'


const Login = () => {
  const history = useHistory();
  const [form, setForm] = useState({
    inputId: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  
  const handleInput = (e) => {
    setForm({
      ...form,
      [e.target.name] : e.target.value
    })
  }

  const doLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await bprNusaServer.post("/users/admin/login", form);

      if(data){ 
        if(data.statusCode === 200){
          localStorage.admin_access_token = data.adminToken;
          history.push("/admin");
        }else{
          toast.error(` ⚠ ${data.message} `);
        }
        setLoading(false);
      }

    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if(localStorage.admin_access_token){
      history.push("/admin");
    }
  }, [history])

  return (
    <div className="c-app c-default-layout flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md="4">
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm
                    onSubmit={doLogin}>
                    <div className="mb-3 ml-4">
                      <CImg
                        src={Logo}
                        width={200}
                        height={50}
                      />
                    </div>
                    <p className="text-muted text-center">Masuk ke BPR Nusa Admin Panel</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-user" />
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput type="text" name="inputId" onChange={handleInput} placeholder="Username" autoComplete="username" />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-lock-locked" />
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput type="password" name="password" onChange={handleInput} placeholder="Password" autoComplete="current-password" />
                    </CInputGroup>
                    <CRow>
                      <CCol xs="12">
                        <CButton type="submit" disabled={loading} color="danger" className="px-4 btn-block">{ loading ? "Loading..." : "Masuk" }</CButton>
                      </CCol> 
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard> 
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
