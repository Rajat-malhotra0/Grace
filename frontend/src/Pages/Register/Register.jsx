import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import "./Register.css";
import axios from "axios";
import { AuthContext } from "../../Context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/ReactToastify.css";
import NgoFormFields from "./NgoFormFields";
import VolunteerFormFields from "./VolunteerFormFields";
import NgoMemberFormFields from "./NgoMemberFormFields";
import DonorFormFields from "./DonorFormFields";

function Register() {
    const [formData, setFormData] = useState({
        remindMe: false,
        termsAccepted: false,
        newsLetter: false,
    });
    const [categories, setCategories] = useState([]);
    const { register } = useContext(AuthContext);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        async function fetchCategories() {
            try {
                const response = await axios.get(
                    "http://localhost:3001/api/categories?type=ngo"
                );
                if (response.status === 200) {
                    setCategories(response.data.result);
                }
            } catch (err) {}
        }
        fetchCategories();
    }, []);

    const validate = () => {
        const newErrors = {};

        const {
            email = "",
            password = "",
            confirmedPassword = "",
            name = "",
            role = "",
            address = "",
            city = "",
            state = "",
            pincode = "",
            dob = "",
            termsAccepted = false,
            organizationName = "",
            registrationNumber = "",
            phoneNumber = "",
            description = "",
            focusAreas = [],
            volunteerType = "",
            organizationAddress = "",
            organizationCity = "",
            organizationState = "",
            organizationDepartment = "",
            organizationPersonRole = "",
        } = formData;

        if (!email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = "Email is invalid";
        }

        if (!name.trim()) {
            newErrors.name = "Name is required";
        } else if (!/^[a-zA-Z\s]+$/.test(name)) {
            newErrors.name = "Name must contain only alphabets";
        }

        if (!password.trim()) {
            newErrors.password = "Password is required";
        } else if (password.length < 6) {
            newErrors.password = "Password must be at least 6 characters long";
        }

        if (!confirmedPassword.trim()) {
            newErrors.confirmedPassword = "Please confirm password";
        } else if (password !== confirmedPassword) {
            newErrors.confirmedPassword = "Passwords do not match";
        }

        if (!role) {
            newErrors.role = "Please select user type";
        }

        if (!address.trim()) newErrors.address = "Address is required";
        if (!city.trim()) newErrors.city = "City is required";
        if (!state.trim()) newErrors.state = "State is required";
        if (!pincode.trim()) {
            newErrors.pincode = "Pincode is required";
        } else if (pincode.length < 6) {
            newErrors.pincode = "Enter a valid pincode";
        }
        if (!dob) newErrors.dob = "Date of birth required";

        if (!termsAccepted) {
            newErrors.termsAccepted = "You must accept Terms and Conditions";
        }

        if (role === "ngo") {
            if (!organizationName.trim())
                newErrors.organizationName = "Organization name required";
            if (!registrationNumber.trim())
                newErrors.registrationNumber = "Registration number required";
            if (!phoneNumber.trim()) {
                newErrors.phoneNumber = "Phone number required";
            } else if (!/^\d{10}$/.test(phoneNumber)) {
                newErrors.phoneNumber = "Phone must be 10 digits";
            }
            if (!description.trim())
                newErrors.description = "Description required";
            if (!Array.isArray(focusAreas) || focusAreas.length === 0) {
                newErrors.focusAreas = "Select at least one focus area";
            }
        }

        if (role === "volunteer") {
            if (!volunteerType)
                newErrors.volunteerType = "Select a volunteer type";

            if (volunteerType === "school" || volunteerType === "corporate") {
                if (!organizationName.trim())
                    newErrors.organizationName = "Name required";
                if (!organizationAddress.trim())
                    newErrors.organizationAddress = "Address required";
                if (!organizationCity.trim())
                    newErrors.organizationCity = "City required";
                if (!organizationState.trim())
                    newErrors.organizationState = "State required";
            }

            if (volunteerType === "corporate") {
                if (!organizationDepartment.trim())
                    newErrors.organizationDepartment = "Department required";
                if (!organizationPersonRole.trim())
                    newErrors.organizationPersonRole = "Designation required";
            }
        }

        if (role === "ngoMember") {
            if (!formData.ngoId || !formData.ngoId.trim()) {
                newErrors.ngoId = "Please select an NGO";
            }
        }

        return newErrors;
    };

    const NgoRegistrationToast = () => (
        <div>
            <p
                style={{
                    margin: 0,
                    lineHeight: "1.6",
                    color: "#2c2c2c",
                    fontFamily: '"Crimson Text", serif',
                    fontSize: "1rem",
                    fontWeight: "400",
                    letterSpacing: "0.3px",
                }}
            >
                Thank you for registering with{" "}
                <strong style={{ fontWeight: "600", color: "#1a1a1a" }}>
                    Grace
                </strong>
                ! We're thrilled to welcome you to this growing network of
                changemakers.
                <br />
                <br />A member of our team will be in touch shortly to verify
                your information and help set up your public profile. In the
                meantime, feel free to explore the platform and start organizing
                your day-to-day tasks with ease.
            </p>
            <div
                style={{
                    marginTop: "18px",
                    borderTop: "1px solid #e1e1e1",
                    paddingTop: "12px",
                }}
            >
                <p
                    style={{
                        margin: 0,
                        fontSize: "0.9rem",
                        color: "#555555",
                        fontFamily: '"Crimson Text", serif',
                        lineHeight: "1.5",
                        letterSpacing: "0.2px",
                    }}
                >
                    Want to share your work with us right away?
                    <br />
                    Email us at:{" "}
                    <a
                        href="mailto:teamgrace@gmail.com"
                        style={{
                            color: "#2c5530",
                            textDecoration: "none",
                            fontWeight: "600",
                            fontFamily: '"Crimson Text", serif',
                            borderBottom: "1px solid #2c5530",
                            transition: "all 0.2s ease",
                        }}
                    >
                        teamgrace@gmail.com
                    </a>
                </p>
            </div>
        </div>
    );

    const VolunteerRegistrationToast = () => (
        <div>
            <p
                style={{
                    margin: 0,
                    lineHeight: "1.6",
                    color: "#2c2c2c",
                    fontFamily: '"Crimson Text", serif',
                    fontSize: "1rem",
                    fontWeight: "400",
                    letterSpacing: "0.3px",
                }}
            >
                Welcome to{" "}
                <strong style={{ fontWeight: "600", color: "#1a1a1a" }}>
                    Grace
                </strong>
                !
                <br />
                <br />
                Your registration is received. We'll contact you soon to help
                set up your profile.
            </p>
            <div
                style={{
                    marginTop: "18px",
                    borderTop: "1px solid #e1e1e1",
                    paddingTop: "12px",
                }}
            >
                <p
                    style={{
                        margin: 0,
                        fontSize: "0.9rem",
                        color: "#555555",
                        fontFamily: '"Crimson Text", serif',
                        lineHeight: "1.5",
                        letterSpacing: "0.2px",
                    }}
                >
                    Questions? Email:{" "}
                    <a
                        href="mailto:teamgrace@gmail.com"
                        style={{
                            color: "#2c5530",
                            textDecoration: "none",
                            fontWeight: "600",
                            fontFamily: '"Crimson Text", serif',
                            borderBottom: "1px solid #2c5530",
                            transition: "all 0.2s ease",
                        }}
                    >
                        teamgrace@gmail.com
                    </a>
                </p>
            </div>
        </div>
    );

    // Add a new toast component for NGO members
    const NgoMemberRegistrationToast = () => (
        <div>
            <p
                style={{
                    margin: 0,
                    lineHeight: "1.6",
                    color: "#2c2c2c",
                    fontFamily: '"Crimson Text", serif',
                    fontSize: "1rem",
                    fontWeight: "400",
                    letterSpacing: "0.3px",
                }}
            >
                Welcome to{" "}
                <strong style={{ fontWeight: "600", color: "#1a1a1a" }}>
                    Grace
                </strong>
                !
                <br />
                <br />
                Your registration as an NGO member is complete. You're now
                connected to your organization and can start collaborating on
                meaningful projects.
            </p>
            <div
                style={{
                    marginTop: "18px",
                    borderTop: "1px solid #e1e1e1",
                    paddingTop: "12px",
                }}
            >
                <p
                    style={{
                        margin: 0,
                        fontSize: "0.9rem",
                        color: "#555555",
                        fontFamily: '"Crimson Text", serif',
                        lineHeight: "1.5",
                        letterSpacing: "0.2px",
                    }}
                >
                    Questions? Email:{" "}
                    <a
                        href="mailto:teamgrace@gmail.com"
                        style={{
                            color: "#2c5530",
                            textDecoration: "none",
                            fontWeight: "600",
                            fontFamily: '"Crimson Text", serif',
                            borderBottom: "1px solid #2c5530",
                            transition: "all 0.2s ease",
                        }}
                    >
                        teamgrace@gmail.com
                    </a>
                </p>
            </div>
        </div>
    );

    const handleChange = (e) => {
        if (e.target.name === "focusAreas") {
            const selectedValue = e.target.value;
            if (selectedValue && selectedValue !== "") {
                setFormData((prevData) => {
                    const currentAreas = prevData.focusAreas || [];
                    if (!currentAreas.includes(selectedValue)) {
                        return {
                            ...prevData,
                            focusAreas: [...currentAreas, selectedValue],
                        };
                    }
                    return prevData;
                });
            }
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [e.target.name]:
                    e.target.type === "checkbox"
                        ? e.target.checked
                        : e.target.value,
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const foundErrors = validate();
        setErrors(foundErrors);

        console.log("Form validation errors:", foundErrors);
        console.log("Form data:", formData);

        if (Object.keys(foundErrors).length > 0) {
            console.log("Form has validation errors, not submitting");
            return;
        }

        let basePayload = {
            userName: formData.name,
            email: formData.email,
            password: formData.password,
            dob: formData.dob,
            remindMe: formData.remindMe,
            termsAccepted: formData.termsAccepted ? "true" : "false",
            newsLetter: formData.newsLetter,
            role: formData.role,
            location: {
                address: formData.address,
                city: formData.city,
                state: formData.state,
                pincode: formData.pincode,
            },
        };

        let isNgo = formData.role === "ngo";
        let payload;
        if (isNgo) {
            payload = {
                ...basePayload,
                organizationName: formData.organizationName,
                registrationNumber: formData.registrationNumber,
                description: formData.description,
                category: formData.focusAreas,
                phoneNumber: formData.phoneNumber,
                website: formData.website,
            };
        } else if (formData.role === "volunteer") {
            payload = {
                ...basePayload,
                volunteerType: formData.volunteerType,
                organization: {
                    name: formData.organizationName,
                    address: formData.organizationAddress,
                    city: formData.organizationCity,
                    state: formData.organizationState,
                    department: formData.organizationDepartment,
                    role: formData.organizationPersonRole,
                },
                about: formData.about,
            };
        } else if (formData.role === "ngoMember") {
            payload = {
                ...basePayload,
                ngoId: formData.ngoId,
            };
        } else {
            payload = basePayload;
        }

        console.log("Submitting registration with payload:", payload);
        const result = await register(payload, isNgo);
        console.log("Registration result:", result);

        if (result && result.success) {
            console.log("Registration successful!");
            // Use toast.success with JSX components
            if (isNgo) {
                toast.success(<NgoRegistrationToast />, {
                    position: "top-right",
                    autoClose: 8000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    toastId: "ngo-registration",
                });
            } else if (formData.role === "ngoMember") {
                toast.success(<NgoMemberRegistrationToast />, {
                    position: "top-right",
                    autoClose: 8000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    toastId: "ngo-member-registration",
                });
            } else {
                toast.success(<VolunteerRegistrationToast />, {
                    position: "top-right",
                    autoClose: 8000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    toastId: "volunteer-registration",
                });
            }
        } else {
            console.log("Registration failed:", result);
            const errorMessage =
                result?.message || "Registration failed. Please try again.";
            console.log("Showing error message:", errorMessage);
            toast.error(errorMessage, {
                toastId: "registration-error",
            });
        }
    };

    return (
        <div className="register-page-container">
            <p>
                Hi there! we are so happy, you found us.
                <br />
                You're just a few steps away from joining our community of
                changemakers.
            </p>
            <span>Create an account</span>
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        onChange={handleChange}
                        value={formData.email || ""}
                        required
                    />
                    <div style={{ color: "red" }}> {errors.email}</div>
                </div>

                <div className="input-group">
                    <label>Name</label>
                    <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        onChange={handleChange}
                        value={formData.name || ""}
                        required
                    />
                    <div style={{ color: "red" }}> {errors.name}</div>
                </div>

                <div className="input-group">
                    <label>Password</label>
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        onChange={handleChange}
                        value={formData.password || ""}
                        required
                    />
                    <div style={{ color: "red" }}> {errors.password}</div>
                </div>

                <div className="input-group">
                    <label>Confirm Password</label>
                    <input
                        type="password"
                        name="confirmedPassword"
                        placeholder="Confirm Password"
                        onChange={handleChange}
                        value={formData.confirmedPassword || ""}
                        required
                    />
                    <div style={{ color: "red" }}>
                        {" "}
                        {errors.confirmedPassword}
                    </div>
                </div>

                <div className="input-group user-type-selection">
                    <p>I am a:</p>
                    <label>
                        <input
                            type="radio"
                            name="role"
                            value="ngo"
                            onChange={handleChange}
                            checked={formData.role === "ngo"}
                        />
                        NGO
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="role"
                            value="ngoMember"
                            onChange={handleChange}
                            checked={formData.role === "ngoMember"}
                        />
                        Ngo Member
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="role"
                            value="donor"
                            onChange={handleChange}
                            checked={formData.role === "donor"}
                        />
                        Donor
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="role"
                            value="volunteer"
                            onChange={handleChange}
                            checked={formData.role === "volunteer"}
                        />
                        Volunteer
                    </label>
                    <div style={{ color: "red" }}> {errors.role}</div>
                </div>

                <div className="input-group">
                    <label>Address</label>
                    <textarea
                        name="address"
                        placeholder="Address"
                        onChange={handleChange}
                        value={formData.address || ""}
                        required
                    />
                    <div style={{ color: "red" }}> {errors.address}</div>
                </div>

                <div className="input-group">
                    <label>City</label>
                    <input
                        type="text"
                        name="city"
                        placeholder="City"
                        onChange={handleChange}
                        value={formData.city || ""}
                        required
                    />
                    <div style={{ color: "red" }}> {errors.city}</div>
                </div>

                <div className="input-group">
                    <label>State</label>
                    <input
                        type="text"
                        name="state"
                        placeholder="State"
                        onChange={handleChange}
                        value={formData.state || ""}
                        required
                    />
                    <div style={{ color: "red" }}> {errors.state}</div>
                </div>

                <div className="input-group">
                    <label>Pincode</label>
                    <input
                        type="text"
                        name="pincode"
                        placeholder="Pincode"
                        onChange={handleChange}
                        value={formData.pincode || ""}
                        required
                    />
                    <div style={{ color: "red" }}> {errors.pincode}</div>
                </div>

                {formData.role === "ngo" ? (
                    <NgoFormFields
                        formData={formData}
                        handleChange={handleChange}
                        categories={categories}
                        setFormData={setFormData}
                        errors={errors}
                    />
                ) : formData.role === "volunteer" ? (
                    <VolunteerFormFields
                        formData={formData}
                        handleChange={handleChange}
                        errors={errors}
                    />
                ) : formData.role === "ngoMember" ? (
                    <NgoMemberFormFields
                        formData={formData}
                        handleChange={handleChange}
                        errors={errors}
                    />
                ) : formData.role === "donor" ? (
                    <DonorFormFields
                        formData={formData}
                        handleChange={handleChange}
                        errors={errors}
                    />
                ) : null}

                <div className="input-group">
                    <label>
                        Date of birth:
                        <input
                            type="date"
                            name="dob"
                            onChange={handleChange}
                            value={formData.dob || ""}
                            required
                        />
                    </label>
                    <div style={{ color: "red" }}> {errors.dob}</div>
                </div>

                <div className="input-group">
                    <label>
                        <input
                            type="checkbox"
                            name="remindMe"
                            onChange={handleChange}
                            checked={formData.remindMe || false}
                        />
                        Give me reminders
                    </label>
                </div>

                <div className="input-group">
                    <label>
                        <input
                            type="checkbox"
                            name="termsAccepted"
                            onChange={handleChange}
                            checked={formData.termsAccepted || false}
                            required
                        />
                        I accept the Terms and Conditions
                    </label>
                    <div style={{ color: "red" }}> {errors.termsAccepted}</div>
                </div>

                <div className="input-group">
                    <label>
                        <input
                            type="checkbox"
                            name="newsLetter"
                            onChange={handleChange}
                            checked={formData.newsLetter || false}
                        />
                        Subscribe to newsletter
                    </label>
                    <div style={{ color: "red" }}> {errors.newsLetter}</div>
                </div>

                <button type="submit">Register</button>
            </form>
            <span>
                Already have an account? <Link to="/login">Login</Link>
            </span>
            <ToastContainer position="top-right" />
        </div>
    );
}

export default Register;
