import React, { useState } from 'react';
import {
  CCol,
  CDataTable,
  CTooltip,
  CButton
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import Helper from '../../helpers/helper';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { deleteProduk } from '../../store/actions/dataProduk';
import { bprNusaServer } from "../../server/api";
import { confirmAlert } from 'react-confirm-alert';

export default function TableProduk({ dataProduk }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const [loading, setLoading] = useState(false);

  const confirmDelete = (produkId) => {
    confirmAlert({
      title: 'Hapus Produk',
      message: 'Apakah kamu yakin ingin menghapus data produk ini ?',
      buttons: [
        {
          label: 'Yakin',
          onClick: () => {
            doDeleteKonten(produkId);
          }
        },
        {
          label: 'Tidak',
          onClick: () => console.log("cancel"),
        }
      ]
    });
  }

  const doDeleteKonten = async (produkId) => {
    try {
      setLoading(true);
      const { data } = await bprNusaServer.delete(`/data-produk/admin/delete-produk/${produkId}`, {
        headers: {
          admin_access_token: localStorage.admin_access_token
        }
      });

      if (data) {
        if (data.statusCode === 200) {
          dispatch(deleteProduk(produkId));
          toast.info(" ✔ " + data.message);
        } else {
          toast.error(" ⚠ " + data.message);
        }
        setLoading(false);
      }

    } catch (error) {
      console.log(error);
    }
  }

  return (
    <CCol className="my-3">
      <CDataTable
        items={dataProduk}
        fields={["jenis_produk", "judul", "createdAt", "action"]}
        striped
        itemsPerPage={10}
        pagination
        scopedSlots={{
          'createdAt': (item) => (
            <td style={{ width: '20%' }}>
              { Helper.dateFormat(item.createdAt) === "Invalid Date" ? <span className="badge badge-danger">{Helper.dateFormat(item.createdAt)}</span> : Helper.dateFormat(item.createdAt)}
            </td>
          ),
          'action': (item) => (
            <td style={{ width: '15%' }}>
              <CTooltip content="Edit Produk" placement="bottom">
                <CButton onClick={() => history.push(`/admin/cms-produk/edit-form/${item.id}`)} size="sm" color="info">
                  <CIcon name="cil-pencil" />
                </CButton>
              </CTooltip>
              {" "}
              <CTooltip content="Hapus Produk" placement="bottom">
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