<Plan>
1.  **Modify `index.html`:**
    *   **Refine Tab Click Logic:** In the `DOMContentLoaded` event listener, adjust the tab click handler's `setTimeout` callback. Instead of calling the initialization functions directly, first, get the specific canvas element (`getElementById`) for the *newly activated* tab (`tabId`). Only if the canvas element is successfully found, then call the corresponding `initialize...Chart` function. This ensures the canvas exists in the DOM before attempting initialization.
    *   **Simplify Chart Initialization Checks:** Remove the `!container || !container.classList.contains('active')` check from within the `initializeRawChart`, `initializePercentageChart`, and `initializeTrendChart` functions. These functions should now primarily check if the `canvasElement.getContext('2d')` succeeds and if the required `window...Data` is available. The responsibility of ensuring the tab is active and the canvas exists is moved to the tab click handler.
    *   **Adjust Initial Chart Load:** Modify the initial chart loading logic after `loadExcelData` completes. It should explicitly get the `rawChart` canvas element *after* the delay and only call `initializeRawChart` if the element is found and the `raw` tab is indeed active.
</Plan>

<file path="/Users/alikara/Desktop/508 website/index.html" action="modify">
  <change>
    <description>Adjust tab click listener to get canvas element *after* delay before initializing chart.</description>
    <search>
===
            // --- Chart Initialization / React Mounting ---
            // Use setTimeout to allow the DOM to update (tab becomes visible)
            setTimeout(() => {
                console.log(`Tab '${tabId}' selected, attempting updates.`);
                
                // Unmount React component if switching AWAY from distribution tab
                if (tabId !== 'distribution' && reactComponentMounted) {
                    if (distributionReactRoot.hasChildNodes()) {
                        console.log("Unmounting DistributionAnalysisComponent");
                        ReactDOM.unmountComponentAtNode(distributionReactRoot);
                        reactComponentMounted = false;
                    }
                }

                // Destroy existing Chart.js instances if switching AWAY from their tabs
                if (tabId !== 'raw' && rawChartInstance) { rawChartInstance.destroy(); rawChartInstance = null; console.log("Destroyed Raw Chart instance."); }
                if (tabId !== 'percentage' && percentageChartInstance) { percentageChartInstance.destroy(); percentageChartInstance = null; console.log("Destroyed Percentage Chart instance."); }
                if (tabId !== 'trends' && trendChartInstance) { trendChartInstance.destroy(); trendChartInstance = null; console.log("Destroyed Trend Chart instance."); }

                // Initialize/Mount based on the NOW ACTIVE tab
                if (tabId === 'raw') {
                    initializeRawChart();
                } else if (tabId === 'percentage') {
                    initializePercentageChart();
                } else if (tabId === 'trends') {
                    initializeTrendChart();
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
                initializeRawChart(); // This function now checks for data availability
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
        // Ensure the container is visible (tab is active)
        const container = document.getElementById('raw');
        if (!canvasElement || !container || !container.classList.contains('active')) {
             console.warn("initializeRawChart: Canvas element 'rawChart' not found or its tab is not active.");
             if (rawChartInstance) { rawChartInstance.destroy(); rawChartInstance = null; } // Clean up if switching away fast
             return;
        }
        // Check if an instance already exists for this canvas
        if (rawChartInstance && rawChartInstance.canvas === canvasElement) {
            console.log("Raw Chart instance already exists for this canvas.");
            return; // Don't re-initialize if already present
        }
        // Destroy any old instance before creating a new one
        if (rawChartInstance) { rawChartInstance.destroy(); rawChartInstance = null; }

        console.log("initializeRawChart: Canvas element found and tab is active.");
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
        const container = document.getElementById('percentage');
         if (!canvasElement || !container || !container.classList.contains('active')) {
            console.warn("initializePercentageChart: Canvas element 'percentageChart' not found or its tab is not active.");
             if (percentageChartInstance) { percentageChartInstance.destroy(); percentageChartInstance = null; }
            return; 
        }
        if (percentageChartInstance && percentageChartInstance.canvas === canvasElement) {
            console.log("Percentage Chart instance already exists.");
            return;
        }
        if (percentageChartInstance) { percentageChartInstance.destroy(); percentageChartInstance = null; }

        console.log("initializePercentageChart: Canvas element found and tab is active.");
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
        const container = document.getElementById('trends');
        if (!canvasElement || !container || !container.classList.contains('active')) {
            console.warn("initializeTrendChart: Canvas element 'trendChart' not found or its tab is not active.");
             if (trendChartInstance) { trendChartInstance.destroy(); trendChartInstance = null; }
            return;
        }
         if (trendChartInstance && trendChartInstance.canvas === canvasElement) {
            console.log("Trend Chart instance already exists.");
            return;
        }
        if (trendChartInstance) { trendChartInstance.destroy(); trendChartInstance = null; }

        console.log("initializeTrendChart: Canvas element found and tab is active.");
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
    <description>Simplify chart initialization checks to rely on getContext and data availability.</description>
    <search>
===
    // --- Chart.js Initialization Functions ---
    
    function initializeRawChart() {
        console.log("Attempting to initialize Raw Chart...");
        const canvasElement = document.getElementById('rawChart');
        // Ensure the container is visible (tab is active)
        const container = document.getElementById('raw');
        if (!canvasElement || !container || !container.classList.contains('active')) {
             console.warn("initializeRawChart: Canvas element 'rawChart' not found or its tab is not active.");
             if (rawChartInstance) { rawChartInstance.destroy(); rawChartInstance = null; } // Clean up if switching away fast
             return;
        }
        // Check if an instance already exists for this canvas
        if (rawChartInstance && rawChartInstance.canvas === canvasElement) {
            console.log("Raw Chart instance already exists for this canvas.");
            return; // Don't re-initialize if already present
        }
        // Destroy any old instance before creating a new one
        if (rawChartInstance) { rawChartInstance.destroy(); rawChartInstance = null; }

        console.log("initializeRawChart: Canvas element found and tab is active.");
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
        const container = document.getElementById('percentage');
         if (!canvasElement || !container || !container.classList.contains('active')) {
            console.warn("initializePercentageChart: Canvas element 'percentageChart' not found or its tab is not active.");
             if (percentageChartInstance) { percentageChartInstance.destroy(); percentageChartInstance = null; }
            return; 
        }
        if (percentageChartInstance && percentageChartInstance.canvas === canvasElement) {
            console.log("Percentage Chart instance already exists.");
            return;
        }
        if (percentageChartInstance) { percentageChartInstance.destroy(); percentageChartInstance = null; }

        console.log("initializePercentageChart: Canvas element found and tab is active.");
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
        const container = document.getElementById('trends');
        if (!canvasElement || !container || !container.classList.contains('active')) {
            console.warn("initializeTrendChart: Canvas element 'trendChart' not found or its tab is not active.");
             if (trendChartInstance) { trendChartInstance.destroy(); trendChartInstance = null; }
            return;
        }
         if (trendChartInstance && trendChartInstance.canvas === canvasElement) {
            console.log("Trend Chart instance already exists.");
            return;
        }
        if (trendChartInstance) { trendChartInstance.destroy(); trendChartInstance = null; }

        console.log("initializeTrendChart: Canvas element found and tab is active.");
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
    <content>
===
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
            // Ensure padding doesn't make min > 0 or max < 0 if data crosses zero
            const paddingMin = Math.abs(dataMin * 0.1) || 1; // Use 1 if min is 0
            const paddingMax = Math.abs(dataMax * 0.1) || 1; // Use 1 if max is 0
            const yMin = Math.floor(dataMin - paddingMin); 
            const yMax = Math.ceil(dataMax + paddingMax); 

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
            // Ensure padding doesn't make min > 0 or max < 0 if data crosses zero
            const paddingMin = Math.abs(dataMin * 0.1) || 5; // Use 5 if min is 0
            const paddingMax = Math.abs(dataMax * 0.1) || 5; // Use 5 if max is 0
            const yMin = Math.floor(dataMin - paddingMin); 
            const yMax = Math.ceil(dataMax + paddingMax); 

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
</file>
