<Plan>
The logs confirm that data loading is now successful, and the correct sheet names are being used. However, there are two remaining issues:

1.  **Column Name Mismatch for Distribution Data:** The logs show that the column names within the "low" and "peak" sheets are inconsistent (e.g., `"2yr current cms"`, `"current"`, `"200yr"`, `"cc Base (ViT)"`, `"cc base (ViT)"`). The `generateAreaDistributionData` function currently assumes the data passed to `calculateStats` is already an array of numbers for `current`, `baseline`, `replant`, and `urban`. This is incorrect. We need to modify `generateAreaDistributionData` to iterate through the rows parsed from the Excel sheet and extract the correct numerical values based on the actual column names found in each sheet, creating separate arrays of numbers for each scenario *before* calling `calculateStats`.
2.  **Initial Canvas Not Found:** The `Raw chart canvas not found.` warning persists for the *initial* load (before tab clicks). This suggests that even within `DOMContentLoaded` and after `loadExcelData` finishes, the default "Raw Outflow" tab's canvas might not be rendered immediately. We will add a small `setTimeout` delay specifically for the *initial* call to `initializeRawChart` after data loading completes to give the browser a moment to render the default tab content.

</Plan>

<file path="/Users/alikara/Desktop/508 website/index.html" action="modify">
  <change>
    <description>Refactor generateAreaDistributionData to correctly extract numerical data using actual column names from sheets before calculating stats.</description>
    <search>
===
    };

    const generateAreaDistributionData = (yearGroup) => {
        // Map yearGroup to the correct sheet names/keys
        const lowKey = yearGroup === '2yr' ? "2yr max outflow - low" : "200yr max outflow - low";
        const peakKey = yearGroup === '2yr' ? "2yr max outflow - peak" : "200yr max outflow - peak";
        
        // Check if boxPlotData and the required keys exist
        if (!window.boxPlotData || !window.boxPlotData[lowKey] || !window.boxPlotData[peakKey]) {
            console.warn(`Box plot data for keys '${lowKey}' or '${peakKey}' not found in window.boxPlotData.`);
            // Return empty structure to prevent errors
             return [
                { group: "Low", data: [] },
                { group: "Peak", data: [] }
            ];
        }

        // Access data using the correct keys
        const lowData = window.boxPlotData[lowKey];
        const peakData = window.boxPlotData[peakKey];

        // Check if the data itself has the expected structure (e.g., 'current' property)
         if (!lowData || !peakData || typeof lowData !== 'object' || typeof peakData !== 'object') {
             console.warn(`Data structure invalid for keys '${lowKey}' or '${peakKey}'.`);
             return [ { group: "Low", data: [] }, { group: "Peak", data: [] } ];
         }


        const lowStats = {
            current: calculateStats(lowData?.current || []),
            baseline: calculateStats(lowData?.baseline || []),
            replant: calculateStats(lowData?.replant || []),
            urban: calculateStats(lowData?.urban || [])
        };
        
        const peakStats = {
            current: calculateStats(peakData?.current || []),
            baseline: calculateStats(peakData?.baseline || []),
            replant: calculateStats(peakData?.replant || []),
            urban: calculateStats(peakData?.urban || [])
        };
        
        const mapData = (stats, type) => ([
            { name: 'Current', ...stats.current, type },
            { name: '2050 Baseline', ...stats.baseline, type },
            { name: 'Replant', ...stats.replant, type },
            { name: 'Urban', ...stats.urban, type }
        ]);

        return [
            { group: "Low", data: mapData(lowStats, "Low") },
            { group: "Peak", data: mapData(peakStats, "Peak") }
        ];
    };
===
    </search>
    <content>
===
    };

    const generateAreaDistributionData = (yearGroup) => {
        // Map yearGroup to the correct sheet names/keys
        const lowKey = yearGroup === '2yr' ? "2yr max outflow - low" : "200yr max outflow - low";
        const peakKey = yearGroup === '2yr' ? "2yr max outflow - peak" : "200yr max outflow - peak";

        // Check if boxPlotData and the required keys exist and contain data
        if (!window.boxPlotData || 
            !window.boxPlotData[lowKey] || !Array.isArray(window.boxPlotData[lowKey]) || window.boxPlotData[lowKey].length === 0 ||
            !window.boxPlotData[peakKey] || !Array.isArray(window.boxPlotData[peakKey]) || window.boxPlotData[peakKey].length === 0) {
            console.warn(`Box plot data for keys '${lowKey}' or '${peakKey}' not found, is not an array, or is empty.`);
            return [{ group: "Low", data: [] }, { group: "Peak", data: [] }];
        }

        // Helper to extract numeric data for a scenario based on potential column names
        const extractScenarioData = (sheetData, scenario) => {
            const values = [];
            let currentColumn, baselineColumn, replantColumn, urbanColumn;

            // Determine column names based on the first row (assuming consistent columns)
            const firstRow = sheetData[0];
            if (!firstRow) return []; // Empty sheet data

            // Identify potential column names (case-insensitive checks might be needed if headers vary wildly)
            currentColumn = Object.keys(firstRow).find(k => k.toLowerCase().includes('current') || k.toLowerCase().includes('2yr') || k.toLowerCase().includes('200yr'));
            baselineColumn = Object.keys(firstRow).find(k => k.toLowerCase().includes('base') || k.toLowerCase().includes('baseline'));
            replantColumn = Object.keys(firstRow).find(k => k.toLowerCase().includes('replant'));
            urbanColumn = Object.keys(firstRow).find(k => k.toLowerCase().includes('urban'));

            let targetColumn;
            switch (scenario) {
                case 'current': targetColumn = currentColumn; break;
                case 'baseline': targetColumn = baselineColumn; break;
                case 'replant': targetColumn = replantColumn; break;
                case 'urban': targetColumn = urbanColumn; break;
                default: return [];
            }

            if (!targetColumn) {
                console.warn(`Could not find column for scenario '${scenario}' in sheet data starting with keys:`, Object.keys(firstRow));
                return [];
            }

            // Extract numbers
            for (const row of sheetData) {
                const value = parseFloat(row[targetColumn]);
                if (!isNaN(value)) {
                    values.push(value);
                } else {
                     // console.warn(`Non-numeric value found for column '${targetColumn}' in row:`, row);
                }
            }
            // console.log(`Extracted ${values.length} values for scenario '${scenario}' using column '${targetColumn}'`);
            return values;
        };

        // Extract data for each scenario from the LOW sheet data
        const lowCurrentData = extractScenarioData(window.boxPlotData[lowKey], 'current');
        const lowBaselineData = extractScenarioData(window.boxPlotData[lowKey], 'baseline');
        const lowReplantData = extractScenarioData(window.boxPlotData[lowKey], 'replant');
        const lowUrbanData = extractScenarioData(window.boxPlotData[lowKey], 'urban');

        // Extract data for each scenario from the PEAK sheet data
        const peakCurrentData = extractScenarioData(window.boxPlotData[peakKey], 'current');
        const peakBaselineData = extractScenarioData(window.boxPlotData[peakKey], 'baseline');
        const peakReplantData = extractScenarioData(window.boxPlotData[peakKey], 'replant');
        const peakUrbanData = extractScenarioData(window.boxPlotData[peakKey], 'urban');

        // Calculate stats on the extracted numerical arrays
        const lowStats = {
            current: calculateStats(lowCurrentData),
            baseline: calculateStats(lowBaselineData),
            replant: calculateStats(lowReplantData),
            urban: calculateStats(lowUrbanData)
        };
        
        const peakStats = {
            current: calculateStats(peakCurrentData),
            baseline: calculateStats(peakBaselineData),
            replant: calculateStats(peakReplantData),
            urban: calculateStats(peakUrbanData)
        };
        
        // Map stats to the format needed by the chart
        const mapData = (stats, type) => ([
            { name: 'Current', ...stats.current, type },
            { name: '2050 Baseline', ...stats.baseline, type },
            { name: 'Replant', ...stats.replant, type },
            { name: 'Urban', ...stats.urban, type }
        ]);

        return [
            { group: "Low", data: mapData(lowStats, "Low") },
            { group: "Peak", data: mapData(peakStats, "Peak") }
        ];
    };
===
    </content>
  </change>
  <change>
    <description>Add setTimeout delay for the initial raw chart initialization after data load.</description>
    <search>
===
          
          // Initialize the default active tab's chart (Raw Outflow) IF data is loaded
          if (window.rawOutflowData && window.rawOutflowData.length > 0) {
             initializeRawChart();
          } else {
             console.warn("Raw outflow data not available, cannot initialize default chart.");
          }

      }).catch(error => {
          console.error("Error during initial data load sequence:", error);
      });
===
    </search>
    <content>
===
          
          // Initialize the default active tab's chart (Raw Outflow) IF data is loaded
          // Add a small delay to ensure the canvas is rendered
          setTimeout(() => {
              if (window.rawOutflowData && window.rawOutflowData.length > 0) {
                 console.log("Attempting initial Raw Chart initialization.");
                 initializeRawChart();
              } else {
                 console.warn("Raw outflow data not available, cannot initialize default chart.");
                 // Optionally try to display message on canvas if it exists
                 const rawCtx = document.getElementById('rawChart')?.getContext('2d');
                 if (rawCtx) {
                    rawCtx.clearRect(0, 0, rawCtx.canvas.width, rawCtx.canvas.height);
                    rawCtx.textAlign = 'center';
                    rawCtx.fillText('Data not available', rawCtx.canvas.width / 2, rawCtx.canvas.height / 2);
                 }
              }
          }, 100); // 100ms delay - adjust if needed

      }).catch(error => {
          console.error("Error during initial data load sequence:", error);
      });
===
    </content>
  </change>
</file>
