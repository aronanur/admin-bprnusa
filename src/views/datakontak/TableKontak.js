import React, { useState } from 'react';
import {
  CCol,
  CDataTable,
  CTooltip,
  CButton
} from '@coreui/react';
import UpdateKontak from './FormAddKontak';
import CIcon from '@coreui/icons-react';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { confirmAlert } from 'react-confirm-alert';
// import { deleteKontak } from '../../store/actions/dataKontak';
import { bprNusaServer } from "../../server/api";

export default function TableKonten({ dataKontak, getAction }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const confirmDelete = (kontenId) => {
    console.log(kontenId)
    confirmAlert({
      title: 'Hapus Kontak',
      message: 'Apakah kamu yakin ingin menghapus data kontak ini ?',
      buttons: [
        {
          label: 'Yakin',
          onClick: () => {
            doDeleteKontak(kontenId);
          }
        },
        {
          label: 'Tidak',
          onClick: () => console.log("cancel"),
        }
      ]
    });
  }

  const openModal = (item) => {
    setSelectedItem(item);
    setModal(true);
  }

  const doDeleteKontak = async (kontakId) => {
    try {
      setLoading(true);
      const { data } = await bprNusaServer.delete(`/data-kontak/admin/delete-kontak/${kontakId}`, {
        headers: {
          admin_access_token: localStorage.admin_access_token
        }
      });

      if (data) {
        if (data.statusCode === 200) {
          getAction();
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
        items={dataKontak}
        fields={["nama_kantor", "email", "whatsapp", 'fb', 'ig', 'website', "action"]}
        striped
        itemsPerPage={10}
        pagination
        scopedSlots={{
          'action': (item) => (
            <td>
              <CTooltip content="Edit Kontak" placement="bottom">
                <CButton onClick={() => openModal(item)} size="sm" color="info">
                  <CIcon name="cil-pencil" />
                </CButton>
              </CTooltip>
              {" "}
              <CTooltip content="Hapus Kontak" placement="bottom">
                <CButton disabled={loading} onClick={() => confirmDelete(item.id)} size="sm" color="danger">
                  <CIcon name="cil-trash" />
                </CButton>
              </CTooltip>
            </td>
          )
        }}
      />
      <UpdateKontak
        getAction={getAction}
        modal={modal}
        setModal={setModal}
        selectedItem={selectedItem}
        type="update"
      />
    </CCol>
  );
}