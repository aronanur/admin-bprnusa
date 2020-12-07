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
  id_tipe_konten: "",
  judul: "",
}

export default function FormAddKonten() {
  const history = useHistory();
  const { kontenId } = useParams();
  const [form, setForm] = useState(formBody);
  const [editorText, setEditorText] = useState({
    editorState: EditorState.createEmpty()
  })
  const [validationError, setValidationError] = useState({});
  const [tipeKonten, setTipeKonten] = useState([]);
  const [gambar, setGambar] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusKonten, setStatusKonten] = useState("Unpublish");

  const renderImage = () => {
    if (gambar) {
      let imageUrl = gambar;
      if (typeof gambar !== 'string') {
        imageUrl = URL.createObjectURL(gambar)
      }
      return <CImg height="350px" src={imageUrl} />
    } else {
      return <h2 className="text-center pt-4">{kontenId ? 'Silahkan Perbaharui Gambar' : 'Silahkan Pilih Gambar'}</h2>;
    }
  }

  const getDataTipeKonten = useCallback(async () => {
    try {
      const { data } = await bprNusaServer.get("/data-master/data-tipe-konten", {
        headers: {
          admin_access_token: localStorage.admin_access_token
        }
      });

      if (data) {
        if (data.statusCode === 200) {
          setTipeKonten(data.body)
        }
      }

    } catch (error) {
      toast.error(" ⚠ Terjadi Kesalahan Pada Jaringan, Silahkan Cek Jaringan Anda");
    }
  }, [])


  const parseKontenIntoSelect = useCallback(() => {
    if (tipeKonten.length > 0) {
      return (
        tipeKonten.map((konten, i) => {
          return (
            <option key={i} value={konten.id}>{konten.tipe_konten}</option>
          );
        })
      );
    }
  }, [tipeKonten])

  const handleInput = (e) => {
    e.preventDefault();
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const handlerWysiswyg = (editorState) => {
    setEditorText({ editorState })
  };

  const getDetailKonten = async () => {
    try {
      const { data } = await bprNusaServer.get(`/data-konten/detail-konten/${kontenId}`, {
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

  const doAddKonten = async (e) => {
    e.preventDefault();
    let formData = new FormData();

    if (!gambar) {
      toast.error(" ⚠ Silahkan pilih gambar terlebih dahulu!");
      return;
    }

    formData.append("id_tipe_konten", form.id_tipe_konten);
    formData.append("judul", form.judul);
    formData.append("status_konten", statusKonten);
    formData.append("gambar", gambar);
    formData.append("keterangan", draftToHtml(convertToRaw(editorText.editorState.getCurrentContent())));

    console.log(formData, 'ini post')

    try {
      setLoading(true);
      const { data } = await bprNusaServer.post("/data-konten/add-data-konten/", formData, {
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

  const doUpdateKonten = async (e) => {
    e.preventDefault();
    let formData = new FormData();

    formData.append("id_tipe_konten", form.id_tipe_konten);
    formData.append("judul", form.judul);
    formData.append("status_konten", statusKonten);
    formData.append("gambar", gambar);
    formData.append("keterangan", draftToHtml(convertToRaw(editorText.editorState.getCurrentContent())));

    console.log(formData, "ini put");

    try {
      setLoading(true);
      const { data } = await bprNusaServer.put("/data-konten/update-konten/" + kontenId, formData, {
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
            id_tipe_konten: data.body.id_tipe_konten,
            judul: data.body.judul,
          });

          setImagePreview(data.body.gambar, 'data');
          setEditorText({
            editorState: EditorState.createWithContent(
              ContentState.createFromBlockArray(
                convertFromHTML(data.body.keterangan)
              )
            )
          })
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

  const setImagePreview = (image, from = 'select') => {
    setGambar(image);
  }

  useEffect(() => {

    if (kontenId) {
      getDetailKonten();
    }

    getDataTipeKonten()
  }, [getDataTipeKonten, kontenId])

  return (
    <CRow>
      <CCol xs={12}>
        <CCard>
          <CCardHeader style={{ fontSize: 18, fontWeight: 'bold' }}>
            Form Konten
            <div className="card-header-actions">
            </div>
          </CCardHeader>
          <CCardBody>
            <CForm
              onSubmit={kontenId ? doUpdateKonten : doAddKonten}
              encType="multipart/form-data">
              <CRow>
                <CCol md={6}>
                  <CFormGroup>
                    <CLabel>Tipe Konten</CLabel>
                    <CSelect onChange={handleInput} value={form.id_tipe_konten} name="id_tipe_konten">
                      <option value=""> -- Pilih Tipe Konten --</option>
                      {parseKontenIntoSelect()}
                    </CSelect>
                    <p className="text-danger pt-2" style={{ fontSize: 12 }}>
                      {validationError["id_tipe_konten"] || ""}
                    </p>
                  </CFormGroup>
                </CCol>
                <CCol md={6}>
                  <CFormGroup>
                    <CLabel>Judul Konten</CLabel>
                    <CInput
                      type="text"
                      name="judul"
                      placeholder="Tuliskan Judul Konten"
                      onChange={handleInput}
                      value={form.judul}
                    />
                    <p className="text-danger pt-2" style={{ fontSize: 12 }}>
                      {validationError["judul"] || ""}
                    </p>
                  </CFormGroup>
                </CCol>
                <CCol md={6}>
                  <CFormGroup>
                    <CLabel>Gambar</CLabel>
                    <CInputFile
                      accept="image/x-png,image/gif,image/jpeg"
                      onChange={(e) => setImagePreview(e.target.files[0])}
                      name="gambar"
                    />
                    <p className="text-danger pt-2" style={{ fontSize: 12 }}>
                      {validationError["gambar"] || ""}
                    </p>
                  </CFormGroup>
                </CCol>
                <CCol
                  md={6}>
                  <div style={{ minWidth: 350, maxWidth: 400, minHeight: 100, maxHeight: 350 }}>
                    {renderImage()}
                  </div>
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
                    onClick={() => setStatusKonten("Publish")}
                    disabled={loading}
                    color="primary"
                    className="mr-2">
                    {loading ? "Loading..." : "Publish"}
                  </CButton>
                  <CButton
                    type="submit"
                    disabled={loading}
                    color="warning">
                    {loading ? "Loading..." : "Simpan Sebagai Draft"}
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