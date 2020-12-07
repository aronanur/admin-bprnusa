const initialState = {
  dataJenisKredit: null,
  dataTipeKonten: null,
  dataTipeLampiran: null
}

export default (state = initialState, action) => {
  switch (action.type) {
    case "DATA_JENIS_KREDIT":
      return {...state, dataJenisKredit: action.payload };
    case "ADD_DATA_JENIS_KREDIT":
      return {...state, dataJenisKredit: [...state.dataJenisKredit, action.payload] }; 
    case "UPDATE_DATA_JENIS_KREDIT":
        return {...state, dataJenisKredit: updateFormat(state.dataJenisKredit, action.payload)}
    case "DELETE_DATA_JENIS_KREDIT":
      return {...state, dataJenisKredit: state.dataJenisKredit.filter((value) => value.id !== action.payload.id)}
    case "DATA_TIPE_KONTEN":
      return {...state, dataTipeKonten: action.payload };
    case "ADD_DATA_TIPE_KONTEN":
      return {...state, dataTipeKonten: [...state.dataTipeKonten, action.payload] };
    case "UPDATE_DATA_TIPE_KONTEN":
      return {...state, dataTipeKonten: updateFormat(state.dataTipeKonten, action.payload)}
    case "DELETE_DATA_TIPE_KONTEN":
        return {...state, dataTipeKonten: state.dataTipeKonten.filter((value) => value.id !== action.payload.id)}
    case "DATA_TIPE_LAMPIRAN":
      return {...state, dataTipeLampiran: action.payload };
    case "ADD_DATA_TIPE_LAMPIRAN":
      return {...state, dataTipeLampiran: [...state.dataTipeLampiran, action.payload] };
    case "UPDATE_DATA_TIPE_LAMPIRAN":
      return {...state, dataTipeLampiran: updateFormat(state.dataTipeLampiran, action.payload)}
    case "DELETE_DATA_TIPE_LAMPIRAN":
        return {...state, dataTipeLampiran: state.dataTipeLampiran.filter((value) => value.id !== action.payload.id)}
  
    default:
      return state;
  }
}

const updateFormat = (dataJenisKredit, newData) => { 
  dataJenisKredit.forEach((value, i) => {
    if(String(value.id) === String(newData.id)){
      dataJenisKredit[i] = newData;
    }
  });
  return dataJenisKredit;
}