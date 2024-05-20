const graphData = {};
const chartsCreated = {};

document.addEventListener('DOMContentLoaded', (event) => {
    const outputDiv = document.getElementById('output');

    async function fetchData() {
        try {
            const response = await fetch('../test/test.json');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            displayData(data);
        } catch (error) {
            outputDiv.textContent = `Error: ${error}`;
        }
    }

    function displayData(data) {

        data.forEach(item => {
            let meterDiv = document.getElementById(`meter-${item.eid}`);
            if (!meterDiv) {
                meterDiv = document.createElement('div');
                meterDiv.id = `meter-${item.eid}`;
                meterDiv.classList.add('meter');
                outputDiv.appendChild(meterDiv);

                const meterLayout = `
                <h2>Meter ID: ${item.eid}</h2>
                <div class="meter-info" id="meterinfo-${item.eid}">
                </div>
                <div class="meter-graph">
                    <canvas id="chart-${item.eid}" width="800"></canvas>
                </div>
                <div class="channels">
                </div>
            `;
                meterDiv.innerHTML = meterLayout;
            }

            if (!(item.eid.toString() in graphData)) {
                graphData[item.eid.toString()] = [];
            }
            graphData[item.eid].push({x: item.timestamp, y: item.actEnergyDlvd});

            const meterInfo = `
            <p><strong>Timestamp:</strong> ${new Date(item.timestamp * 1000).toLocaleString()}</p>
            <p><strong>Active Energy Delivered:</strong> ${item.actEnergyDlvd} kWh</p>
            <p><strong>Active Energy Received:</strong> ${item.actEnergyRcvd} kWh</p>
            <p><strong>Apparent Energy:</strong> ${item.apparentEnergy} kVAh</p>
            <p><strong>Reactive Energy Lagging:</strong> ${item.reactEnergyLagg} kVARh</p>
            <p><strong>Reactive Energy Leading:</strong> ${item.reactEnergyLead} kVARh</p>
            <p><strong>Instantaneous Demand:</strong> ${item.instantaneousDemand} kW</p>
            <p><strong>Active Power:</strong> ${item.activePower} kW</p>
            <p><strong>Apparent Power:</strong> ${item.apparentPower} kVA</p>
            <p><strong>Reactive Power:</strong> ${item.reactivePower} kVAR</p>
            <p><strong>Power Factor:</strong> ${item.pwrFactor}</p>
            <p><strong>Voltage:</strong> ${item.voltage} V</p>
            <p><strong>Current:</strong> ${item.current} A</p>
            <p><strong>Frequency:</strong> ${item.freq} Hz</p>
            `;

            let meterInfoDiv = document.getElementById(`meterinfo-${item.eid}`);
            meterInfoDiv.innerHTML = meterInfo;


            if (item.channels && item.channels.length > 0) {
                item.channels.forEach(channel => {
                    if (!(channel.eid.toString() in graphData)) {
                        graphData[channel.eid.toString()] = [];
                    }
                    graphData[channel.eid].push({x: item.timestamp, y: channel.actEnergyDlvd});


                    let channelDiv = document.getElementById(`channel-${channel.eid}`);

                    if (!channelDiv) {
                        const channelLayout = `
                        <div class="channel" id="channel-${channel.eid}">
                        <h3>Channel ID: ${channel.eid}</h3>
                        <div class="channel-info" id="channelinfo-${channel.eid}">
                        </div>
                        <div class="channel-graph">
                            <canvas id="chart-${channel.eid}" width="800"></canvas>
                        </div>
                        </div>
                    `;

                        let channelsDiv = meterDiv.querySelector('.channels');
                        channelsDiv.innerHTML += channelLayout;
                    }

                    const channelInfoDiv = document.getElementById(`channelinfo-${channel.eid}`);

                    const channelInfo = `
                    <p><strong>Timestamp:</strong> ${new Date(channel.timestamp * 1000).toLocaleString()}</p>
                    <p><strong>Active Energy Delivered:</strong> ${channel.actEnergyDlvd} kWh</p>
                    <p><strong>Active Energy Received:</strong> ${channel.actEnergyRcvd} kWh</p>
                    <p><strong>Apparent Energy:</strong> ${channel.apparentEnergy} kVAh</p>
                    <p><strong>Reactive Energy Lagging:</strong> ${channel.reactEnergyLagg} kVARh</p>
                    <p><strong>Reactive Energy Leading:</strong> ${channel.reactEnergyLead} kVARh</p>
                    <p><strong>Instantaneous Demand:</strong> ${channel.instantaneousDemand} kW</p>
                    <p><strong>Active Power:</strong> ${channel.activePower} kW</p>
                    <p><strong>Apparent Power:</strong> ${channel.apparentPower} kVA</p>
                    <p><strong>Reactive Power:</strong> ${channel.reactivePower} kVAR</p>
                    <p><strong>Power Factor:</strong> ${channel.pwrFactor}</p>
                    <p><strong>Voltage:</strong> ${channel.voltage} V</p>
                    <p><strong>Current:</strong> ${channel.current} A</p>
                    <p><strong>Frequency:</strong> ${channel.freq} Hz</p>
                    `;

                    channelInfoDiv.innerHTML = channelInfo;
                });
            }
        });

        //Create the charts
        for (const [key, value] of Object.entries(graphData)) {
            if (!(key in chartsCreated)) {
                console.log('Creating chart for:', key, 'with data:', JSON.stringify(value));
                const targetElement = document.getElementById(`chart-${key}`);
                chart = createChart(value, targetElement);
                chartsCreated[key] = chart;
            } else {
                chartsCreated[key].data.datasets[0].data = value;
                chartsCreated[key].update();
            }
        }

        console.log(graphData);
    }

    function createChart(meterData, targetElement) {
        try {
            return new Chart(targetElement, {
                type: 'line',
                data: {
                    datasets: [{
                        label: 'Meter Data',
                        data: meterData,
                        borderColor: 'rgb(75, 192, 192)',
                        tension: 0.1
                    }]
                },
                options: {
                    scales: {
                        x: {
                            type: 'time',
                            time: {
                                parser: 'YYYY-MM-DDTHH:mm:ss',
                                tooltipFormat: 'll HH:mm',
                            },
                            title: {
                                display: true,
                                text: 'Date'
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Value'
                            }
                        }
                    }
                }
            });
        } catch (error) {
            console.error('Error creating chart:', error);
        }
    }

    fetchData();  // Fetch data immediately on load
    setInterval(fetchData, 1000);  // Fetch data every second
});
