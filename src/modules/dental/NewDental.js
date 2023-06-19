import {
    MapContainer,
    TileLayer,
    LayersControl,
    ZoomControl,
    ScaleControl,
    useMapEvents,
    Popup,
    Marker,
} from "react-leaflet";
import { Icon } from "leaflet";
import { useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import DentalServices from "../../services/dental.services"
import { Button } from "react-bootstrap";
import {useDispatch, useSelector} from "react-redux";
import { AppDispatch } from "../../redux/store";
import { setDentalParam } from "../../redux/dentalSlice";
import { useFormik } from "formik";
import * as Yup from "yup";
import clsx from "clsx";
import { Link, useNavigate } from "react-router-dom";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const location = new Icon({
    iconUrl: "/location.png",
    iconSize: [50, 50],
});

const BUSINESS_LIST_ZOOM_LEVEL = 14;

const MAX_BUSINESS_ZOOM_LEVEL = 18;
const GOTHENBURG_CENTER_LOCATION = [57.7089, 11.9746];

const GOOGLE_MAP_TYPE = "https://mt.google.com/vt/lyrs=m&x={x}&y={y}&z={z}";

const OPEN_STREET_MAP_TYPE =
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}";

const GOOGLE_SATELLITE_MAP_TYPE =
    "https://mt.google.com/vt/lyrs=s&x={x}&y={y}&z={z}";

const NewDental = ({
                 defaultMapType = GOOGLE_MAP_TYPE,
                 centerLocation,
                 zoomLevel,
                 isMiniSize = false,
             }) => {
    const dispatch: AppDispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [coordinate, setCoordinates] = useState([57.7089, 11.9746]);
    const userId = useSelector((state) => state.auth.userId);
    const firstname = useSelector((state) => state.auth.firstname);
    const lastname = useSelector((state) => state.auth.lastname);
    const initialValues = {
        clinicName: "",
        ownerName: `${firstname} ${lastname}`,
        ownerId: userId,
        doctors: "",
        address: "",
        city: "",
        coordinate: {
            longitude: undefined,
            latitude: undefined,
        },
        openinghours: {
            monday: {
                open: null,
                close: null,
            },
            tuesday: {
                open: null,
                close: null,
            },
            wednesday: {
                open: null,
                close: null,
            },
            thursday: {
                open: null,
                close: null,
            },
            friday: {
                open: null,
                close: null,
            },
        },
    };
    const registrationSchema = Yup.object().shape({
        ownerName: Yup.string()
            .required("Owner name is required.")
            .min(3, "You need to enter at least 3 characters.")
            .max(50, "You can enter maximum of 50 characters."),
        clinicName: Yup.string()
            .required("Clinic name is required.")
            .min(3, "You need to enter at least 3 characters.")
            .max(50, "You can enter maximum of 50 characters."),
        address: Yup.string()
            .required("Address is required.")
            .min(6, "You need to enter at least 6 characters.")
            .max(50, "You can enter maximum of 50 characters."),
        city: Yup.string()
            .required("City is required.")
            .min(6, "You need to enter at least 6 characters.")
            .max(50, "You can enter maximum of 50 characters."),
        openinghoursMondayOpen: Yup.number()
            .min(0, "Open time is required")
            .required("Open time is required"),
        openinghoursMondayClose: Yup.number()
            .min(0, "Close time is required")
            .required("Close time is required")
            .when("openinghoursMondayOpen", (openinghoursMondayOpen, schema) => {
                return schema.test({
                    test: (openinghoursMondayClose) =>
                        openinghoursMondayClose > openinghoursMondayOpen,
                    message: "Must be later than Opening",
                });
            }),
        openinghoursTuesdayOpen: Yup.number()
            .min(0, "Open time is required")
            .required("Open time is required"),
        openinghoursTuesdayClose: Yup.number()
            .min(0, "Close time is required")
            .required("Close time is required")
            .when("openinghoursTuesdayOpen", (openinghoursTuesdayOpen, schema) => {
                return schema.test({
                    test: (openinghoursTuesdayClose) =>
                        openinghoursTuesdayClose > openinghoursTuesdayOpen,
                    message: "Must be later than Opening",
                });
            }),
        openinghoursWednesdayOpen: Yup.number()
            .min(0, "Open time is required")
            .required("Open time is required"),
        openinghoursWednesdayClose: Yup.number()
            .min(0, "Close time is required")
            .required("Close time is required")
            .when("openinghoursWednesdayOpen", (openinghoursWednesdayOpen, schema) => {
                return schema.test({
                    test: (openinghoursWednesdayClose) =>
                        openinghoursWednesdayClose > openinghoursWednesdayOpen,
                    message: "Must be later than Opening",
                });
            }),
        openinghoursThursdayOpen: Yup.number()
            .min(0, "Open time is required")
            .required("Open time is required"),
        openinghoursThursdayClose: Yup.number()
            .min(0, "Close time is required")
            .required("Close time is required")
            .when("openinghoursThursdayOpen", (openinghoursThursdayOpen, schema) => {
                return schema.test({
                    test: (openinghoursThursdayClose) =>
                        openinghoursThursdayClose > openinghoursThursdayOpen,
                    message: "Must be later than Opening",
                });
            }),
        openinghoursFridayOpen: Yup.number()
            .min(0, "Open time is required")
            .required("Open time is required"),
        openinghoursFridayClose: Yup.number()
            .min(0, "Close time is required")
            .required("Close time is required")
            .when("openinghoursFridayOpen", (openinghoursFridayOpen, schema) => {
                return schema.test({
                    test: (openinghoursFridayClose) =>
                        openinghoursFridayClose > openinghoursFridayOpen,
                    message: "Must be later than Opening",
                });
            }),
        longitude: Yup.number()
            .required("Location longitude is required"),
        latitude: Yup.number()
            .required("Location latitude is required")
    });
    const navigate = useNavigate();

    const dispatchDentalDetail = (fieldName, value) => {
        const payload = {
            fieldName: fieldName,
            value: value,
        };
        dispatch(setDentalParam(payload));
    };

    const formik = useFormik({
        initialValues,
        validationSchema: registrationSchema,
        onSubmit: async (values, { setStatus, setSubmitting }) => {
            setLoading(true);
            try {
                let data = {
                    name: values.clinicName,
                    owner: values.ownerName,
                    ownerId: values.ownerId,
                    doctors: [],
                    address: values.address,
                    city: values.city,
                    coordinate: {
                        longitude: values.longitude,
                        latitude: values.latitude,
                    },
                    openinghours: {
                        monday: {
                            open: values.openinghoursMondayOpen,
                            close: values.openinghoursMondayClose,
                        },
                        tuesday: {
                            open: values.openinghoursTuesdayOpen,
                            close: values.openinghoursTuesdayClose,
                        },
                        wednesday: {
                            open: values.openinghoursWednesdayOpen,
                            close: values.openinghoursWednesdayClose,
                        },
                        thursday: {
                            open: values.openinghoursThursdayOpen,
                            close: values.openinghoursThursdayClose,
                        },
                        friday: {
                            open: values.openinghoursFridayOpen,
                            close: values.openinghoursFridayClose,
                        },
                    },
                };
                console.log(data);
                await DentalServices.register(data)
                    .then((response) => {
                        navigate("/")
                        if (response.status !== 400) {
                            console.log(response);
                            navigate("/");
                        }
                    })
                    .catch((e) => {
                        setSubmitting(false);
                        setLoading(false);
                        if (e.response.status === 400) {
                            console.log(JSON.stringify(e.response));
                            setStatus(e.response.data.message);
                        }
                    });
            } catch (error) {
                // saveAuth(undefined)
                setStatus("The registration details is incorrect");
                setSubmitting(false);
                setLoading(false);
            }
        },
    });

    function MyComponent() {
        const [position, setPosition] = useState(null);

        useMapEvents({
            click: (e) => {
                setPosition(e.latlng);
                console.log(`Latitude: ${e.latlng.lat}, Longitude: ${e.latlng.lng}`);
                setCoordinates(e.latlng);
                console.log(coordinate);
                formik.values.longitude = e.latlng.lng;
                formik.values.latitude = e.latlng.lat;
            },
        });
        return coordinate === null ? null : (
            <Marker position={coordinate}>
                <Popup>
                    {coordinate.lat} {coordinate.lng}
                </Popup>
            </Marker>
        );
    }
    return (
        <Container fluid>
            <form
                className="form row fv-plugins-bootstrap5 fv-plugins-framework"
                noValidate
                onSubmit={formik.handleSubmit}
            >
                <div className={'row'}>
                    {/* begin::Heading */}
                    <div className="mb-3 text-center">
                        {/* begin::Title */}
                        <h2 className="text-dark mb-3">Clinic registration</h2>
                        {/* end::Title */}
                    </div>
                    {/* begin::Status msg */}
                    {formik.status && (
                        <div className="mb-lg-8 alert alert-danger">
                            <div className={"d-flex flex-row"}>
                                <div className={"me-3"}>
                                    <FontAwesomeIcon
                                        className={"fs-2"}
                                        icon={faExclamationCircle}
                                    />
                                </div>
                                <div className="alert-text font-weight-bold">
                                    {formik.status}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <div className={'d-flex flex-row'}>
                    <div className={'col-md-6 col-sm-12'}>
                        {/* begin::Clinic name */}
                        <div className="col-xl-6 mb-3 pr-3">
                            <label className='form-label fw-bold text-dark fs-6 px-1'>Clinic name</label>
                            <input
                                type="text"
                                autoComplete="off"
                                {...formik.getFieldProps("clinicName")}
                                className={clsx(
                                    "form-control",
                                    {
                                        "is-invalid":
                                            formik.touched.clinicName && formik.errors.clinicName,
                                    },
                                    {
                                        "is-valid":
                                            formik.touched.clinicName && !formik.errors.clinicName,
                                    }
                                )}
                            />
                            {formik.touched.clinicName && formik.errors.clinicName && (
                                <div className="fv-plugins-message-container">
                                    <div className="fv-help-block">
                                        <span role="alert">{formik.errors.clinicName}</span>
                                    </div>
                                </div>
                            )}
                            {/* end::Form group */}
                        </div>
                        {/* begin::Owner name */}
                        <div className="col-xl-6 mb-3">
                            <label className='form-label fw-bold text-dark fs-6 px-1'>Owner name</label>
                            <input
                                type="text"
                                autoComplete="off"
                                {...formik.getFieldProps("ownerName")}
                                className={clsx(
                                    "form-control",
                                    {
                                        "is-invalid":
                                            formik.touched.ownerName && formik.errors.ownerName,
                                    },
                                    {
                                        "is-valid":
                                            formik.touched.ownerName && !formik.errors.ownerName,
                                    }
                                )}
                            />
                            {formik.touched.ownerName && formik.errors.ownerName && (
                                <div className="fv-plugins-message-container">
                                    <div className="fv-help-block">
                                        <span role="alert">{formik.errors.ownerName}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                        {/* begin::address */}
                        <div className="col-xl-6 mb-3 pr-3">
                            <label className='form-label fw-bold text-dark fs-6 px-1'>Clinic address</label>
                            <input
                                type="text"
                                autoComplete="off"
                                {...formik.getFieldProps("address")}
                                className={clsx(
                                    "form-control",
                                    {
                                        "is-invalid":
                                            formik.touched.address && formik.errors.address,
                                    },
                                    {
                                        "is-valid":
                                            formik.touched.address &&
                                            !formik.errors.address,
                                    }
                                )}
                            />
                            {formik.touched.address && formik.errors.address && (
                                <div className="fv-plugins-message-container">
                                    <div className="fv-help-block">
                                        <span role="alert">{formik.errors.address}</span>
                                    </div>
                                </div>
                            )}
                            {/* end::Form group */}
                        </div>
                        {/* begin::city */}
                        <div className="col-xl-6 mb-3">
                            <label className='form-label fw-bold text-dark fs-6 px-1'>City</label>
                            <input
                                type="text"
                                autoComplete="off"
                                {...formik.getFieldProps("city")}
                                className={clsx(
                                    "form-control",
                                    {
                                        "is-invalid":
                                            formik.touched.city && formik.errors.city,
                                    },
                                    {
                                        "is-valid":
                                            formik.touched.city && !formik.errors.city,
                                    }
                                )}
                            />
                            {formik.touched.city && formik.errors.city && (
                                <div className="fv-plugins-message-container">
                                    <div className="fv-help-block">
                                        <span role="alert">{formik.errors.city}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className={'col-md-6 col-sm-12'}>{/* Opening Hours field */}
                        <div className={"row"}>
                            <div className={"col-4"}></div>
                            <div className={"col-4 ps-3 fw-bold"}>Opening hours</div>
                            <div className={"col-4 ps-3 fw-bold"}>Closing hours</div>
                        </div>
                        {/* Monday */}
                        <div className={"row mb-2"}>
                            <div className={"col-4 text-end pe-2 fw-bold"}>Monday: </div>
                            <div className={"col-4"}>
                                <select
                                    {...formik.getFieldProps("openinghoursMondayOpen")}
                                    className={clsx(
                                        "form-select",
                                        {
                                            "is-invalid":
                                                formik.touched.openinghoursMondayOpen &&
                                                formik.errors.openinghoursMondayOpen,
                                        },
                                        {
                                            "is-valid":
                                                formik.touched.openinghoursMondayOpen &&
                                                !formik.errors.openinghoursMondayOpen,
                                        }
                                    )}
                                >
                                    <option value={-1}> - Select- </option>
                                    <option value={0}>00:00</option>
                                    <option value={1}>01:00</option>
                                    <option value={2}>02:00</option>
                                    <option value={3}>03:00</option>
                                    <option value={4}>04:00</option>
                                    <option value={5}>05:00</option>
                                    <option value={6}>06:00</option>
                                    <option value={7}>07:00</option>
                                    <option value={8}>08:00</option>
                                    <option value={9}>09:00</option>
                                    <option value={10}>10:00</option>
                                    <option value={11}>11:00</option>
                                    <option value={12}>12:00</option>
                                    <option value={13}>13:00</option>
                                    <option value={14}>14:00</option>
                                    <option value={15}>15:00</option>
                                    <option value={16}>16:00</option>
                                    <option value={17}>17:00</option>
                                    <option value={18}>18:00</option>
                                    <option value={19}>19:00</option>
                                    <option value={20}>20:00</option>
                                    <option value={21}>21:00</option>
                                    <option value={22}>22:00</option>
                                    <option value={23}>23:00</option>
                                </select>
                                {formik.touched.openinghoursMondayOpen &&
                                    formik.errors.openinghoursMondayOpen && (
                                        <div className="fv-plugins-message-container">
                                            <div className="fv-help-block">
                                      <span role="alert">
                                        {formik.errors.openinghoursMondayOpen}
                                      </span>
                                            </div>
                                        </div>
                                    )}
                            </div>
                            <div className={"col-4"}>
                                <select
                                    {...formik.getFieldProps("openinghoursMondayClose")}
                                    className={clsx(
                                        "form-select",
                                        {
                                            "is-invalid":
                                                formik.touched.openinghoursMondayClose &&
                                                formik.errors.openinghoursMondayClose,
                                        },
                                        {
                                            "is-valid":
                                                formik.touched.openinghoursMondayClose &&
                                                !formik.errors.openinghoursMondayClose,
                                        }
                                    )}
                                >
                                    <option value={-1}> - Select- </option>
                                    <option value={0}>00:00</option>
                                    <option value={1}>01:00</option>
                                    <option value={2}>02:00</option>
                                    <option value={3}>03:00</option>
                                    <option value={4}>04:00</option>
                                    <option value={5}>05:00</option>
                                    <option value={6}>06:00</option>
                                    <option value={7}>07:00</option>
                                    <option value={8}>08:00</option>
                                    <option value={9}>09:00</option>
                                    <option value={10}>10:00</option>
                                    <option value={11}>11:00</option>
                                    <option value={12}>12:00</option>
                                    <option value={13}>13:00</option>
                                    <option value={14}>14:00</option>
                                    <option value={15}>15:00</option>
                                    <option value={16}>16:00</option>
                                    <option value={17}>17:00</option>
                                    <option value={18}>18:00</option>
                                    <option value={19}>19:00</option>
                                    <option value={20}>20:00</option>
                                    <option value={21}>21:00</option>
                                    <option value={22}>22:00</option>
                                    <option value={23}>23:00</option>
                                </select>
                                {formik.touched.openinghoursMondayClose && formik.errors.openinghoursMondayClose && (
                                    <div className="fv-plugins-message-container">
                                        <div className="fv-help-block">
                                            <span role="alert">{formik.errors.openinghoursMondayClose}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        {/* Tuesday */}
                        <div className={'row mb-2'}>
                            <div className={'col-4 text-end pe-2 fw-bold'}>Tuesday: </div>
                            <div className={'col-4'}>
                                <select
                                    {...formik.getFieldProps("openinghoursTuesdayOpen")}
                                    className={clsx(
                                        "form-select",
                                        {
                                            "is-invalid":
                                                formik.touched.openinghoursTuesdayOpen && formik.errors.openinghoursTuesdayOpen,
                                        },
                                        {
                                            "is-valid":
                                                formik.touched.openinghoursTuesdayOpen &&
                                                !formik.errors.openinghoursTuesdayOpen
                                        }
                                    )}
                                >
                                    <option value={-1}> - Select- </option>
                                    <option value={0}>00:00</option>
                                    <option value={1}>01:00</option>
                                    <option value={2}>02:00</option>
                                    <option value={3}>03:00</option>
                                    <option value={4}>04:00</option>
                                    <option value={5}>05:00</option>
                                    <option value={6}>06:00</option>
                                    <option value={7}>07:00</option>
                                    <option value={8}>08:00</option>
                                    <option value={9}>09:00</option>
                                    <option value={10}>10:00</option>
                                    <option value={11}>11:00</option>
                                    <option value={12}>12:00</option>
                                    <option value={13}>13:00</option>
                                    <option value={14}>14:00</option>
                                    <option value={15}>15:00</option>
                                    <option value={16}>16:00</option>
                                    <option value={17}>17:00</option>
                                    <option value={18}>18:00</option>
                                    <option value={19}>19:00</option>
                                    <option value={20}>20:00</option>
                                    <option value={21}>21:00</option>
                                    <option value={22}>22:00</option>
                                    <option value={23}>23:00</option>
                                </select>
                                {formik.touched.openinghoursTuesdayOpen && formik.errors.openinghoursTuesdayOpen && (
                                    <div className="fv-plugins-message-container">
                                        <div className="fv-help-block">
                                            <span role="alert">{formik.errors.openinghoursTuesdayOpen}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className={'col-4'}>
                                <select
                                    {...formik.getFieldProps("openinghoursTuesdayClose")}
                                    className={clsx(
                                        "form-select",
                                        {
                                            "is-invalid":
                                                formik.touched.openinghoursTuesdayClose && formik.errors.openinghoursTuesdayClose,
                                        },
                                        {
                                            "is-valid":
                                                formik.touched.openinghoursTuesdayClose &&
                                                !formik.errors.openinghoursTuesdayClose
                                        }
                                    )}
                                >
                                    <option value={-1}> - Select- </option>
                                    <option value={0}>00:00</option>
                                    <option value={1}>01:00</option>
                                    <option value={2}>02:00</option>
                                    <option value={3}>03:00</option>
                                    <option value={4}>04:00</option>
                                    <option value={5}>05:00</option>
                                    <option value={6}>06:00</option>
                                    <option value={7}>07:00</option>
                                    <option value={8}>08:00</option>
                                    <option value={9}>09:00</option>
                                    <option value={10}>10:00</option>
                                    <option value={11}>11:00</option>
                                    <option value={12}>12:00</option>
                                    <option value={13}>13:00</option>
                                    <option value={14}>14:00</option>
                                    <option value={15}>15:00</option>
                                    <option value={16}>16:00</option>
                                    <option value={17}>17:00</option>
                                    <option value={18}>18:00</option>
                                    <option value={19}>19:00</option>
                                    <option value={20}>20:00</option>
                                    <option value={21}>21:00</option>
                                    <option value={22}>22:00</option>
                                    <option value={23}>23:00</option>
                                </select>
                                {formik.touched.openinghoursTuesdayClose && formik.errors.openinghoursTuesdayClose && (
                                    <div className="fv-plugins-message-container">
                                        <div className="fv-help-block">
                                            <span role="alert">{formik.errors.openinghoursTuesdayClose}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        {/* Wednesday */}
                        <div className={'row mb-2'}>
                            <div className={'col-4 text-end pe-2 fw-bold'}>Wednesday: </div>
                            <div className={'col-4'}>
                                <select
                                    {...formik.getFieldProps("openinghoursWednesdayOpen")}
                                    className={clsx(
                                        "form-select",
                                        {
                                            "is-invalid":
                                                formik.touched.openinghoursWednesdayOpen && formik.errors.openinghoursWednesdayOpen,
                                        },
                                        {
                                            "is-valid":
                                                formik.touched.openinghoursWednesdayOpen &&
                                                !formik.errors.openinghoursWednesdayOpen
                                        }
                                    )}
                                >
                                    <option value={-1}> - Select- </option>
                                    <option value={0}>00:00</option>
                                    <option value={1}>01:00</option>
                                    <option value={2}>02:00</option>
                                    <option value={3}>03:00</option>
                                    <option value={4}>04:00</option>
                                    <option value={5}>05:00</option>
                                    <option value={6}>06:00</option>
                                    <option value={7}>07:00</option>
                                    <option value={8}>08:00</option>
                                    <option value={9}>09:00</option>
                                    <option value={10}>10:00</option>
                                    <option value={11}>11:00</option>
                                    <option value={12}>12:00</option>
                                    <option value={13}>13:00</option>
                                    <option value={14}>14:00</option>
                                    <option value={15}>15:00</option>
                                    <option value={16}>16:00</option>
                                    <option value={17}>17:00</option>
                                    <option value={18}>18:00</option>
                                    <option value={19}>19:00</option>
                                    <option value={20}>20:00</option>
                                    <option value={21}>21:00</option>
                                    <option value={22}>22:00</option>
                                    <option value={23}>23:00</option>
                                </select>
                                {formik.touched.openinghoursWednesdayOpen && formik.errors.openinghoursWednesdayOpen && (
                                    <div className="fv-plugins-message-container">
                                        <div className="fv-help-block">
                                            <span role="alert">{formik.errors.openinghoursWednesdayOpen}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className={'col-4'}>
                                <select
                                    {...formik.getFieldProps("openinghoursWednesdayClose")}
                                    className={clsx(
                                        "form-select",
                                        {
                                            "is-invalid":
                                                formik.touched.openinghoursWednesdayClose && formik.errors.openinghoursWednesdayClose,
                                        },
                                        {
                                            "is-valid":
                                                formik.touched.openinghoursWednesdayClose &&
                                                !formik.errors.openinghoursWednesdayClose
                                        }
                                    )}
                                >
                                    <option value={-1}> - Select- </option>
                                    <option value={0}>00:00</option>
                                    <option value={1}>01:00</option>
                                    <option value={2}>02:00</option>
                                    <option value={3}>03:00</option>
                                    <option value={4}>04:00</option>
                                    <option value={5}>05:00</option>
                                    <option value={6}>06:00</option>
                                    <option value={7}>07:00</option>
                                    <option value={8}>08:00</option>
                                    <option value={9}>09:00</option>
                                    <option value={10}>10:00</option>
                                    <option value={11}>11:00</option>
                                    <option value={12}>12:00</option>
                                    <option value={13}>13:00</option>
                                    <option value={14}>14:00</option>
                                    <option value={15}>15:00</option>
                                    <option value={16}>16:00</option>
                                    <option value={17}>17:00</option>
                                    <option value={18}>18:00</option>
                                    <option value={19}>19:00</option>
                                    <option value={20}>20:00</option>
                                    <option value={21}>21:00</option>
                                    <option value={22}>22:00</option>
                                    <option value={23}>23:00</option>
                                </select>
                                {formik.touched.openinghoursWednesdayClose && formik.errors.openinghoursWednesdayClose && (
                                    <div className="fv-plugins-message-container">
                                        <div className="fv-help-block">
                                            <span role="alert">{formik.errors.openinghoursWednesdayClose}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        {/* Thursday */}
                        <div className={'row mb-2'}>
                            <div className={'col-4 text-end pe-2 fw-bold'}>Thursday: </div>
                            <div className={'col-4'}>
                                <select
                                    {...formik.getFieldProps("openinghoursThursdayOpen")}
                                    className={clsx(
                                        "form-select",
                                        {
                                            "is-invalid":
                                                formik.touched.openinghoursThursdayOpen && formik.errors.openinghoursThursdayOpen,
                                        },
                                        {
                                            "is-valid":
                                                formik.touched.openinghoursThursdayOpen &&
                                                !formik.errors.openinghoursThursdayOpen
                                        }
                                    )}
                                >
                                    <option value={-1}> - Select- </option>
                                    <option value={0}>00:00</option>
                                    <option value={1}>01:00</option>
                                    <option value={2}>02:00</option>
                                    <option value={3}>03:00</option>
                                    <option value={4}>04:00</option>
                                    <option value={5}>05:00</option>
                                    <option value={6}>06:00</option>
                                    <option value={7}>07:00</option>
                                    <option value={8}>08:00</option>
                                    <option value={9}>09:00</option>
                                    <option value={10}>10:00</option>
                                    <option value={11}>11:00</option>
                                    <option value={12}>12:00</option>
                                    <option value={13}>13:00</option>
                                    <option value={14}>14:00</option>
                                    <option value={15}>15:00</option>
                                    <option value={16}>16:00</option>
                                    <option value={17}>17:00</option>
                                    <option value={18}>18:00</option>
                                    <option value={19}>19:00</option>
                                    <option value={20}>20:00</option>
                                    <option value={21}>21:00</option>
                                    <option value={22}>22:00</option>
                                    <option value={23}>23:00</option>
                                </select>
                                {formik.touched.openinghoursThursdayOpen && formik.errors.openinghoursThursdayOpen && (
                                    <div className="fv-plugins-message-container">
                                        <div className="fv-help-block">
                                            <span role="alert">{formik.errors.openinghoursThursdayOpen}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className={'col-4'}>
                                <select
                                    {...formik.getFieldProps("openinghoursThursdayClose")}
                                    className={clsx(
                                        "form-select",
                                        {
                                            "is-invalid":
                                                formik.touched.openinghoursThursdayClose && formik.errors.openinghoursThursdayClose,
                                        },
                                        {
                                            "is-valid":
                                                formik.touched.openinghoursThursdayClose &&
                                                !formik.errors.openinghoursThursdayClose
                                        }
                                    )}
                                >
                                    <option value={-1}> - Select- </option>
                                    <option value={0}>00:00</option>
                                    <option value={1}>01:00</option>
                                    <option value={2}>02:00</option>
                                    <option value={3}>03:00</option>
                                    <option value={4}>04:00</option>
                                    <option value={5}>05:00</option>
                                    <option value={6}>06:00</option>
                                    <option value={7}>07:00</option>
                                    <option value={8}>08:00</option>
                                    <option value={9}>09:00</option>
                                    <option value={10}>10:00</option>
                                    <option value={11}>11:00</option>
                                    <option value={12}>12:00</option>
                                    <option value={13}>13:00</option>
                                    <option value={14}>14:00</option>
                                    <option value={15}>15:00</option>
                                    <option value={16}>16:00</option>
                                    <option value={17}>17:00</option>
                                    <option value={18}>18:00</option>
                                    <option value={19}>19:00</option>
                                    <option value={20}>20:00</option>
                                    <option value={21}>21:00</option>
                                    <option value={22}>22:00</option>
                                    <option value={23}>23:00</option>
                                </select>
                                {formik.touched.openinghoursThursdayClose && formik.errors.openinghoursThursdayClose && (
                                    <div className="fv-plugins-message-container">
                                        <div className="fv-help-block">
                                            <span role="alert">{formik.errors.openinghoursThursdayClose}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        {/* Friday */}
                        <div className={'row mb-2'}>
                            <div className={'col-4 text-end pe-2 fw-bold'}>Friday: </div>
                            <div className={'col-4'}>
                                <select
                                    {...formik.getFieldProps("openinghoursFridayOpen")}
                                    className={clsx(
                                        "form-select",
                                        {
                                            "is-invalid":
                                                formik.touched.openinghoursFridayOpen && formik.errors.openinghoursFridayOpen,
                                        },
                                        {
                                            "is-valid":
                                                formik.touched.openinghoursFridayOpen &&
                                                !formik.errors.openinghoursFridayOpen
                                        }
                                    )}
                                >
                                    <option value={-1}> - Select- </option>
                                    <option value={0}>00:00</option>
                                    <option value={1}>01:00</option>
                                    <option value={2}>02:00</option>
                                    <option value={3}>03:00</option>
                                    <option value={4}>04:00</option>
                                    <option value={5}>05:00</option>
                                    <option value={6}>06:00</option>
                                    <option value={7}>07:00</option>
                                    <option value={8}>08:00</option>
                                    <option value={9}>09:00</option>
                                    <option value={10}>10:00</option>
                                    <option value={11}>11:00</option>
                                    <option value={12}>12:00</option>
                                    <option value={13}>13:00</option>
                                    <option value={14}>14:00</option>
                                    <option value={15}>15:00</option>
                                    <option value={16}>16:00</option>
                                    <option value={17}>17:00</option>
                                    <option value={18}>18:00</option>
                                    <option value={19}>19:00</option>
                                    <option value={20}>20:00</option>
                                    <option value={21}>21:00</option>
                                    <option value={22}>22:00</option>
                                    <option value={23}>23:00</option>
                                </select>
                                {formik.touched.openinghoursFridayOpen && formik.errors.openinghoursFridayOpen && (
                                    <div className="fv-plugins-message-container">
                                        <div className="fv-help-block">
                                            <span role="alert">{formik.errors.openinghoursFridayOpen}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className={'col-4'}>
                                <select
                                    {...formik.getFieldProps("openinghoursFridayClose")}
                                    className={clsx(
                                        "form-select",
                                        {
                                            "is-invalid":
                                                formik.touched.openinghoursFridayClose && formik.errors.openinghoursFridayClose,
                                        },
                                        {
                                            "is-valid":
                                                formik.touched.openinghoursFridayClose &&
                                                !formik.errors.openinghoursFridayClose
                                        }
                                    )}
                                >
                                    <option value={-1}> - Select- </option>
                                    <option value={0}>00:00</option>
                                    <option value={1}>01:00</option>
                                    <option value={2}>02:00</option>
                                    <option value={3}>03:00</option>
                                    <option value={4}>04:00</option>
                                    <option value={5}>05:00</option>
                                    <option value={6}>06:00</option>
                                    <option value={7}>07:00</option>
                                    <option value={8}>08:00</option>
                                    <option value={9}>09:00</option>
                                    <option value={10}>10:00</option>
                                    <option value={11}>11:00</option>
                                    <option value={12}>12:00</option>
                                    <option value={13}>13:00</option>
                                    <option value={14}>14:00</option>
                                    <option value={15}>15:00</option>
                                    <option value={16}>16:00</option>
                                    <option value={17}>17:00</option>
                                    <option value={18}>18:00</option>
                                    <option value={19}>19:00</option>
                                    <option value={20}>20:00</option>
                                    <option value={21}>21:00</option>
                                    <option value={22}>22:00</option>
                                    <option value={23}>23:00</option>
                                </select>
                                {formik.touched.openinghoursFridayClose && formik.errors.openinghoursFridayClose && (
                                    <div className="fv-plugins-message-container">
                                        <div className="fv-help-block">
                                            <span role="alert">{formik.errors.openinghoursFridayClose}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className={'row mt-4 mb-2'}>
                            <div className={'col-4 text-end pe-2 fw-bold'}>Location:
                                <br />
                                <span className={'fw-light fs-6'}>(Please select on the map below)</span>
                            </div>
                            <div className={'col-4'}>
                                <label className='form-label text-dark fs-6 px-1 fw-bold'>Longitude</label>
                                <input
                                    type="number"
                                    autoComplete="off"
                                    {...formik.getFieldProps("longitude")}
                                    className={clsx(
                                        "form-control",
                                        {
                                            "is-invalid":
                                                formik.touched.longitude && formik.errors.longitude,
                                        },
                                        {
                                            "is-valid":
                                                formik.touched.longitude && !formik.errors.longitude,
                                        }
                                    )}
                                />
                                {formik.touched.longitude && formik.errors.longitude && (
                                    <div className="fv-plugins-message-container">
                                        <div className="fv-help-block">
                                            <span role="alert">{formik.errors.longitude}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className={'col-4'}>
                                <label className='form-label text-dark fs-6 px-1 fw-bold'>Latitude</label>
                                <input
                                    type="number"
                                    autoComplete="off"
                                    {...formik.getFieldProps("latitude")}
                                    className={clsx(
                                        "form-control",
                                        {
                                            "is-invalid":
                                                formik.touched.latitude && formik.errors.latitude,
                                        },
                                        {
                                            "is-valid":
                                                formik.touched.latitude && !formik.errors.latitude,
                                        }
                                    )}
                                />
                                {formik.touched.latitude && formik.errors.latitude && (
                                    <div className="fv-plugins-message-container">
                                        <div className="fv-help-block">
                                            <span role="alert">{formik.errors.latitude}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className={'row'}>
                    <div className={'d-flex justify-content-center'}>
                        <MapContainer
                            style={{ height: "500px", width: "80%" }}
                            center={centerLocation || GOTHENBURG_CENTER_LOCATION}
                            zoom={zoomLevel || BUSINESS_LIST_ZOOM_LEVEL}
                            maxZoom={MAX_BUSINESS_ZOOM_LEVEL}
                            zoomControl={false}
                        >
                            <MyComponent />
                            <LayersControl position="bottomleft">
                                <LayersControl.BaseLayer
                                    checked={defaultMapType === GOOGLE_MAP_TYPE}
                                    name="Regular Map"
                                >
                                    <TileLayer url={GOOGLE_MAP_TYPE} />
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
                    </div>
                    {/* Submit buttons */}
                    <div className="text-center p-4">
                        <Button
                            variant="primary"
                            type="submit"
                            id="sign_up_submit"
                            className={"btn btn-primary px-5"}
                            disabled={formik.isSubmitting || !formik.isValid}
                        >
                            {!loading && (
                                <span className="indicator-label">Create clinic</span>
                            )}
                            {loading && (
                                <span
                                    className="indicator-progress"
                                    style={{ display: "block" }}
                                >
                                  Registering...{" "}
                                    <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                                </span>
                            )}
                        </Button>
                        <Link to="/">
                            <button
                                type="button"
                                className="btn btn-outline-secondary ms-4 px-5"
                            >
                                Cancel
                            </button>
                        </Link>
                    </div>
                    {/* end::Form group */}
                </div>
            </form>
        </Container>
    );
};

export default NewDental;
