import React, { useState } from 'react';
import {
  CCol,
  CDataTable, 
  CTooltip,
  CButton
} from '@coreui/react';
import CIcon from '@coreui/icons-react'; 
import FormJenisKredit from './FormJenisKredit';
import { useDispatch } from 'react-redux';
import { bprNusaServer } from '../../server/api';
import { confirmAlert } from 'react-confirm-alert';
import { deleteDataJenisKredit } from '../../store/actions/dataMaster';
import { toast } from 'react-toastify';

export default function TableJenisKredit({ dataJenisKredit }){
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState("");
  const [modalJenisKredit, setModalJenisKredit] = useState(false);

  const confirmDelete = (jenisKreditId) => {
    confirmAlert({
      title: 'Hapus Jenis Kredit',
      message: 'Apakah kamu yakin ingin menghapus data jenis kredit ini ?',
      buttons: [
        {
          label: 'Yakin',
          onClick: () => {  
            doDeleteJenisKredit(jenisKreditId);
          }
        },
        {
          label: 'Tidak',
          onClick: () => console.log("cancel"),
        }
      ]
    });
  }

  const openModalFormJenisKredit = (item) => {
    setSelectedItem(item);
    setModalJenisKredit(true);
  }

  const doDeleteJenisKredit = async (jenisKreditId) => {
    try {
      setLoading(true);
      const { data } = await  bprNusaServer.delete(`/data-master/delete-jenis-kredit/${jenisKreditId}`, {
        headers: {
          admin_access_token: localStorage.admin_access_token
        }
      });

      if(data){ 
        if(data.statusCode === 200){
          dispatch(deleteDataJenisKredit(jenisKreditId));
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
      items={dataJenisKredit}
      fields={["jenis_kredit", "keterangan", "action"]}
      striped
      itemsPerPage={3}
      pagination
      scopedSlots = {{
        'action': (item) => (
          <td>
          <CTooltip content="Edit Jenis Kredit" placement="bottom">
            <CButton onClick={() => openModalFormJenisKredit(item)} size="sm" color="info">
              <CIcon name="cil-pencil" /> 
            </CButton>
          </CTooltip>
          {" "}
          <CTooltip content="Hapus Jenis Kredit" placement="bottom">
            <CButton onClick={() => confirmDelete(item.id)} disabled={loading} size="sm" color="danger"> 
              <CIcon name="cil-trash" />
            </CButton>
          </CTooltip> 
        </td>
        )
      }}
    /> 
      { selectedItem && 
        <FormJenisKredit 
          modal={modalJenisKredit}
          setModal={setModalJenisKredit}
          action="Update"
          selectedItem={selectedItem}
          />  
      }
  </CCol>
  );
}