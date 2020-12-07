import React, { useState } from 'react';
import {
  CCol,
  CDataTable,
  CBadge,
  CButton,
  CTooltip
} from '@coreui/react';

import CIcon from '@coreui/icons-react';

import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';

import { bprNusaServer } from '../../server/api';
import { deleteUser, changeStatus } from '../../store/actions/actionUser';

export default function StaffTable({ dataUser }) {
  const history = useHistory();
  const dispatch = useDispatch();

  //STATE
  const [loading, setLoading] = useState(false);

  //Action Badge 
  const getBadge = status => {
    switch (status) {
      case 1: return 'success'
      case 0: return 'danger'
      default: return 'primary'
    }
  };

  // Delete User
  const confirmDelete = (userId) => {
    confirmAlert({
      title: 'Hapus User',
      message: 'Apakah kamu yakin ingin menghapus data user ini ?',
      buttons: [
        {
          label: 'Yakin',
          onClick: () => {
            actionDeleteUser(userId);
          }
        },
        {
          label: 'Tidak',
          onClick: () => console.log("cancel"),
        }
      ]
    });
  }

  const actionDeleteUser = async (userId) => {
    try {
      setLoading(true);
      const { data } = await bprNusaServer.delete(`/users/admin/delete-user/${userId}`, {
        headers: {
          admin_access_token: localStorage.admin_access_token
        }
      });

      actionFeedBack(data, 'delete', { userId });

    } catch (error) {
      toast.error(" ⚠ Terjadi Kesalahan Pada Jaringan, Silahkan Cek Jaringan Anda");
    }
  }

  // Active & Inactive User
  const confirmChange = (userId) => {
    confirmAlert({
      title: 'Status user',
      message: 'Apakah kamu yakin ingin merubah status user ini ?',
      buttons: [
        {
          label: 'Yakin',
          onClick: () => {
            actionChangeStatus(userId);
          }
        },
        {
          label: 'Tidak',
          onClick: () => console.log("cancel"),
        }
      ]
    });
  }

  const actionChangeStatus = async (userId) => {
    try {
      setLoading(true);
      const { data } = await bprNusaServer.patch(`/users/admin/patch-status-user/${userId}`, {}, {
        headers: {
          admin_access_token: localStorage.admin_access_token
        }
      });

      actionFeedBack(data, 'patch');

    } catch (error) {
      toast.error(" ⚠ Terjadi Kesalahan Pada Jaringan, Silahkan Cek Jaringan Anda");
    }
  }

  const actionFeedBack = (data, type, params = {}) => {
    if (data) {
      if (data.statusCode === 200) {
        if (type === 'delete') {
          dispatch(deleteUser(+params.userId));
        } else {
          dispatch(changeStatus(+data.body.userId, data.body.isActive));
        }
        toast.info(" ✔ " + data.message);
      } else {
        toast.error(" ⚠ " + data.message);
      }
      setLoading(false);
    }
  }

  return (
    <CCol className="my-3">
      <CDataTable
        items={dataUser}
        fields={["noHp", "email", "namaLengkap", 'noKtp', 'fotoKtp', 'isActive', 'action']}
        striped
        itemsPerPage={10}
        pagination
        scopedSlots={{
          'isActive':
            (item) => (
              <td>
                <CBadge color={getBadge(item.isActive)}>
                  {item.isActive === 1 ? 'Active' : 'Inactive'}
                </CBadge>
              </td>
            ),
          "fotoKtp": (item) => (
            <td>
              <CTooltip content="Klik untuk download" placement="bottom">
                <a href={item.fotoKtp}><img src={item.fotoKtp} alt="Gambar" width={60} height={40} /></a>
              </CTooltip>
            </td>
          ),
          "action": (item) => (
            <td>
              <CTooltip content={item.isActive === 1 ? "Inactivate User" : "Activate User"} placement="bottom">
                <CButton disabled={loading} onClick={() => confirmChange(item.id)} size="sm" color={item.isActive === 1 ? "warning" : "success"}>
                  <CIcon name={item.isActive === 1 ? "cilBan" : "cilCheckCircle"} />
                </CButton>
              </CTooltip>
              
              {" "}
              <CTooltip content="Hapus User" placement="bottom">
                <CButton disabled={loading} onClick={() => confirmDelete(item.id)} size="sm" color="danger">
                  <CIcon name="cil-trash" />
                </CButton>
              </CTooltip>
            </td>
          )
        }}
      />
    </CCol>
  );
}