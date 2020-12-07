import React, { useState, useEffect } from 'react';
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
  CTextarea
} from '@coreui/react';


import { toast } from 'react-toastify';
import { useHistory, useParams } from 'react-router-dom';
import { apiWilayah, bprNusaServer } from '../../server/api';

//Helper
import Helper from '../../helpers/helper';

const formBody = {
  no_hp: '',
  email: '',
  password: '',
  nama_lengkap: '',
  tempat_lahir: '',
  tanggal_lahir: '',
  jenis_kelamin: '',
  status_perkawinan: '',
  alamat: '',
  kota: '',
  kecamatan: '',
  kelurahan: '',
  pekerjaan: '',
  bidang_usaha: '',
  perusahaan: '',
  no_ktp: '',
  foto_ktp: ''
}

export default function FormUser() {
  const history = useHistory();
  const { userId } = useParams();
  const [form, setForm] = useState(formBody);
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState(formBody);
  const [tokenApiWilayah, setTokenApiWilayah] = useState(null);

  //State Api Wilayah
  const [kabupaten, setKabupaten] = useState(null);
  const [kecamatan, setKecamatan] = useState(null);
  const [kelurahan, setKelurahan] = useState(null);

  //State Ktp
  const [fotoKtp, setFotoKtp] = useState(null);

  const handleInput = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  //Get & Parse Data Kabupaten , Kecamatan , Kelurahan From API 
  const wilayahInputHandler = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (e.target.name === 'kota') getListKecamatan(e.target.value);
    else if (e.target.name === 'kecamatan') getListKelurahan(e.target.value);
  }

  const getListKabupaten = async () => {
    try {
      const { data } = await apiWilayah.get("/poe");

      if (data) {
        callDataKabupaten(data.token);
      }
    } catch (error) {
      toast.error(" ⚠ Terjadi Kesalahan Pada Jaringan, Silahkan Cek Jaringan Anda");
      history.goBack("/");
    }
  }

  const callDataKabupaten = async (token) => {
    try {
      setTokenApiWilayah(token);
      const { data } = await apiWilayah.get(`/MeP7c5ne${token}/m/wilayah/kabupaten?idpropinsi=32`);
      if (data) {
        setKabupaten(data.data);
      }
    } catch (error) {
      toast.error(" ⚠ Terjadi Kesalahan Pada Jaringan, Silahkan Cek Jaringan Anda");
      history.goBack("/");
    }
  }

  const getListKecamatan = async (kabupatenId) => {
    try {
      const { data } = await apiWilayah.get(`/MeP7c5ne${tokenApiWilayah}/m/wilayah/kecamatan?idkabupaten=${+kabupatenId}`);
      if (data) {
        setKecamatan(data.data);
      }
    } catch (error) {
      toast.error(" ⚠ Terjadi Kesalahan Pada Jaringan, Silahkan Cek Jaringan Anda");
      history.goBack("/");
    }
  }

  const getListKelurahan = async (kecamatanId) => {
    try {
      const { data } = await apiWilayah.get(`/MeP7c5ne${tokenApiWilayah}/m/wilayah/kelurahan?idkecamatan=${kecamatanId}`);
      if (data) {
        setKelurahan(data.data);
      }
    } catch (error) {
      toast.error(" ⚠ Terjadi Kesalahan Pada Jaringan, Silahkan Cek Jaringan Anda");
      history.goBack("/");
    }
  }

  const generateSelectWilayah = (dataWilayah) => {
    return dataWilayah.map((data, i) => {
      return (
        <option key={i} value={data.id} title={data.name}>{data.name}</option>
      );
    })
  }
  // End Get Parse Data Wilayah

  // Foto KTP
  const renderImage = () => {
    if (fotoKtp) {
      let imageUrl = fotoKtp;
      if (typeof fotoKtp !== 'string') {
        imageUrl = URL.createObjectURL(fotoKtp)
      }
      return <img width="300px" alt="Foto KTP" height="200px" src={imageUrl} />
    } else {
      return <h2 className="text-center pt-4">Foto KTP</h2>;
    }
  }

  //Get Detail User
  const getDetailUser = async () => {
    try {
      const { data } = await bprNusaServer.get(`/users/admin/detail-user/${userId}`, {
        headers: {
          admin_access_token: localStorage.admin_access_token
        }
      });

      actionFeedBack(data, 'get');

    } catch (error) {
      toast.error(" ⚠ Terjadi Kesalahan Pada Jaringan, Silahkan Cek Jaringan Anda");
      history.goBack("/");
    }
  }

  //Action
  const submitHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    if (userId) {
      if (!fotoKtp) {
        toast.error(" ⚠ Silahkan pilih foto ktp terlebih dahulu!");
        return;
      }
    }

    //Append FormData
    formData.append("no_hp", form.no_hp);
    formData.append("email", form.email);
    if (!userId) {
      formData.append("password", form.password);
    }
    formData.append("nama_lengkap", form.nama_lengkap);
    formData.append("tempat_lahir", form.tempat_lahir);
    formData.append("tanggal_lahir", form.tanggal_lahir);
    formData.append("jenis_kelamin", form.jenis_kelamin);
    formData.append("status_perkawinan", form.status_perkawinan);
    formData.append("alamat", form.alamat);
    formData.append("kota", form.kota);
    formData.append("kecamatan", form.kecamatan);
    formData.append("kelurahan", form.kelurahan);
    formData.append("pekerjaan", form.pekerjaan);
    formData.append("bidang_usaha", form.bidang_usaha);
    formData.append("perusahaan", form.perusahaan);
    formData.append("no_ktp", form.no_ktp);
    formData.append("foto_ktp", fotoKtp);

    try {
      setLoading(true);
      if (userId) {
        const { data } = await bprNusaServer.put(`/users/admin/update-user/${userId}`, formData, {
          headers: {
            admin_access_token: localStorage.admin_access_token
          }
        });

        actionFeedBack(data, 'update');
      } else {
        const { data } = await bprNusaServer.post("/users/admin/registrasi-user-by-staff", formData, {
          headers: {
            admin_access_token: localStorage.admin_access_token
          }
        });

        actionFeedBack(data);
      }

    } catch (error) {
      toast.error(" ⚠ Terjadi Kesalahan Pada Jaringan, Silahkan Cek Jaringan Anda");
      history.goBack();
    }
  }

  const actionFeedBack = (data, actionType = 'get') => {
    if (data) {
      if (data.statusCode === 200) {

        if (actionType === 'get') {
          const setKecamatan = getListKecamatan(data.body.kota);
          const setKelurahan = getListKelurahan(data.body.kecamatan);

          if (setKecamatan && setKelurahan) {
            setForm({
              ...form,
              no_hp: data.body.noHp,
              email: data.body.email,
              password: data.body.password,
              nama_lengkap: data.body.namaLengkap,
              tempat_lahir: data.body.tempatLahir,
              tanggal_lahir: Helper.inputDateFormat(data.body.tanggalLahir),
              jenis_kelamin: data.body.jenisKelamin,
              status_perkawinan: data.body.statusPerkawinan,
              alamat: data.body.alamat,
              kota: data.body.kota,
              kecamatan: data.body.kecamatan,
              kelurahan: data.body.kelurahan,
              pekerjaan: data.body.pekerjaan,
              bidang_usaha: data.body.bidangUsaha,
              no_ktp: data.body.noKtp,
            });

            setFotoKtp(data.body.fotoKtp);
          }

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

  //LifeCycle
  useEffect(() => {
    if (userId && tokenApiWilayah) {
      getDetailUser();
    }
    getListKabupaten();
    return;
  }, [userId, tokenApiWilayah]);

  return (
    <CRow>
      <CCol xs={12}>
        <CCard>
          <CCardHeader style={{ fontSize: 18, fontWeight: 'bold' }}>
            Form User
            <div className="card-header-actions">
              <CButton
                size="sm"
                color="danger"
                onClick={() => history.goBack()}>
                <span style={{ position: "relative", top: 2 }}>Kembali</span>
              </CButton>
            </div>
          </CCardHeader>
          <CCardBody>
            <CForm
              onSubmit={submitHandler}
              encType="multipart/form-data">
              <CRow>
                <CCol md={12} className="mb-2">
                  <h5><b>1. Akun User</b></h5>
                </CCol>
                <CCol
                  md={4}>
                  <CFormGroup>
                    <CLabel>Nomor Hp</CLabel>
                    <CInput type="number" maxLength={12} name="no_hp" placeholder="Masukan Nomor Hp" value={form.no_hp} onChange={handleInput} />
                    <p className="text-danger pt-2" style={{ fontSize: 12 }}>{validationError["no_hp"] || ''}</p>
                  </CFormGroup>
                </CCol>
                <CCol
                  md={4}>
                  <CFormGroup>
                    <CLabel>Email</CLabel>
                    <CInput type="text" name="email" placeholder="Masukan Email" value={form.email} onChange={handleInput} />
                    <p className="text-danger pt-2" style={{ fontSize: 12 }}>{validationError["email"] || ''}</p>
                  </CFormGroup>
                </CCol>
                <CCol
                  md={4}>
                  <CFormGroup>
                    <CLabel>Password {userId && 'Baru (tidak wajib diisi)'}</CLabel>
                    <CInput type="password" name="password" placeholder="Masukan Password" value={form.password} onChange={handleInput} />
                    <p className="text-danger pt-2" style={{ fontSize: 12 }}>{validationError["password"] || ''}</p>
                  </CFormGroup>
                </CCol>
                <CCol md={12} className="my-2">
                  <h5><b>2. Biodata User</b></h5>
                </CCol>
                <CCol
                  md={4}>
                  <CFormGroup>
                    <CLabel>Nama Lengkap</CLabel>
                    <CInput type="text" name="nama_lengkap" placeholder="Masukan Nama Lengkap" value={form.nama_lengkap} onChange={handleInput} />
                    <p className="text-danger pt-2" style={{ fontSize: 12 }}>{validationError["nama_lengkap"] || ''}</p>
                  </CFormGroup>
                </CCol>
                <CCol
                  md={4}>
                  <CFormGroup>
                    <CLabel>Tempat Lahir</CLabel>
                    <CInput type="text" name="tempat_lahir" placeholder="Masukan Tempat Lahir" value={form.tempat_lahir} onChange={handleInput} />
                    <p className="text-danger pt-2" style={{ fontSize: 12 }}>{validationError["tempat_lahir"] || ''}</p>
                  </CFormGroup>
                </CCol>
                <CCol
                  md={4}>
                  <CFormGroup>
                    <CLabel>Tanggal Lahir</CLabel>
                    <CInput type="date" id="date-input" name="tanggal_lahir" placeholder="date" value={form.tanggal_lahir} onChange={handleInput} />
                    <p className="text-danger pt-2" style={{ fontSize: 12 }}>{validationError["tanggal_lahir"] || ''}</p>
                  </CFormGroup>
                </CCol>
                <CCol
                  md={4}>
                  <CFormGroup>
                    <CLabel>Jenis Kelamin</CLabel>
                    <CSelect onChange={handleInput} name="jenis_kelamin" value={form.jenis_kelamin}>
                      <option value=""> -- Pilih Jenis Kelamin --</option>
                      <option value="Pria">Pria</option>
                      <option value="Wanita">Wanita</option>
                    </CSelect>
                    <p className="text-danger pt-2" style={{ fontSize: 12 }}>{validationError["jenis_kelamin"] || ''}</p>
                  </CFormGroup>
                </CCol>
                <CCol
                  md={4}>
                  <CFormGroup>
                    <CLabel>Status Perkawinan</CLabel>
                    <CSelect onChange={handleInput} name="status_perkawinan" value={form.status_perkawinan}>
                      <option value=""> -- Pilih Status Perkawinan --</option>
                      <option value="Belum Menikah">Belum Menikah</option>
                      <option value="Menikah">Menikah</option>
                      <option value="Cerai">Cerai</option>
                    </CSelect>
                    <p className="text-danger pt-2" style={{ fontSize: 12 }}>{validationError["status_perkawinan"] || ''}</p>
                  </CFormGroup>
                </CCol>
                <CCol md={4}>

                </CCol>
                <CCol
                  md={4}>
                  <CFormGroup>
                    <CLabel>Pekerjaan</CLabel>
                    <CInput type="text" name="pekerjaan" placeholder="Masukan Pekerjaan" value={form.pekerjaan} onChange={handleInput} />
                    <p className="text-danger pt-2" style={{ fontSize: 12 }}>{validationError["pekerjaan"] || ''}</p>
                  </CFormGroup>
                </CCol>
                <CCol
                  md={4}>
                  <CFormGroup>
                    <CLabel>Bidang Usaha</CLabel>
                    <CInput type="text" name="bidang_usaha" placeholder="Masukan Bidang Usaha" value={form.bidang_usaha} onChange={handleInput} />
                    <p className="text-danger pt-2" style={{ fontSize: 12 }}>{validationError["bidang_usaha"] || ''}</p>
                  </CFormGroup>
                </CCol>
                <CCol
                  md={4}>
                  <CFormGroup>
                    <CLabel>Perusahaan</CLabel>
                    <CInput type="text" name="perusahaan" placeholder="Masukan Perusahaan" value={form.perusahaan} onChange={handleInput} />
                    <p className="text-danger pt-2" style={{ fontSize: 12 }}>{validationError["perusahaan"] || ''}</p>
                  </CFormGroup>
                </CCol>
                <CCol
                  md={4}>
                  <CFormGroup>
                    <CLabel>Kabupaten / Kota</CLabel>
                    <CSelect onChange={wilayahInputHandler} name="kota" value={form.kota} title="">
                      <option value="" title=""> -- Pilih Kabupaten / Kota --</option>
                      {kabupaten && generateSelectWilayah(kabupaten)}
                    </CSelect>
                    <p className="text-danger pt-2" style={{ fontSize: 12 }}>{validationError["kota"] || ''}</p>
                  </CFormGroup>
                </CCol>
                <CCol
                  md={4}>
                  <CFormGroup>
                    <CLabel>Kecamatan</CLabel>
                    <CSelect onChange={wilayahInputHandler} name="kecamatan" value={form.kecamatan} title="">
                      <option value="" title=""> -- Pilih Kecamatan --</option>
                      {kecamatan && generateSelectWilayah(kecamatan)}
                    </CSelect>
                    <p className="text-danger pt-2" style={{ fontSize: 12 }}>{validationError["kecamatan"] || ''}</p>
                  </CFormGroup>
                </CCol>
                <CCol
                  md={4}>
                  <CFormGroup>
                    <CLabel>Kelurahan</CLabel>
                    <CSelect onChange={wilayahInputHandler} name="kelurahan" value={form.kelurahan} title="">
                      <option value="" title=""> -- Pilih Kelurahan --</option>
                      {kelurahan && generateSelectWilayah(kelurahan)}
                    </CSelect>
                    <p className="text-danger pt-2" style={{ fontSize: 12 }}>{validationError["kelurahan"] || ''}</p>
                  </CFormGroup>
                </CCol>
                <CCol
                  md={12} className="mb-2">
                  <CFormGroup>
                    <CLabel>Alamat Lengkap</CLabel>
                    <CTextarea name="alamat" value={form.alamat} onChange={handleInput} cols={5} rows={5} placeholder="Masukan Alamat Lengkap" />
                    <p className="text-danger pt-2" style={{ fontSize: 12 }}>{validationError["alamat"] || ''}</p>
                  </CFormGroup>
                </CCol>
                <CCol
                  md={4}>
                  <CFormGroup>
                    <CLabel>Nomor KTP</CLabel>
                    <CInput type="number" maxLength={16} name="no_ktp" placeholder="Masukan Nomor KTP" value={form.no_ktp} onChange={handleInput} />
                    <p className="text-danger pt-2" style={{ fontSize: 12 }}>{validationError["no_ktp"] || ''}</p>
                  </CFormGroup>
                </CCol>
                <CCol md={4}>
                  <CFormGroup>
                    <CLabel>Foto Ktp</CLabel>
                    <CInputFile
                      accept="image/x-png,image/gif,image/jpeg"
                      onChange={(e) => setFotoKtp(e.target.files[0])}
                      name="foto_ktp"
                    />
                    <p className="text-danger pt-2" style={{ fontSize: 12 }}> {validationError["foto_ktp"] || ""} </p>
                  </CFormGroup>
                </CCol>
                <CCol
                  md={4}>
                  <div style={{ width: 250, minHeight: 100, maxHeight: 250 }} >
                    {renderImage()}
                  </div>
                </CCol>
                <CCol md={4}>
                  <CButton
                    type="submit"
                    disabled={loading}
                    color="primary">
                    {loading ? "Loading..." : "Daftarkan User"}
                  </CButton>
                </CCol>
              </CRow>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow >
  );
}