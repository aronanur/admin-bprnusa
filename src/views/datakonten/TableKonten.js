import React, { useState } from 'react';
import {
  CCol,
  CDataTable,
  CTooltip,
  CButton
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { confirmAlert } from 'react-confirm-alert';
import { deleteKonten } from '../../store/actions/dataKonten';
import { bprNusaServer } from "../../server/api";

export default function TableKonten({ dataKonten }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const [loading, setLoading] = useState(false);

  const confirmDelete = (kontenId) => {
    console.log(kontenId)
    confirmAlert({
      title: 'Hapus Konten',
      message: 'Apakah kamu yakin ingin menghapus data konten ini ?',
      buttons: [
        {
          label: 'Yakin',
          onClick: () => {
            doDeleteKonten(kontenId);
          }
        },
        {
          label: 'Tidak',
          onClick: () => console.log("cancel"),
        }
      ]
    });
  }

  const doDeleteKonten = async (kontenId) => {
    try {
      setLoading(true);
      const { data } = await bprNusaServer.delete(`/data-konten/delete-konten/${kontenId}`, {
        headers: {
          admin_access_token: localStorage.admin_access_token
        }
      });

      if (data) {
        if (data.statusCode === 200) {
          dispatch(deleteKonten(kontenId));
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
        items={dataKonten}
        fields={["tipe_konten", "judul", "gambar", 'status_konten', "action"]}
        striped
        itemsPerPage={10}
        pagination
        scopedSlots={{
          "gambar": (item) => (
            <td>
              <img src={item.gambar} alt="Gambar" width={50} height={50} />
            </td>
          ),
          'status_konten': (item) => (
            <td>
              { item.status_konten === "Publish" ? <span className="badge badge-success">{item.status_konten}</span> : <span className="badge badge-danger">{item.status_konten}</span>}
            </td>
          ),
          'action': (item) => (
            <td>
              <CTooltip content="Edit Konten" placement="bottom">
                <CButton onClick={() => history.push(`/admin/cms-konten/edit-form/${item.id}`)} size="sm" color="info">
                  <CIcon name="cil-pencil" />
                </CButton>
              </CTooltip>
              {" "}
              <CTooltip content="Hapus Konten" placement="bottom">
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