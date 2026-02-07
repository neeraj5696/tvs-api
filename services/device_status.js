const axios = require('axios');
const https = require('https');

async function deviceStatus() {
    try {
        const httpsAgent = new https.Agent({
            rejectUnauthorized: false
        });

        const result = await axios.get(
            'https://192.168.0.208:448/api/devices/enrollment?type=0',
            {
                httpsAgent: httpsAgent,
                headers: {
                    'bs-session-id': '65a37a185f324ba5b96d2cdb70843437',
                    'Content-Type': 'application/json'
                }
            }
        );

        const allGroup = result.data?.EnrollmentDevice?.all_device_group;

        // Root level devices
        const rootDevices = allGroup?.devices || [];

        // Branch devices
        const groupDevices = (allGroup?.device_groups || [])
            .flatMap(group => group.devices || []);

        // Merge both
        const allDevices = [...rootDevices, ...groupDevices];

        // Extract status info
        const deviceStatusList = allDevices.map(device => ({
            device_id: device.id,
            device_name: device.name,
            status: device.status === "1" ? "Online" : "Offline"
        }));

        console.log(deviceStatusList);

    } catch (error) {
        console.error("Error:", error.response?.data || error.message);
    }
}

// Call function when file runs
deviceStatus();
