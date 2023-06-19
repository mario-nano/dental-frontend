import {
  MapContainer,
  TileLayer,
  LayersControl,
  ZoomControl,
  ScaleControl,
  Popup,
  Marker
} from "react-leaflet";
import { Icon } from "leaflet";
import { useEffect } from "react";
import DentalServices from "../../services/dental.services";
import { useNavigate } from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch} from "../../redux/store";
import {setDentalParam} from "../../redux/dentalSlice";
import UserServices from "../../services/user.services";

//Set Zoom Level for detail of a business and zoom level for a list of business

const tooth = new Icon({
  iconUrl: "/dental-care.png",
  iconSize: [40, 40],
});

const BUSINESS_LIST_ZOOM_LEVEL = 14;

const MAX_BUSINESS_ZOOM_LEVEL = 18;
const GOTHENBURG_CENTER_LOCATION = [57.7089, 11.9746];

const GOOGLE_MAP_TYPE = "https://mt.google.com/vt/lyrs=m&x={x}&y={y}&z={z}";

const OPEN_STREET_MAP_TYPE =
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}";

const GOOGLE_SATELLITE_MAP_TYPE =
  "https://mt.google.com/vt/lyrs=s&x={x}&y={y}&z={z}";

const Map = ({
  defaultMapType = GOOGLE_MAP_TYPE,
  centerLocation,
  zoomLevel
}) => {
  const dispatch : AppDispatch = useDispatch();
  const navigate = useNavigate();
  const dentals = useSelector((state) => state.dental.dentals);
  const doctors = useSelector((state) => state.dental.doctors);

  const dispatchDentalParam = (fieldName, value) => {
    const payload = {
      fieldName: fieldName,
      value: value
    }
    dispatch(setDentalParam(payload));
  }

  useEffect(() => {
    DentalServices.getAll()
        .then(response => {
          dispatchDentalParam('dentals', response.data)
        }).catch(error => {
      console.log(error);
    })
  },[])

  const selectClinic = async (dentalId) => {
    let payload = {
      doctors: doctors
    }
    // noinspection DuplicatedCode
    await UserServices.findDoctors(payload)
        .then(response => {
              dispatchDentalParam('doctorDetails', response.data)
        }).catch(error => {
          console.log(error);
        })


    let dental = dentals.find(clinic => clinic.id === dentalId);
    dispatchDentalParam('mapSelected', true)
    dispatchDentalParam('dentalId', dentalId)
    dispatchDentalParam('name', dental.name)
    dispatchDentalParam('doctors', dental.doctors)
    dispatchDentalParam('address', dental.address)
    dispatchDentalParam('city', dental.city)
    dispatchDentalParam('coordinate', dental.coordinate)
    dispatchDentalParam('openinghours', dental.openinghours)
    navigate('/appointment');
  }

  return (
    <MapContainer
      style={{ height: "100%" }}
      center={centerLocation || GOTHENBURG_CENTER_LOCATION}
      zoom={zoomLevel || BUSINESS_LIST_ZOOM_LEVEL}
      maxZoom={MAX_BUSINESS_ZOOM_LEVEL}
      zoomControl={false}
    >
      {dentals.map((p) => (
          <Marker
            key={p.id}
            position={[p.coordinate.latitude, p.coordinate.longitude]}
            icon={tooth}
          >
            <Popup key={p.id}>
              <h5 className={'fw-bolder'}>{p.name}</h5>
              <p><strong>Clinic Owner:</strong> {p.owner}</p>
              <p><strong>Doctors:</strong> {p.doctors.length || 0}</p>
              <p><strong>Address:</strong> {p.address},<br />{p.city}</p>
              <p>
                <strong>Opening hours:</strong><br />
                <span className={'ps-3'}>
                  Monday: {p.openinghours.monday.open} - {p.openinghours.monday.close}<br /></span>
                <span className={'ps-3'}>
                  Tuesday: {p.openinghours.tuesday.open} - {p.openinghours.tuesday.close}<br /></span>
                <span className={'ps-3'}>
                  Wednesday: {p.openinghours.wednesday.open} - {p.openinghours.wednesday.close}<br /></span>
                <span className={'ps-3'}>
                  Thursday: {p.openinghours.thursday.open} - {p.openinghours.thursday.close}<br /></span>
                <span className={'ps-3'}>
                  Friday: {p.openinghours.friday.open} - {p.openinghours.friday.close}</span>
              </p>
              <div className={'d-flex justify-content-center mb-3'}>
                <button className={'btn btn-primary'} onClick={() => selectClinic(p.id)}>
                  View appointments
                </button>
              </div>
            </Popup>
          </Marker>
      ))}

      <LayersControl position="bottomleft">
        <LayersControl.BaseLayer
          checked={defaultMapType === GOOGLE_MAP_TYPE}
          name="Regular Map"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />{" "}
        </LayersControl.BaseLayer>

        <LayersControl.BaseLayer
          checked={defaultMapType === GOOGLE_SATELLITE_MAP_TYPE}
          name="Satellite Map"
        >
          <TileLayer url={GOOGLE_SATELLITE_MAP_TYPE} />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer
          checked={defaultMapType === OPEN_STREET_MAP_TYPE}
          name="Open Street Map"
        >
          <TileLayer url={OPEN_STREET_MAP_TYPE} />
        </LayersControl.BaseLayer>
      </LayersControl>
      <ScaleControl imperial={false} position="bottomright" />
      <ZoomControl position="bottomright" />
    </MapContainer>
  );
};

export default Map;
