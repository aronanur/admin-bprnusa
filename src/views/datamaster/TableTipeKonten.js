import React, { useState } from 'react';
import {
  CCol,
  CDataTable, 
  CTooltip,
  CButton
} from '@coreui/react';
import CIcon from '@coreui/icons-react'; 
import FormTipeKonten from './FormTipeKonten';
import { useDispatch } from 'react-redux';
import { bprNusaServer } from '../../server/api';
import { confirmAlert } from 'react-confirm-alert';
import { deleteDataTipeKonten } from '../../store/actions/dataMaster';
import { toast } from 'react-toastify';

export default function TableTipeKonten({ dataTipeKonten }){
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState("");
  const [modalTipeKonten, setModalTipeKonten] = useState(false);

  const confirmDelete = (TipeKontenId) => {
    confirmAlert({
      title: 'Hapus Tipe Konten',
      message: 'Apakah kamu yakin ingin menghapus data tipe konten ini ?',
      buttons: [
        {
          label: 'Yakin',
          onClick: () => {  
            doDeleteTipeKonten(TipeKontenId);
          }
        },
        {
          label: 'Tidak',
          onClick: () => console.log("cancel"),
        }
      ]
    });
  }

  const openModalFormTipeKonten = (item) => {
    setSelectedItem(item);
    setModalTipeKonten(true);
  }

  const doDeleteTipeKonten = async (tipeKontenId) => {
    try {
      setLoading(true);
      const { data } = await  bprNusaServer.delete(`/data-master/delete-tipe-konten/${tipeKontenId}`, {
        headers: {
          admin_access_token: localStorage.admin_access_token
        }
      });

      if(data){ 
        if(data.statusCode === 200){
          dispatch(deleteDataTipeKonten(tipeKontenId));
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
      items={dataTipeKonten}
      fields={["tipe_konten", "action"]}
      striped
      itemsPerPage={3}
      pagination
      scopedSlots = {{
        'tipe_konten': (item) => (
          <td style={{ width: "70%" }}>
            { item.tipe_konten }
          </td>
        ),
        'action': (item) => (
          <td>
          <CTooltip content="Edit Tipe Konten" placement="bottom">
            <CButton onClick={() => openModalFormTipeKonten(item)} size="sm" color="info">
              <CIcon name="cil-pencil" /> 
            </CButton>
          </CTooltip>
          {" "}
          <CTooltip content="Hapus Tipe Konten" placement="bottom">
            <CButton onClick={() => confirmDelete(item.id)} disabled={loading} size="sm" color="danger"> 
              <CIcon name="cil-trash" />
            </CButton>
          </CTooltip> 
        </td>
        )
      }}
    /> 
      { selectedItem && 
        <FormTipeKonten 
          modal={modalTipeKonten}
          setModal={setModalTipeKonten}
          action="Update"
          selectedItem={selectedItem}
          />  
      }
  </CCol>
  );
}