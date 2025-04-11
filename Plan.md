<Plan>
1.  **Modify `index.html`:**
    *   Adjust the tab switching logic within the `setTimeout` callback. Instead of using `document.getElementById` globally for the canvas, first get the newly activated tab content element (`activeContent`). Then, use `activeContent.querySelector('canvas')` to find the canvas *within* that specific tab. This ensures the correct canvas is targeted.
    *   Pass the found canvas element directly to the respective initialization functions (`initializeRawChart`, `initializePercentageChart`, `initializeTrendChart`).
    *   Modify the initialization functions to accept the canvas element as an argument instead of finding it themselves.
    *   Update the initial chart load logic to also use this method (find the active tab content, then the canvas within it).
    *   In the `DistributionAnalysisComponent` (within the `<script type="text/babel">` block), correct the `YAxis` `domain` prop for the Low and Peak charts to use the specific `yAxisRangeLow` and `yAxisRangePeak` variables calculated in the `useMemo` hook.
</Plan>

<file path="/Users/alikara/Desktop/508 website/index.html" action="modify">
  <change>
    <description>Modify tab switching logic to find canvas within the active tab content</description>
    <search>
===
                // Initialize/Mount based on the NOW ACTIVE tab
                // Get the specific canvas element for the newly activated tab
                if (tabId === 'raw') {
                    const canvasElement = document.getElementById('rawChart');
                    if (canvasElement) {
                        initializeRawChart();
                    } else {
                        console.warn("Canvas element 'rawChart' not found after tab activation.");
                    }
                } else if (tabId === 'percentage') {
                    const canvasElement = document.getElementById('percentageChart');
                    if (canvasElement) {
                        initializePercentageChart();
                    } else {
                        console.warn("Canvas element 'percentageChart' not found after tab activation.");
                    }
                } else if (tabId === 'trends') {
                    const canvasElement = document.getElementById('trendChart');
                    if (canvasElement) {
                        initializeTrendChart();
                    } else {
                        console.warn("Canvas element 'trendChart' not found after tab activation.");
                    }
                } else if (tabId === 'distribution') {
                    // Mount React component only if not already mounted
                    if (!reactComponentMounted) {
                        if (typeof window.DistributionAnalysisComponent !== 'undefined') {
                            // Check if boxPlotData seems valid before rendering
                            if (window.boxPlotData && Object.keys(window.boxPlotData).length > 0) {
                                console.log("Rendering DistributionAnalysisComponent with data prop:", window.boxPlotData);
                                // Pass the data as a prop
                                ReactDOM.render(React.createElement(window.DistributionAnalysisComponent, { initialData: window.boxPlotData }), distributionReactRoot);
                                reactComponentMounted = true;
                            } else {
                                console.warn("Attempted to render DistributionAnalysisComponent, but window.boxPlotData is not ready or empty.");
                                distributionReactRoot.innerHTML = '<p class="text-red-500">Distribution data is not available. Please check the data source and console logs.</p>';
                            }
                        } else {
                            console.error('DistributionAnalysisComponent not found. Babel might not have finished, or there was a script error.');
                            distributionReactRoot.innerHTML = '<p class="text-red-500">Error loading Distribution Analysis component. Check console logs.</p>';
                        }
                    } else {
                         console.log("DistributionAnalysisComponent already mounted.");
                    }
                }
            }, 50); // Small delay ensures DOM is updated and visible
          });
        });
        
        // Initialize the default active tab's chart (Raw Outflow) IF data is loaded
        // Ensure the raw tab is actually active before initializing
        if (document.getElementById('tab-raw').classList.contains('active')) {
             // Add a slightly longer delay for initial load
             setTimeout(() => {
                console.log("Attempting initial Raw Chart initialization after delay.");
                const canvasElement = document.getElementById('rawChart');
                if (canvasElement) {
                    initializeRawChart(); // This function now checks for data availability
                } else {
                    console.warn("Canvas element 'rawChart' not found during initial load.");
                }
             }, 150); // Delay to ensure canvas is rendered
        } else {
            console.log("Initial load: Raw tab is not the default active tab.");
        }
        
      }).catch(error => {
        console.error("Error during initial data load sequence:", error);
      });
      
    }); // End DOMContentLoaded

    // --- Chart.js Initialization Functions ---
    
    function initializeRawChart() {
        console.log("Attempting to initialize Raw Chart...");
        const canvasElement = document.getElementById('rawChart');
        if (!canvasElement) {
             console.warn("initializeRawChart: Canvas element 'rawChart' not found.");
             if (rawChartInstance) { rawChartInstance.destroy(); rawChartInstance = null; } // Clean up if instance exists but canvas doesn't
             return;
        }
        
        // Check if an instance already exists for this canvas
        if (rawChartInstance && rawChartInstance.canvas === canvasElement) {
            console.log("Raw Chart instance already exists for this canvas.");
            return; // Don't re-initialize if already present
        }
        // Destroy any old instance before creating a new one
        if (rawChartInstance) { rawChartInstance.destroy(); rawChartInstance = null; }

        const rawCtx = canvasElement.getContext('2d');
        if (!rawCtx) {
            console.warn("initializeRawChart: Failed to get 2D context from canvas.");
            return; 
        }
        // Check if data is loaded and valid
        if (!window.rawOutflowData || window.rawOutflowData.length === 0) {
            console.warn("Raw outflow summary data is not available or empty. Cannot initialize chart.");
            rawCtx.clearRect(0, 0, rawCtx.canvas.width, rawCtx.canvas.height);
            rawCtx.textAlign = 'center';
            rawCtx.fillText('Summary data not available', rawCtx.canvas.width / 2, rawCtx.canvas.height / 2);
            return;
        }
        
        console.log("Initializing Raw Chart with summary data:", window.rawOutflowData);
        
        try {
            rawChartInstance = new Chart(rawCtx, {
                type: 'bar',
                data: {
                labels: window.rawOutflowData.map(d => d.category),
                datasets: [
                    { label: 'Current Conditions', data: window.rawOutflowData.map(d => d.Current), backgroundColor: '#0056b3', borderRadius: 4 },
                    { label: '2050 Baseline (ViT)', data: window.rawOutflowData.map(d => d.Baseline), backgroundColor: '#fd7e14', borderRadius: 4 },
                    { label: 'Replanting Efforts', data: window.rawOutflowData.map(d => d.Replant), backgroundColor: '#17a2b8', borderRadius: 4 },
                    { label: 'Urban Development', data: window.rawOutflowData.map(d => d.Urban), backgroundColor: '#dc3545', borderRadius: 4 }
                ]
                },
                options: { 
                    responsive: true, 
                    maintainAspectRatio: false, 
                    scales: { 
                        y: { 
                            beginAtZero: true, 
                            title: { display: true, text: 'Average Max Outflow (cms)' } 
                        },
                        x: {
                            ticks: {
                                autoSkip: false, // Prevent labels from being skipped
                                maxRotation: 45, // Rotate labels if needed
                                minRotation: 30
                            }
                        }
                    }, 
                    plugins: { 
                        tooltip: { 
                            callbacks: { 
                                label: function(context) { return `${context.dataset.label}: ${context.raw.toFixed(3)} cms`; } 
                            } 
                        } 
                    } 
                }
            });
            console.log("Raw Chart initialized successfully.");
        } catch (error) {
            console.error("Error initializing Raw Chart:", error);
        }
    }

    function initializePercentageChart() {
        console.log("Attempting to initialize Percentage Chart...");
        const canvasElement = document.getElementById('percentageChart');
         if (!canvasElement) {
            console.warn("initializePercentageChart: Canvas element 'percentageChart' not found.");
             if (percentageChartInstance) { percentageChartInstance.destroy(); percentageChartInstance = null; }
            return; 
        }
        if (percentageChartInstance && percentageChartInstance.canvas === canvasElement) {
            console.log("Percentage Chart instance already exists.");
            return;
        }
        if (percentageChartInstance) { percentageChartInstance.destroy(); percentageChartInstance = null; }

        const percentageCtx = canvasElement.getContext('2d');
        if (!percentageCtx) {
            console.warn("initializePercentageChart: Failed to get 2D context.");
            return;
        }
       if (!window.percentageChangeData || window.percentageChangeData.length === 0) {
            console.warn("Percentage change summary data is not available or empty. Cannot initialize chart.");
            percentageCtx.clearRect(0, 0, percentageCtx.canvas.width, percentageCtx.canvas.height);
            percentageCtx.textAlign = 'center';
            percentageCtx.fillText('Summary data not available', percentageCtx.canvas.width / 2, percentageCtx.canvas.height / 2);
            return;
        }

        console.log("Initializing Percentage Chart with summary data:", window.percentageChangeData);

        try {
            // Determine min/max for y-axis dynamically, with some padding
            const allValues = window.percentageChangeData.flatMap(d => [d.Urban, d.Replant]);
            const dataMin = Math.min(...allValues);
            const dataMax = Math.max(...allValues);
            const yMin = Math.floor(dataMin - Math.abs(dataMin * 0.1)); // Add 10% padding below min
            const yMax = Math.ceil(dataMax + Math.abs(dataMax * 0.1)); // Add 10% padding above max

            percentageChartInstance = new Chart(percentageCtx, {
                type: 'bar',
                data: {
                labels: window.percentageChangeData.map(d => d.category),
                datasets: [
                    { label: 'Urban vs 2050', data: window.percentageChangeData.map(d => d.Urban), backgroundColor: '#dc3545', borderRadius: 4 },
                    { label: 'Replant vs 2050', data: window.percentageChangeData.map(d => d.Replant), backgroundColor: '#17a2b8', borderRadius: 4 }
                ]
                },
                options: { 
                    responsive: true, 
                    maintainAspectRatio: false, 
                    scales: { 
                        y: { 
                            title: { display: true, text: 'Change from Baseline (%)' }, 
                            ticks: { callback: function(value) { return value.toFixed(1) + '%'; } },
                            min: yMin, // Dynamic min
                            max: yMax  // Dynamic max
                        },
                        x: {
                            ticks: {
                                autoSkip: false, 
                                maxRotation: 45,
                                minRotation: 30
                            }
                        }
                    }, 
                    plugins: { 
                        tooltip: { 
                            callbacks: { 
                                label: function(context) { return `${context.dataset.label}: ${context.raw.toFixed(2)}%`; } 
                            } 
                        } 
                    } 
                }
            });
             console.log("Percentage Chart initialized successfully.");
        } catch (error) {
             console.error("Error initializing Percentage Chart:", error);
        }
    }

    function initializeTrendChart() {
        console.log("Attempting to initialize Trend Chart...");
        const canvasElement = document.getElementById('trendChart');
        if (!canvasElement) {
            console.warn("initializeTrendChart: Canvas element 'trendChart' not found.");
             if (trendChartInstance) { trendChartInstance.destroy(); trendChartInstance = null; }
            return;
        }
         if (trendChartInstance && trendChartInstance.canvas === canvasElement) {
            console.log("Trend Chart instance already exists.");
            return;
        }
        if (trendChartInstance) { trendChartInstance.destroy(); trendChartInstance = null; }

        const trendCtx = canvasElement.getContext('2d');
         if (!trendCtx) {
            console.warn("initializeTrendChart: Failed to get 2D context.");
            return;
        }
        if (!window.trendData || window.trendData.length === 0) {
            console.warn("Trend summary data is not available or empty. Cannot initialize chart.");
             trendCtx.clearRect(0, 0, trendCtx.canvas.width, trendCtx.canvas.height);
            trendCtx.textAlign = 'center';
            trendCtx.fillText('Summary data not available', trendCtx.canvas.width / 2, trendCtx.canvas.height / 2);
            return;
        }

        console.log("Initializing Trend Chart with summary data:", window.trendData);

        try {
             // Determine min/max for y-axis dynamically, ensuring 0 is included
            const allValues = window.trendData.flatMap(d => [d.Baseline, d.Replant, d.Urban]);
            const dataMin = Math.min(0, ...allValues); // Include 0
            const dataMax = Math.max(0, ...allValues); // Include 0
            const yMin = Math.floor(dataMin - Math.abs(dataMin * 0.1)); // Add 10% padding below min
            const yMax = Math.ceil(dataMax + Math.abs(dataMax * 0.1)); // Add 10% padding above max

            trendChartInstance = new Chart(trendCtx, {
                type: 'line',
                data: {
                labels: window.trendData.map(d => d.name),
                datasets: [
                    // Plot Baseline, Replant, Urban first
                     { label: '2050 Baseline (ViT)', data: window.trendData.map(d => d.Baseline), borderColor: '#fd7e14', backgroundColor: '#fd7e14', tension: 0.1, borderWidth: 3, pointRadius: 6, pointHoverRadius: 8 },
                    { label: 'Replanting Efforts', data: window.trendData.map(d => d.Replant), borderColor: '#17a2b8', backgroundColor: '#17a2b8', tension: 0.1, borderWidth: 3, pointRadius: 6, pointHoverRadius: 8 },
                    { label: 'Urban Development', data: window.trendData.map(d => d.Urban), borderColor: '#dc3545', backgroundColor: '#dc3545', tension: 0.1, borderWidth: 3, pointRadius: 6, pointHoverRadius: 8 },
                     // Plot Current (0 line) last so it's potentially on top visually if needed, though less critical for line
                    { label: 'Current Conditions', data: window.trendData.map(d => d.Current), borderColor: '#0056b3', backgroundColor: '#0056b3', tension: 0.1, borderWidth: 3, pointRadius: 6, pointHoverRadius: 8 },
                ]
                },
                options: { 
                    responsive: true, 
                    maintainAspectRatio: false, 
                    scales: { 
                        y: { 
                            title: { display: true, text: 'Change from Current (%)' }, 
                            ticks: { callback: function(value) { return value.toFixed(0) + '%'; } }, // Use 0 decimal places for cleaner axis
                            min: yMin, // Dynamic min
                            max: yMax  // Dynamic max
                        },
                        x: {
                             ticks: {
                                autoSkip: false, 
                                maxRotation: 45,
                                minRotation: 30
                            }
                        }
                    }, 
                    plugins: { 
                        tooltip: { 
                            callbacks: { 
                                label: function(context) { return `${context.dataset.label}: ${context.raw.toFixed(1)}%`; }, 
                                title: function(context) { return `${context[0].label}`; } // Use category name as title
                            } 
                        } 
                    } 
                }
            });
             console.log("Trend Chart initialized successfully.");
        } catch (error) {
            console.error("Error initializing Trend Chart:", error);
        }
    }
    
  </script>
===
    </search>
    <content>
===
                // Initialize/Mount based on the NOW ACTIVE tab
                const activeContent = document.getElementById(tabId); // Get the active tab content div
                if (!activeContent) {
                    console.error(`Could not find active content element for tab ID: ${tabId}`);
                    return; // Stop if the content container isn't found
                }

                if (tabId === 'raw') {
                    const canvasElement = activeContent.querySelector('#rawChart'); // Find canvas *within* active content
                    if (canvasElement) {
                        initializeRawChart(canvasElement); // Pass the canvas element
                    } else {
                        console.warn("Canvas element 'rawChart' not found within the active tab content.");
                    }
                } else if (tabId === 'percentage') {
                    const canvasElement = activeContent.querySelector('#percentageChart'); // Find canvas *within* active content
                    if (canvasElement) {
                        initializePercentageChart(canvasElement); // Pass the canvas element
                    } else {
                        console.warn("Canvas element 'percentageChart' not found within the active tab content.");
                    }
                } else if (tabId === 'trends') {
                    const canvasElement = activeContent.querySelector('#trendChart'); // Find canvas *within* active content
                    if (canvasElement) {
                        initializeTrendChart(canvasElement); // Pass the canvas element
                    } else {
                        console.warn("Canvas element 'trendChart' not found within the active tab content.");
                    }
                } else if (tabId === 'distribution') {
                    // Mount React component only if not already mounted
                    if (!reactComponentMounted) {
                        if (typeof window.DistributionAnalysisComponent !== 'undefined') {
                            // Check if boxPlotData seems valid before rendering
                            if (window.boxPlotData && Object.keys(window.boxPlotData).length > 0) {
                                console.log("Rendering DistributionAnalysisComponent with data prop:", window.boxPlotData);
                                // Pass the data as a prop
                                ReactDOM.render(React.createElement(window.DistributionAnalysisComponent, { initialData: window.boxPlotData }), distributionReactRoot);
                                reactComponentMounted = true;
                            } else {
                                console.warn("Attempted to render DistributionAnalysisComponent, but window.boxPlotData is not ready or empty.");
                                distributionReactRoot.innerHTML = '<p class="text-red-500">Distribution data is not available. Please check the data source and console logs.</p>';
                            }
                        } else {
                            console.error('DistributionAnalysisComponent not found. Babel might not have finished, or there was a script error.');
                            distributionReactRoot.innerHTML = '<p class="text-red-500">Error loading Distribution Analysis component. Check console logs.</p>';
                        }
                    } else {
                         console.log("DistributionAnalysisComponent already mounted.");
                    }
                }
            }, 50); // Small delay ensures DOM is updated and visible
          });
        });
        
        // Initialize the default active tab's chart (Raw Outflow) IF data is loaded
        const initialActiveTabLink = document.querySelector('.tab-link.active');
        if (initialActiveTabLink) {
            const initialTabId = initialActiveTabLink.id.replace('tab-', '');
            const initialActiveContent = document.getElementById(initialTabId);

            if (initialActiveContent && initialTabId === 'raw') {
                 // Add a slightly longer delay for initial load
                 setTimeout(() => {
                    console.log("Attempting initial Raw Chart initialization after delay.");
                    const canvasElement = initialActiveContent.querySelector('#rawChart'); // Find canvas within initial active tab
                    if (canvasElement) {
                        initializeRawChart(canvasElement); // Pass the canvas element
                    } else {
                        console.warn("Canvas element 'rawChart' not found during initial load within the active tab.");
                    }
                 }, 150); // Delay to ensure canvas is rendered
            } else {
                console.log(`Initial load: Default active tab is '${initialTabId}', not 'raw'.`);
            }
        } else {
             console.warn("Initial load: Could not find default active tab link.");
        }
        
      }).catch(error => {
        console.error("Error during initial data load sequence:", error);
      });
      
    }); // End DOMContentLoaded

    // --- Chart.js Initialization Functions (now accept canvasElement) ---
    
    function initializeRawChart(canvasElement) {
        console.log("Attempting to initialize Raw Chart...");
        // Canvas element is now passed as an argument
        if (!canvasElement) {
             console.warn("initializeRawChart: Received null canvas element.");
             if (rawChartInstance) { rawChartInstance.destroy(); rawChartInstance = null; }
             return;
        }
        
        // Check if an instance already exists for this specific canvas
        if (rawChartInstance && rawChartInstance.canvas === canvasElement) {
            console.log("Raw Chart instance already exists for this canvas.");
            return; // Don't re-initialize if already present
        }
        // Destroy any old instance before creating a new one
        if (rawChartInstance) { rawChartInstance.destroy(); rawChartInstance = null; }

        const rawCtx = canvasElement.getContext('2d');
        if (!rawCtx) {
            console.warn("initializeRawChart: Failed to get 2D context from canvas.");
            return; 
        }
        // Check if data is loaded and valid
        if (!window.rawOutflowData || window.rawOutflowData.length === 0) {
            console.warn("Raw outflow summary data is not available or empty. Cannot initialize chart.");
            rawCtx.clearRect(0, 0, rawCtx.canvas.width, rawCtx.canvas.height);
            rawCtx.textAlign = 'center';
            rawCtx.fillText('Summary data not available', rawCtx.canvas.width / 2, rawCtx.canvas.height / 2);
            return;
        }
        
        console.log("Initializing Raw Chart with summary data:", window.rawOutflowData);
        
        try {
            rawChartInstance = new Chart(rawCtx, {
                type: 'bar',
                data: {
                labels: window.rawOutflowData.map(d => d.category),
                datasets: [
                    { label: 'Current Conditions', data: window.rawOutflowData.map(d => d.Current), backgroundColor: '#0056b3', borderRadius: 4 },
                    { label: '2050 Baseline (ViT)', data: window.rawOutflowData.map(d => d.Baseline), backgroundColor: '#fd7e14', borderRadius: 4 },
                    { label: 'Replanting Efforts', data: window.rawOutflowData.map(d => d.Replant), backgroundColor: '#17a2b8', borderRadius: 4 },
                    { label: 'Urban Development', data: window.rawOutflowData.map(d => d.Urban), backgroundColor: '#dc3545', borderRadius: 4 }
                ]
                },
                options: { 
                    responsive: true, 
                    maintainAspectRatio: false, 
                    scales: { 
                        y: { 
                            beginAtZero: true, 
                            title: { display: true, text: 'Average Max Outflow (cms)' } 
                        },
                        x: {
                            ticks: {
                                autoSkip: false, // Prevent labels from being skipped
                                maxRotation: 45, // Rotate labels if needed
                                minRotation: 30
                            }
                        }
                    }, 
                    plugins: { 
                        tooltip: { 
                            callbacks: { 
                                label: function(context) { return `${context.dataset.label}: ${context.raw.toFixed(3)} cms`; } 
                            } 
                        } 
                    } 
                }
            });
            console.log("Raw Chart initialized successfully.");
        } catch (error) {
            console.error("Error initializing Raw Chart:", error);
        }
    }

    function initializePercentageChart(canvasElement) {
        console.log("Attempting to initialize Percentage Chart...");
         if (!canvasElement) {
            console.warn("initializePercentageChart: Received null canvas element.");
             if (percentageChartInstance) { percentageChartInstance.destroy(); percentageChartInstance = null; }
            return; 
        }
        if (percentageChartInstance && percentageChartInstance.canvas === canvasElement) {
            console.log("Percentage Chart instance already exists.");
            return;
        }
        if (percentageChartInstance) { percentageChartInstance.destroy(); percentageChartInstance = null; }

        const percentageCtx = canvasElement.getContext('2d');
        if (!percentageCtx) {
            console.warn("initializePercentageChart: Failed to get 2D context.");
            return;
        }
       if (!window.percentageChangeData || window.percentageChangeData.length === 0) {
            console.warn("Percentage change summary data is not available or empty. Cannot initialize chart.");
            percentageCtx.clearRect(0, 0, percentageCtx.canvas.width, percentageCtx.canvas.height);
            percentageCtx.textAlign = 'center';
            percentageCtx.fillText('Summary data not available', percentageCtx.canvas.width / 2, percentageCtx.canvas.height / 2);
            return;
        }

        console.log("Initializing Percentage Chart with summary data:", window.percentageChangeData);

        try {
            // Determine min/max for y-axis dynamically, with some padding
            const allValues = window.percentageChangeData.flatMap(d => [d.Urban, d.Replant]);
            const dataMin = Math.min(...allValues);
            const dataMax = Math.max(...allValues);
            const yMin = Math.floor(dataMin - Math.abs(dataMin * 0.1)); // Add 10% padding below min
            const yMax = Math.ceil(dataMax + Math.abs(dataMax * 0.1)); // Add 10% padding above max

            percentageChartInstance = new Chart(percentageCtx, {
                type: 'bar',
                data: {
                labels: window.percentageChangeData.map(d => d.category),
                datasets: [
                    { label: 'Urban vs 2050', data: window.percentageChangeData.map(d => d.Urban), backgroundColor: '#dc3545', borderRadius: 4 },
                    { label: 'Replant vs 2050', data: window.percentageChangeData.map(d => d.Replant), backgroundColor: '#17a2b8', borderRadius: 4 }
                ]
                },
                options: { 
                    responsive: true, 
                    maintainAspectRatio: false, 
                    scales: { 
                        y: { 
                            title: { display: true, text: 'Change from Baseline (%)' }, 
                            ticks: { callback: function(value) { return value.toFixed(1) + '%'; } },
                            min: yMin, // Dynamic min
                            max: yMax  // Dynamic max
                        },
                        x: {
                            ticks: {
                                autoSkip: false, 
                                maxRotation: 45,
                                minRotation: 30
                            }
                        }
                    }, 
                    plugins: { 
                        tooltip: { 
                            callbacks: { 
                                label: function(context) { return `${context.dataset.label}: ${context.raw.toFixed(2)}%`; } 
                            } 
                        } 
                    } 
                }
            });
             console.log("Percentage Chart initialized successfully.");
        } catch (error) {
             console.error("Error initializing Percentage Chart:", error);
        }
    }

    function initializeTrendChart(canvasElement) {
        console.log("Attempting to initialize Trend Chart...");
        if (!canvasElement) {
            console.warn("initializeTrendChart: Received null canvas element.");
             if (trendChartInstance) { trendChartInstance.destroy(); trendChartInstance = null; }
            return;
        }
         if (trendChartInstance && trendChartInstance.canvas === canvasElement) {
            console.log("Trend Chart instance already exists.");
            return;
        }
        if (trendChartInstance) { trendChartInstance.destroy(); trendChartInstance = null; }

        const trendCtx = canvasElement.getContext('2d');
         if (!trendCtx) {
            console.warn("initializeTrendChart: Failed to get 2D context.");
            return;
        }
        if (!window.trendData || window.trendData.length === 0) {
            console.warn("Trend summary data is not available or empty. Cannot initialize chart.");
             trendCtx.clearRect(0, 0, trendCtx.canvas.width, trendCtx.canvas.height);
            trendCtx.textAlign = 'center';
            trendCtx.fillText('Summary data not available', trendCtx.canvas.width / 2, trendCtx.canvas.height / 2);
            return;
        }

        console.log("Initializing Trend Chart with summary data:", window.trendData);

        try {
             // Determine min/max for y-axis dynamically, ensuring 0 is included
            const allValues = window.trendData.flatMap(d => [d.Baseline, d.Replant, d.Urban]);
            const dataMin = Math.min(0, ...allValues); // Include 0
            const dataMax = Math.max(0, ...allValues); // Include 0
            const yMin = Math.floor(dataMin - Math.abs(dataMin * 0.1)); // Add 10% padding below min
            const yMax = Math.ceil(dataMax + Math.abs(dataMax * 0.1)); // Add 10% padding above max

            trendChartInstance = new Chart(trendCtx, {
                type: 'line',
                data: {
                labels: window.trendData.map(d => d.name),
                datasets: [
                    // Plot Baseline, Replant, Urban first
                     { label: '2050 Baseline (ViT)', data: window.trendData.map(d => d.Baseline), borderColor: '#fd7e14', backgroundColor: '#fd7e14', tension: 0.1, borderWidth: 3, pointRadius: 6, pointHoverRadius: 8 },
                    { label: 'Replanting Efforts', data: window.trendData.map(d => d.Replant), borderColor: '#17a2b8', backgroundColor: '#17a2b8', tension: 0.1, borderWidth: 3, pointRadius: 6, pointHoverRadius: 8 },
                    { label: 'Urban Development', data: window.trendData.map(d => d.Urban), borderColor: '#dc3545', backgroundColor: '#dc3545', tension: 0.1, borderWidth: 3, pointRadius: 6, pointHoverRadius: 8 },
                     // Plot Current (0 line) last so it's potentially on top visually if needed, though less critical for line
                    { label: 'Current Conditions', data: window.trendData.map(d => d.Current), borderColor: '#0056b3', backgroundColor: '#0056b3', tension: 0.1, borderWidth: 3, pointRadius: 6, pointHoverRadius: 8 },
                ]
                },
                options: { 
                    responsive: true, 
                    maintainAspectRatio: false, 
                    scales: { 
                        y: { 
                            title: { display: true, text: 'Change from Current (%)' }, 
                            ticks: { callback: function(value) { return value.toFixed(0) + '%'; } }, // Use 0 decimal places for cleaner axis
                            min: yMin, // Dynamic min
                            max: yMax  // Dynamic max
                        },
                        x: {
                             ticks: {
                                autoSkip: false, 
                                maxRotation: 45,
                                minRotation: 30
                            }
                        }
                    }, 
                    plugins: { 
                        tooltip: { 
                            callbacks: { 
                                label: function(context) { return `${context.dataset.label}: ${context.raw.toFixed(1)}%`; }, 
                                title: function(context) { return `${context[0].label}`; } // Use category name as title
                            } 
                        } 
                    } 
                }
            });
             console.log("Trend Chart initialized successfully.");
        } catch (error) {
            console.error("Error initializing Trend Chart:", error);
        }
    }
    
  </script>
===
    </content>
  </change>
  <change>
    <description>Correct YAxis domain for Low Events chart in React component</description>
    <search>
===
                                    <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} />
                                    <YAxis 
                                        domain={yAxisRange}
                                        label={{ value: `Max Outflow (cms)`, angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: 11 }, dx:-15 }} // Adjusted dx
                                        tick={{ fontSize: 10 }}
                                        tickFormatter={(val) => val.toFixed(1)}
===
    </search>
    <content>
===
                                    <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} />
                                    <YAxis 
                                        domain={yAxisRangeLow} // Use specific range for Low chart
                                        label={{ value: `Max Outflow (cms)`, angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: 11 }, dx:-15 }} // Adjusted dx
                                        tick={{ fontSize: 10 }}
                                        tickFormatter={(val) => val.toFixed(1)}
===
    </content>
  </change>
  <change>
    <description>Correct YAxis domain for Peak Events chart in React component</description>
    <search>
===
                                    <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} />
                                    <YAxis 
                                        domain={yAxisRange}
                                        label={{ value: `Max Outflow (cms)`, angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: 11 }, dx:-15 }} // Adjusted dx
                                        tick={{ fontSize: 10 }}
                                        tickFormatter={(val) => val.toFixed(1)}
===
    </search>
    <content>
===
                                    <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} />
                                    <YAxis 
                                        domain={yAxisRangePeak} // Use specific range for Peak chart
                                        label={{ value: `Max Outflow (cms)`, angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: 11 }, dx:-15 }} // Adjusted dx
                                        tick={{ fontSize: 10 }}
                                        tickFormatter={(val) => val.toFixed(1)}
===
    </content>
  </change>
</file>
