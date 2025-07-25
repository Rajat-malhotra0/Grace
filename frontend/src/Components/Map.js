import React, { useEffect, useRef } from "react";
import * as atlas from "azure-maps-control";
import "azure-maps-control/dist/atlas.min.css";

/*
Data jo props mai pass karna hai:
subscriptionKey -> Azure-api key ==> Mail rajat-malhotra0 for the api key and DON'T push it on anuwhere.
ngo -> Ngo data as an array

I'll be attaching how to use this component at the end of the file.
*/
function AzureMaps(props) {
    const mapRef = useRef(null);

    function getLocation() {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        lon: position.coords.longitude,
                        lat: position.coords.latitude,
                    });
                },
                (error) => {
                    reject(error);
                }
            );
        });
    }

    useEffect(() => {
        let map;
        const loadMap = async () => {
            let userLocation = [0, 0];

            try {
                const userLoc = await getLocation();
                userLocation = [userLoc.lon, userLoc.lat];
            } catch (error) {}
            map = new atlas.Map(mapRef.current, {
                authOptions: {
                    authType: atlas.AuthenticationType.subscriptionKey,
                    subscriptionKey: props.subscriptionKey,
                },
                center: userLocation,
                zoom: 15,
                view: "Auto",
            });

            map.events.add("ready", () => {
                const userMarker = new atlas.HtmlMarker({
                    color: "blue",
                    text: ".",
                    position: userLocation,
                });

                map.markers.add(userMarker);

                props.ngos.forEach((ngo) => {
                    const marker = new atlas.HtmlMarker({
                        color: "red",
                        text: "N",
                        position: [ngo.longitude, ngo.latitude],
                    });

                    const popup = new atlas.Popup({
                        pixelOffset: [0, -30],
                    });

                    map.events.add("click", marker, () => {
                        popup.setOptions({
                            position: [ngo.longitude, ngo.latitude],
                            content: `
                            <div style="padding: 10px;">
                                ${ngo.name}
                                <br>
                                ${ngo.full_address}
                            </div>
                        `,
                        });
                        popup.open(map);
                    });

                    map.markers.add(marker);
                    map.popups.add(popup);
                });
            });
        };

        if (!mapRef.current) {
            return;
        }

        loadMap();

        return () => {
            if (map) {
                map.dispose();
            }
        };
    }, [props.ngos, props.subscriptionKey]);
    return <div ref={mapRef} style={{ width: "100%", height: "100%" }}></div>;
}

export default AzureMaps;

/*
How to use the file an example:

import AzureMaps from "./Components/AzureMaps";
import "./App.css";

function App() {
    let data = require("./ngo_data.json"); ==> Ill put this data in the frontend folder, src/data/ngo_data.json, we will outsorce it to backend api's later
    return (
        <div className="app-container">
            <div className="left-panel">
                {data.map((ngo) => (
                    <div className="ngo-card" key={ngo.name}>
                        <h2>{ngo.name}</h2>
                        <p>{ngo.full_address}</p>
                    </div>
                ))}
            </div>

            <div className="right-panel">
                <AzureMaps
                    subscriptionKey={
                        "PASTE THE KEY HERE"
                    }
                    ngos={data}
                />
            </div>
        </div>
    );
}

export default App;


*/
