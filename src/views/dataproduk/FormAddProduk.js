import React, { useState, useEffect, useCallback } from 'react';
import {
  CRow,
  CCol,
  CCard,
  CCardHeader,
  CCardBody,
  CButton,
  CInput,
  CFormGroup,
  CLabel,
  CSelect,
  CInputFile,
  CForm,
  CImg
} from '@coreui/react';
import draftToHtml from 'draftjs-to-html';
import { toast } from 'react-toastify';
import { Editor } from 'react-draft-wysiwyg';
import { useHistory, useParams } from 'react-router-dom';
import { bprNusaServer } from '../../server/api';
import { EditorState, convertToRaw, convertFromHTML, ContentState } from 'draft-js';

const formBody = {
  jenis_produk: "",
  judul: "",
  keterangan: '',
}

export default function FormAddKonten() {
  const history = useHistory();
  const { produkId } = useParams();
  const [form, setForm] = useState(formBody);
  const [editorText, setEditorText] = useState({
    editorState: EditorState.createEmpty()
  })
  const [validationError, setValidationError] = useState({});
  const [loading, setLoading] = useState(false);

  const handleInput = (e) => {
    e.preventDefault();
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const handlerWysiswyg = (editorState) => {
    setEditorText({ editorState });

    setForm({
      ...form,
      ['keterangan']: draftToHtml(convertToRaw(editorText.editorState.getCurrentContent()))
    });

  };

  const getDetailProduk = async () => {
    try {
      const { data } = await bprNusaServer.get(`/data-produk/admin/detail-produk/${produkId}`, {
        headers: {
          admin_access_token: localStorage.admin_access_token
        }
      });

      actionFeedBack(data);

    } catch (error) {
      toast.error(" ⚠ Terjadi Kesalahan Pada Jaringan, Silahkan Cek Jaringan Anda");
      history.goBack();
    }
  }

  const doAddProduk = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const { data } = await bprNusaServer.post("/data-produk/admin/add-produk/", form, {
        headers: {
          admin_access_token: localStorage.admin_access_token
        }
      });
      actionFeedBack(data);

    } catch (error) {
      toast.error(" ⚠ Terjadi Kesalahan Pada Jaringan, Silahkan Cek Jaringan Anda");
      history.goBack();
    }
  }

  const doUpdateproduk = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const { data } = await bprNusaServer.put("/data-produk/admin/edit-produk/" + produkId, form, {
        headers: {
          admin_access_token: localStorage.admin_access_token
        }
      });
      actionFeedBack(data, 'update');

    } catch (error) {
      toast.error(" ⚠ Terjadi Kesalahan Pada Jaringan, Silahkan Cek Jaringan Anda");
      history.goBack();
    }
  }

  const actionFeedBack = (data, actionType = 'get') => {
    if (data) {
      if (data.statusCode === 200) {

        if (actionType === 'get') {
          setForm({
            ...form,
            jenis_produk: data.body.jenis_produk,
            judul: data.body.judul,
            keterangan: data.body.keterangan
          });

          setEditorText({
            editorState: EditorState.createWithContent(
              ContentState.createFromBlockArray(
                convertFromHTML(data.body.keterangan)
              )
            )
          });


        } else {
          toast.info(" ✔ " + data.message);
          setValidationError({});
          setForm(formBody);
          history.goBack();
        }

      } else if (data.statusCode === 201) {
        toast.info(" ✔ " + data.message);
        setValidationError({});
        setForm(formBody);
        history.goBack();
      } else if (data.statusCode === 400) {
        setValidationError(data.message);
      } else {
        toast.error(" ⚠ " + data.message);
        history.goBack();
      }
      setLoading(false);
    }
  }

  useEffect(() => {

    if (produkId) {
      getDetailProduk();
    }

  }, [produkId])

  return (
    <CRow>
      <CCol xs={12}>
        <CCard>
          <CCardHeader style={{ fontSize: 18, fontWeight: 'bold' }}>
            Form Produk
            <div className="card-header-actions">
            </div>
          </CCardHeader>
          <CCardBody>
            <CForm
              onSubmit={produkId ? doUpdateproduk : doAddProduk}>
              <CRow>
                <CCol md={6}>
                  <CFormGroup>
                    <CLabel>Tipe Konten</CLabel>
                    <CSelect onChange={handleInput} value={form.jenis_produk} name="jenis_produk">
                      <option value=""> -- Pilih Jenis Produk --</option>
                      <option value="Deposito"> Deposito </option>
                      <option value="Tabungan"> Tabungan </option>
                      <option value="Kredit/Pinjaman"> Kredit/Pinjaman </option>
                    </CSelect>
                    <p className="text-danger pt-2" style={{ fontSize: 12 }}>
                      {validationError["jenis_produk"] || ""}
                    </p>
                  </CFormGroup>
                </CCol>
                <CCol md={6}>
                  <CFormGroup>
                    <CLabel>Judul Produk</CLabel>
                    <CInput
                      type="text"
                      name="judul"
                      placeholder="Tuliskan Judul Produk"
                      onChange={handleInput}
                      value={form.judul}
                    />
                    <p className="text-danger pt-2" style={{ fontSize: 12 }}>
                      {validationError["judul"] || ""}
                    </p>
                  </CFormGroup>
                </CCol>
                <CCol md={12}>
                  <CFormGroup>
                    <CLabel>Keterangan</CLabel>
                    <Editor
                      editorState={editorText.editorState}
                      onEditorStateChange={handlerWysiswyg}
                      placeholder="Tuliskan Keterangan"
                      editorStyle={{ height: 200 }}
                      wrapperClassName="demo-wrapper"
                      editorClassName="demo-editor"
                    />
                    <p className="text-danger pt-2" style={{ fontSize: 12 }}>
                      {validationError["keterangan"] || ""}
                    </p>
                  </CFormGroup>
                </CCol>
                <CCol md={4}>
                  <CButton
                    type="submit"
                    disabled={loading}
                    color="primary"
                    className="mr-2">
                    {loading ? "Loading..." : "Publish"}
                  </CButton>
                </CCol>
              </CRow>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
}