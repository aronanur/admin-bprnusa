import React, { useState } from 'react';
import {
  CCol,
  CDataTable,
  CBadge,
  CButton,
  CTooltip
} from '@coreui/react';
import Helper from '../../helpers/helper';
import CIcon from '@coreui/icons-react'; 
import UbahRoles from './UbahRoles';
import { bprNusaServer } from '../../server/api';
import { ToastContainer, toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { deleteStaff } from '../../store/actions/actionUser';
import { confirmAlert } from 'react-confirm-alert';

export default function StaffTable({ dataUser }){
  const dispatch = useDispatch();
  const user = useSelector(state => state.userReducer.user);
  const [modalRoles, setModalRoles] = useState(false);
  const [loading, setLoading] = useState(false);
  const getBadge = status => {
    switch (status) {
      case 'admin': return 'success'
      case 'superadmin': return 'secondary'
      default: return 'primary'
    }
  };
  const [selectedUser, setSelectedUser] = useState(null);

  const openChangeRolesModal = (item) => {
    setSelectedUser(item);
    setModalRoles(true);
  }

  const confirmDelete = (staffId) => {
    confirmAlert({
      title: 'Hapus Staff',
      message: 'Apakah kamu yakin ingin menghapus data staff ini ?',
      buttons: [
        {
          label: 'Yakin',
          onClick: () => {  
            deleteStaffAction(staffId);
          }
        },
        {
          label: 'Tidak',
          onClick: () => console.log("cancel"),
        }
      ]
    });
  } 

  const deleteStaffAction = async (staffId) => {
    try {
      setLoading(true);
      const { data } = await bprNusaServer.delete(`/users/admin/delete-staff/${staffId}`, {
        headers: {
          admin_access_token: localStorage.admin_access_token
        }
      });

      if(data){ 
        if(data.statusCode === 200){
          dispatch(deleteStaff(staffId));
          toast.info(" ✔ " + data.message);
        }else{
          toast.error(" ⚠ " + data.message);
        }
        setLoading(false);
      }

    } catch (error) {
      console.log(error);
    }
  }

  return(
    <CCol className="my-3"> 
      <CDataTable
        items={dataUser}
        fields={["email", "no_hp", "roles", 'createdAt', 'action']}
        striped
        itemsPerPage={10}
        pagination
        scopedSlots = {{
          'roles':
            (item)=>(
              <td>
                <CBadge color={getBadge(item.roles)}>
                  {item.roles}
                </CBadge>
              </td>
            ),
            'createdAt': (item) => (
              <td>
                { Helper.dateFormat(item.createdAt) === "Invalid Date" ? <span className="badge badge-danger">{ Helper.dateFormat(item.createdAt) }</span> : Helper.dateFormat(item.createdAt) }
              </td>
            ),
            'action': (item) => (
              <>
                { item.id !== user.id 
                  ?
                  <td>
                    <CTooltip content="Ubah Roles Staff" placement="bottom">
                      <CButton onClick={() => openChangeRolesModal(item)} size="sm" color="warning">
                        <CIcon name="cil-user" /> 
                      </CButton>
                    </CTooltip>
                    {" "}
                    <CTooltip content="Hapus Staff" placement="bottom">
                      <CButton onClick={() => confirmDelete(item.id)} disabled={loading} size="sm" color="danger"> 
                        <CIcon name="cil-trash" />
                      </CButton>
                    </CTooltip> 
                  </td>
                  :
                  <td>
                    <span className="badge badge-danger">Tidak ada akses untuk akun sendiri</span>
                  </td>
                }
              </>
            )
        }}
      />
      { selectedUser && 
            <UbahRoles 
            modal={modalRoles}
            setModal={setModalRoles}
            selectedUser={selectedUser}
            />  
      }
      <ToastContainer />
    </CCol>
  );
}