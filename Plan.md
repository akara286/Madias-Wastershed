<Plan>
Modify the loading indicator approach to preserve canvas elements instead of removing them. This will ensure Chart.js has valid canvas elements to render to after data loads.
</Plan>

<file path="/Users/alikara/Desktop/508 website/index.html" action="modify">
  <change>
    <description>Change how loading indicators are displayed to preserve canvas elements</description>
    <search>
===
      try {
        // Show loading indicators
        document.querySelectorAll('.chart-container').forEach(container => {
          container.innerHTML = '<div style="display:flex;justify-content:center;align-items:center;height:100%;"><p>Loading data from Excel...</p></div>';
        });
===
    </search>
    <content>
===
      try {
        // Show loading indicators
        document.querySelectorAll('.chart-container').forEach(container => {
          // Store the original content
          const originalContent = container.innerHTML;
          // Create a loading overlay that preserves the original content
          const loadingDiv = document.createElement('div');
          loadingDiv.className = 'loading-overlay';
          loadingDiv.style.position = 'absolute';
          loadingDiv.style.top = '0';
          loadingDiv.style.left = '0';
          loadingDiv.style.width = '100%';
          loadingDiv.style.height = '100%';
          loadingDiv.style.display = 'flex';
          loadingDiv.style.justifyContent = 'center';
          loadingDiv.style.alignItems = 'center';
          loadingDiv.style.backgroundColor = 'rgba(255,255,255,0.8)';
          loadingDiv.style.zIndex = '10';
          loadingDiv.innerHTML = '<p>Loading data from Excel...</p>';
          
          // Ensure the container has position relative for absolute positioning
          if (window.getComputedStyle(container).position === 'static') {
            container.style.position = 'relative';
          }
          
          container.appendChild(loadingDiv);
        });
===
    </content>
  </change>
  
  <change>
    <description>Update error handling to use overlay approach instead of innerHTML replacement</description>
    <search>
===
      } catch (error) {
        console.error("Error loading or processing Excel data:", error);
        document.querySelectorAll('.chart-container').forEach(container => {
          container.innerHTML = `<div style="display:flex;justify-content:center;align-items:center;height:100%;color:red;">
            <p>Error loading data: ${error.message}. Please check console for details.</p>
          </div>`;
        });
===
    </search>
    <content>
===
      } catch (error) {
        console.error("Error loading or processing Excel data:", error);
        document.querySelectorAll('.chart-container').forEach(container => {
          // Remove any existing loading overlays
          container.querySelectorAll('.loading-overlay').forEach(overlay => overlay.remove());
          
          // Create an error overlay
          const errorDiv = document.createElement('div');
          errorDiv.className = 'error-overlay';
          errorDiv.style.position = 'absolute';
          errorDiv.style.top = '0';
          errorDiv.style.left = '0';
          errorDiv.style.width = '100%';
          errorDiv.style.height = '100%';
          errorDiv.style.display = 'flex';
          errorDiv.style.justifyContent = 'center';
          errorDiv.style.alignItems = 'center';
          errorDiv.style.backgroundColor = 'rgba(255,255,255,0.9)';
          errorDiv.style.color = 'red';
          errorDiv.style.zIndex = '10';
          errorDiv.innerHTML = `<p>Error loading data: ${error.message}. Please check console for details.</p>`;
          
          // Ensure the container has position relative for absolute positioning
          if (window.getComputedStyle(container).position === 'static') {
            container.style.position = 'relative';
          }
          
          container.appendChild(errorDiv);
        });
===
    </content>
  </change>
  
  <change>
    <description>Remove loading overlays when data is successfully loaded</description>
    <search>
===
        console.log("Final loaded and processed data structure:", {
          rawOutflowData: window.rawOutflowData,
          percentageChangeData: window.percentageChangeData,
          boxPlotData: window.boxPlotData,
          trendData: window.trendData
        });
        
        console.log("Excel data loading and processing finished successfully.");
===
    </search>
    <content>
===
        console.log("Final loaded and processed data structure:", {
          rawOutflowData: window.rawOutflowData,
          percentageChangeData: window.percentageChangeData,
          boxPlotData: window.boxPlotData,
          trendData: window.trendData
        });
        
        // Remove loading overlays
        document.querySelectorAll('.loading-overlay').forEach(overlay => overlay.remove());
        
        console.log("Excel data loading and processing finished successfully.");
===
    </content>
  </change>
  
  <change>
    <description>Increase the timeout delay for chart initialization to ensure DOM has updated</description>
    <search>
===
            // Use setTimeout to allow the DOM to update (tab becomes visible)
            setTimeout(() => {
                console.log(`Tab '${tabId}' selected, attempting updates.`);
===
    </search>
    <content>
===
            // Use setTimeout to allow the DOM to update (tab becomes visible)
            setTimeout(() => {
                console.log(`Tab '${tabId}' selected, attempting updates.`);
===
    </content>
  </change>
  
  <change>
    <description>Increase the timeout value for initializing charts</description>
    <search>
===
            }, 50); // Small delay ensures DOM is updated and visible
===
    </search>
    <content>
===
            }, 150); // Increased delay ensures DOM is fully updated and visible
===
    </content>
  </change>
  
  <change>
    <description>Increase the initial chart initialization delay</description>
    <search>
===
                 }, 150); // Delay to ensure canvas is rendered
===
    </search>
    <content>
===
                 }, 250); // Increased delay to ensure canvas is fully rendered
===
    </content>
  </change>
</file>
