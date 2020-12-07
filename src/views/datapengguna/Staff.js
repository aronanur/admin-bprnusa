import React, { useState, useEffect, useCallback } from 'react';
import {
  CRow, 
  CCol, 
  CCard, 
  CCardHeader, 
  CCardBody, 
  CButton, 
  CInput,
  CInputGroup, 
  CInputGroupPrepend,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import TambahStaff from './TambahStaff'; 
import StaffTable from './StaffTable';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { bprNusaServer } from '../../server/api';
import { staffData } from '../../store/actions/actionUser';
import { toast } from 'react-toastify';

export default function Staff(){
  const dispatch = useDispatch();
  const history = useHistory();
  const [keyword, setKeyword] = useState('');
  const [modal, setModal] = useState(false);
  const listStaff = useSelector(state => state.userReducer.staffData);
 
  const getStaffData = useCallback( async () => {
    try {
      const { data } = await bprNusaServer.get(`/users/admin/list-admin?keyword=${keyword}`, {
        headers: {
          admin_access_token: localStorage.admin_access_token
        }
      });

      if(data){
        if(data.statusCode === 200){
          dispatch(staffData(data.body)); 
        }else{
          toast.error(" ⚠ " + data.message); 
          history.push("/admin");
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, [keyword, dispatch, history]); 

  useEffect(() => {
    getStaffData();
  }, [getStaffData])

  return(
    <CRow>
      <CCol xs={12}>
        <CCard>
          <CCardHeader style={{ fontSize: 18, fontWeight: 'bold' }}>
            Staff
            <div className="card-header-actions"> 
            </div>
          </CCardHeader>
          <CCardBody>
            <CCol
              className="d-flex justify-content-between">
                <div>
                  <CButton 
                    size="sm"
                    color="dark"
                    onClick={() => setModal(!modal)}>
                    <CIcon name="cil-userFollow" />
                    <span style={{ position: "relative", top: 2 }}>&nbsp;Tambah Staff</span> 
                  </CButton>
                </div> 
                <div>
                    <CInputGroup className="mb-3">
                        <CInput style={{ width: 250 }} type="text" onChange={(e) => setKeyword(e.target.value)} name="keyword" placeholder="Cari data admin..." />
                        <CInputGroupPrepend> 
                        </CInputGroupPrepend>
                      </CInputGroup>
                </div>
            </CCol> 
            <StaffTable 
              dataUser={listStaff ? listStaff : []}
            />
          </CCardBody>
        </CCard>
      </CCol>
      <TambahStaff 
        modal={modal}
        setModal={setModal}
        getStaffData={getStaffData}
      />
    </CRow>
  );
}