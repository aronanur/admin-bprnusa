import React, { useState } from 'react';
import {
  CCol,
  CDataTable, 
  CTooltip,
  CButton
} from '@coreui/react';
import CIcon from '@coreui/icons-react'; 
import FormJenisLampiran from './FormTipeLampiran';
import { useDispatch } from 'react-redux';
import { bprNusaServer } from '../../server/api';
import { confirmAlert } from 'react-confirm-alert';
import { deleteDataTipeLampiran } from '../../store/actions/dataMaster';
import { toast } from 'react-toastify';

export default function TableJenisLampiran({ dataTipeLampiran }){
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState("");
  const [modalJenisLampiran, setModalJenisLampiran] = useState(false);

  const confirmDelete = (jenisLampiranId) => {
    confirmAlert({
      title: 'Hapus Jenis Lampiran',
      message: 'Apakah kamu yakin ingin menghapus data jenis lampiran ini ?',
      buttons: [
        {
          label: 'Yakin',
          onClick: () => {  
            doDeleteJenisLampiran(jenisLampiranId);
          }
        },
        {
          label: 'Tidak',
          onClick: () => console.log("cancel"),
        }
      ]
    });
  }

  const openModalFormJenisLampiran = (item) => {
    setSelectedItem(item);
    setModalJenisLampiran(true);
  }

  const doDeleteJenisLampiran = async (jenisLampiranId) => {
    try {
      setLoading(true);
      const { data } = await  bprNusaServer.delete(`/data-master/delete-jenis-lampiran/${jenisLampiranId}`, {
        headers: {
          admin_access_token: localStorage.admin_access_token
        }
      });

      if(data){ 
        if(data.statusCode === 200){
          dispatch(deleteDataTipeLampiran(jenisLampiranId));
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
      items={dataTipeLampiran}
      fields={["jenis_lampiran", "action"]}
      striped
      itemsPerPage={3}
      pagination
      scopedSlots = {{
        'jenis_lampiran': (item) => (
          <td style={{ width: "70%" }}>
            { item.jenis_lampiran }
          </td>
        ),
        'action': (item) => (
          <td>
          <CTooltip content="Edit Tipe Lampiran" placement="bottom">
            <CButton onClick={() => openModalFormJenisLampiran(item)} size="sm" color="info">
              <CIcon name="cil-pencil" /> 
            </CButton>
          </CTooltip>
          {" "}
          <CTooltip content="Hapus Tipe Lampiran" placement="bottom">
            <CButton onClick={() => confirmDelete(item.id)} disabled={loading} size="sm" color="danger"> 
              <CIcon name="cil-trash" />
            </CButton>
          </CTooltip> 
        </td>
        )
      }}
    /> 
      { selectedItem && 
        <FormJenisLampiran 
          modal={modalJenisLampiran}
          setModal={setModalJenisLampiran}
          action="Update"
          selectedItem={selectedItem}
          />  
      }
  </CCol>
  );
}