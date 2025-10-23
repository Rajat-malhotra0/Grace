import React, { useEffect, useState } from "react";
import axios from "axios";
import { withApiBase } from "config";
import "./Register.css";

function NgoMemberFormFields({ formData, handleChange, errors = {} }) {
    const [ngos, setNgos] = useState([]);
    const [search, setSearch] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);

    // Fetch NGOs once
    useEffect(() => {
        axios
            .get(withApiBase("/api/ngos"))
            .then((res) => setNgos(res.data.result || []))
            .catch(console.error);
    }, []);

    const filteredNgos = ngos.filter((n) =>
        n.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleSelect = (ngo) => {
        handleChange({ target: { name: "ngoId", value: ngo._id } });
        setSearch(ngo.name);
        setShowDropdown(false);
    };

    return (
        <>
            <label>Select NGO</label>
            <div className="ngo-search-wrapper">
                <input
                    type="text"
                    placeholder="Search and select your NGO..."
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setShowDropdown(true);
                    }}
                    onFocus={() => setShowDropdown(true)}
                    onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                />

                {/* Dropdown panel */}
                {showDropdown && (
                    <div className="ngo-dropdown">
                        {filteredNgos.length > 0 ? (
                            filteredNgos.map((ngo) => (
                                <div
                                    key={ngo._id}
                                    className="ngo-option"
                                    onMouseDown={() => handleSelect(ngo)} // use onMouseDown to fire before onBlur
                                >
                                    {ngo.name}
                                </div>
                            ))
                        ) : (
                            <div className="ngo-option disabled">
                                No NGOs found
                            </div>
                        )}
                    </div>
                )}
            </div>
            <div style={{ color: "red" }}> {errors.ngoId}</div>

            {/* Hidden field to store the selected NGO id */}
            <input type="hidden" name="ngoId" value={formData.ngoId || ""} />
        </>
    );
}

export default NgoMemberFormFields;
