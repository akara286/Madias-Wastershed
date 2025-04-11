<Plan>
Create a visually enhanced dashboard by:
1. Incorporating descriptive text from max_outflow_dashboard_final_fixed.html
2. Improving typography and spacing
3. Adding modern visual elements like gradients, shadows, and animations
4. Enhancing chart containers and styling
5. Improving tab design with better transitions
</Plan>

<file path="/Users/alikara/Desktop/508 website/index.html" action="modify">
  <change>
    <description>Add CSS variables for consistent color scheme and enhance overall styling</description>
    <search>
===
  <style>
    /* Keep existing styles for overall layout and non-React tabs */
    body {
      margin: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background-color: #f8f9fa;
      color: #333;
    }
===
    </search>
    <content>
===
  <style>
    /* Define CSS variables for consistent theming */
    :root {
      --primary-color: #0056b3;          /* Blue (Current scenario) */
      --secondary-color: #17a2b8;        /* Teal (Replant scenario) */
      --accent-color-orange: #fd7e14;    /* Orange (Baseline scenario) */
      --accent-color-red: #dc3545;       /* Red (Urban scenario) */
      --background: #f5f7fa;
      --card-bg: #ffffff;
      --text-color: #343a40;
      --text-secondary: #6c757d;
      --border-light: rgba(0,0,0,0.08);
      --shadow-sm: 0 2px 8px rgba(0,0,0,0.05);
      --shadow-md: 0 4px 15px rgba(0,0,0,0.07);
      --shadow-lg: 0 10px 25px rgba(0,0,0,0.08);
      --transition-fast: 0.2s ease;
      --transition-medium: 0.3s ease;
      --radius-sm: 6px;
      --radius-md: 10px;
      --radius-lg: 15px;
    }
    
    /* Base styles */
    body {
      margin: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background-color: var(--background);
      color: var(--text-color);
      line-height: 1.6;
      font-size: 16px;
    }
===
    </content>
  </change>
  
  <change>
    <description>Enhance header styling with modern gradient and pattern</description>
    <search>
===
    .header {
      background: linear-gradient(to right, #0d47a1, #1976d2);
      color: white;
      padding: 2rem 1rem;
      text-align: center;
    }
===
    </search>
    <content>
===
    .header {
      background: linear-gradient(135deg, #0d47a1, #1976d2, #2196f3);
      color: white;
      padding: 3rem 1rem;
      text-align: center;
      box-shadow: var(--shadow-md);
      position: relative;
      overflow: hidden;
    }
    
    .header::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5z' fill='%23ffffff' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E");
      opacity: 0.3;
    }
    
    .header h1 {
      margin-bottom: 0.5rem;
      font-weight: 700;
      letter-spacing: -0.5px;
      font-size: 2.6rem;
      text-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .header p {
      max-width: 800px;
      margin: 0 auto;
      opacity: 0.9;
      font-size: 1.15rem;
      font-weight: 300;
    }
===
    </content>
  </change>
  
  <change>
    <description>Enhance container styling</description>
    <search>
===
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem 1rem;
    }
===
    </search>
    <content>
===
    .container {
      max-width: 1200px;
      margin: 2.5rem auto;
      padding: 2.5rem;
      background-color: var(--card-bg);
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-md);
    }
===
    </content>
  </change>
  
  <change>
    <description>Improve tab links styling</description>
    <search>
===
    .tab-links {
      display: flex;
      flex-wrap: wrap;
      border-bottom: 1px solid #dee2e6;
      margin-bottom: 2rem;
    }
    
    .tab-link {
      padding: 0.75rem 1rem;
      cursor: pointer;
      background-color: #f1f1f1;
      border: none;
      border-radius: 5px 5px 0 0;
      margin-right: 0.5rem;
      margin-bottom: -1px; /* Overlap border */
      transition: all 0.3s;
      border: 1px solid transparent;
      border-bottom: none;
    }
    
    .tab-link.active {
      background-color: white;
      border-color: #dee2e6 #dee2e6 white;
      border-bottom: 3px solid #1976d2;
      color: #1976d2;
      font-weight: bold;
    }
    
    .tab-link:hover:not(.active) {
      background-color: #e9ecef;
    }
===
    </search>
    <content>
===
    .tab-links {
      display: flex;
      flex-wrap: wrap;
      border-bottom: 1px solid var(--border-light);
      margin-bottom: 2.5rem;
      padding-bottom: 0.25rem;
      gap: 0.25rem;
    }
    
    .tab-link {
      padding: 0.875rem 1.25rem;
      cursor: pointer;
      background-color: transparent;
      border: none;
      border-radius: var(--radius-sm) var(--radius-sm) 0 0;
      margin-right: 0.5rem;
      margin-bottom: -1px; /* Overlap border */
      transition: all var(--transition-medium);
      position: relative;
      color: var(--text-secondary);
      font-size: 1rem;
      font-weight: 500;
      user-select: none;
    }
    
    .tab-link.active {
      background-color: rgba(25, 118, 210, 0.05);
      color: var(--primary-color);
      font-weight: 600;
    }
    
    .tab-link.active::after {
      content: '';
      position: absolute;
      bottom: -1px;
      left: 0;
      width: 100%;
      height: 3px;
      background: linear-gradient(90deg, var(--primary-color), #42a5f5);
      border-radius: 3px 3px 0 0;
      animation: slideIn 0.3s ease-out;
    }
    
    @keyframes slideIn {
      from { transform: scaleX(0.6); opacity: 0.6; }
      to { transform: scaleX(1); opacity: 1; }
    }
    
    .tab-link:hover:not(.active) {
      background-color: rgba(0,0,0,0.03);
      color: var(--text-color);
    }
===
    </content>
  </change>
  
  <change>
    <description>Enhance tab content styling</description>
    <search>
===
    .tab-content {
      display: none;
      background-color: white;
      padding: 2rem;
      border: 1px solid #dee2e6;
      border-top: none;
      border-radius: 0 5px 5px 5px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      margin-bottom: 2rem;
    }
    
    .tab-content.active {
      display: block;
    }
===
    </search>
    <content>
===
    .tab-content {
      display: none;
      background-color: var(--card-bg);
      padding: 2.5rem;
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-sm);
      margin-bottom: 2.5rem;
      opacity: 0;
      transform: translateY(10px);
      transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
    }
    
    .tab-content.active {
      display: block;
      opacity: 1;
      transform: translateY(0);
    }
    
    .tab-content h2 {
      color: var(--primary-color);
      border-bottom: 2px solid var(--border-light);
      padding-bottom: 0.75rem;
      margin-top: 0;
      margin-bottom: 1.5rem;
      font-size: 1.75rem;
      font-weight: 600;
    }
===
    </content>
  </change>
  
  <change>
    <description>Enhance chart container styling</description>
    <search>
===
    .chart-container {
      position: relative; /* Needed for Chart.js responsiveness */
      height: 400px;
      width: 100%;
      margin-bottom: 2rem;
    }
===
    </search>
    <content>
===
    .chart-container {
      position: relative; /* Needed for Chart.js responsiveness */
      height: 400px;
      width: 100%;
      margin-bottom: 2rem;
      background-color: var(--card-bg);
      border-radius: var(--radius-sm);
      box-shadow: var(--shadow-sm);
      padding: 1.5rem;
      border: 1px solid var(--border-light);
      transition: box-shadow var(--transition-medium);
    }
    
    .chart-container:hover {
      box-shadow: var(--shadow-md);
    }
===
    </content>
  </change>
  
  <change>
    <description>Add info box styling</description>
    <search>
===
    .info-box {
      background-color: #e6f3ff;
      padding: 1rem;
      border-left: 4px solid #1976d2;
      border-radius: 4px;
      margin-bottom: 1.5rem;
    }
===
    </search>
    <content>
===
    .info-box {
      background-color: rgba(33, 150, 243, 0.05);
      padding: 1.25rem;
      border-left: 4px solid var(--primary-color);
      border-radius: var(--radius-sm);
      margin-bottom: 1.75rem;
      box-shadow: var(--shadow-sm);
      transition: all var(--transition-medium);
    }
    
    .info-box:hover {
      background-color: rgba(33, 150, 243, 0.08);
      box-shadow: 0 3px 12px rgba(0,0,0,0.05);
    }
    
    /* Plot description styling (from 2nd file) */
    .plot-description {
      font-size: 1em;
      color: #495057;
      margin-bottom: 1.5rem;
      background-color: #eef2f7;
      padding: 1.25rem;
      border-radius: var(--radius-sm);
      border-left: 5px solid var(--primary-color);
    }
    
    .plot-description ul {
      margin-top: 0.75rem;
      margin-bottom: 0.5rem;
      padding-left: 1.5rem;
    }
    
    .plot-description li {
      margin-bottom: 0.5rem;
    }
    
    /* Data source note styling (from 2nd file) */
    .data-source-note {
      font-size: 0.9em;
      color: var(--text-secondary);
      margin-top: -0.5rem;
      margin-bottom: 1.5rem;
      font-style: italic;
      font-weight: 500;
      background-color: #fffadf;
      padding: 0.3rem 0.75rem;
      border-radius: 3px;
      display: inline-block;
    }
===
    </content>
  </change>
  
  <change>
    <description>Enhance typography and card styling</description>
    <search>
===
    .grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }
    
    @media (min-width: 768px) {
      .grid {
        grid-template-columns: 1fr 1fr;
      }
    }
    
    .card {
      background-color: #f1f1f1;
      padding: 1.5rem;
      border-radius: 4px;
    }
===
    </search>
    <content>
===
    .grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1.75rem;
    }
    
    @media (min-width: 768px) {
      .grid {
        grid-template-columns: 1fr 1fr;
      }
    }
    
    .card {
      background-color: var(--card-bg);
      padding: 1.75rem;
      border-radius: var(--radius-sm);
      box-shadow: var(--shadow-sm);
      transition: transform var(--transition-medium), box-shadow var(--transition-medium);
      border: 1px solid var(--border-light);
    }
    
    .card:hover {
      transform: translateY(-3px);
      box-shadow: var(--shadow-md);
    }
    
    /* Section divider from 2nd file */
    .section-divider {
      border: 0;
      height: 1px;
      background-image: linear-gradient(to right, rgba(0,0,0,0), rgba(0,0,0,0.1), rgba(0,0,0,0));
      margin: 3rem 0;
    }
===
    </content>
  </change>
  
  <change>
    <description>Enhance table styling</description>
    <search>
===
    table {
      width: 100%;
      border-collapse: collapse;
    }
    
    table th, table td {
      padding: 0.5rem;
      text-align: left;
      border-bottom: 1px solid #dee2e6;
    }
    
    table th {
      background-color: #f1f1f1;
    }
===
    </search>
    <content>
===
    table {
      width: 100%;
      border-collapse: collapse;
      border-radius: var(--radius-sm);
      overflow: hidden;
      box-shadow: var(--shadow-sm);
      margin-bottom: 1.5rem;
    }
    
    table th, table td {
      padding: 0.75rem 1rem;
      text-align: left;
      border-bottom: 1px solid var(--border-light);
    }
    
    table th {
      background: linear-gradient(to bottom, #f8f9fa, #f1f3f5);
      font-weight: 600;
      color: var(--text-color);
    }
    
    table tbody tr:hover {
      background-color: rgba(0,0,0,0.02);
    }
    
    table tbody tr:last-child td {
      border-bottom: none;
    }
===
    </content>
  </change>
  
  <change>
    <description>Enhance footer styling</description>
    <search>
===
    .footer {
      background-color: #343a40;
      color: #adb5bd;
      padding: 1.5rem 1rem;
      text-align: center;
      margin-top: 2rem;
    }
===
    </search>
    <content>
===
    .footer {
      background: linear-gradient(to right, #111827, #1f2937);
      color: #cbd5e1;
      padding: 2.5rem 1rem;
      text-align: center;
      margin-top: 3rem;
      box-shadow: 0 -1px 5px rgba(0,0,0,0.05);
    }
    
    .footer p {
      max-width: 600px;
      margin: 0 auto;
      opacity: 0.9;
    }
===
    </content>
  </change>
  
  <change>
    <description>Add animation for loading spinner</description>
    <search>
===
    /* Recharts tooltip is on top */
    .recharts-tooltip-wrapper {
      z-index: 1000 !important; /* Ensure tooltip is on top */
    }
===
    </search>
    <content>
===
    /* Recharts tooltip is on top */
    .recharts-tooltip-wrapper {
      z-index: 1000 !important; /* Ensure tooltip is on top */
    }
    
    /* Loading spinner animation */
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    .loading-spinner {
      width: 2.5rem;
      height: 2.5rem;
      border: 0.25rem solid rgba(0,0,0,0.1);
      border-radius: 50%;
      border-top-color: var(--primary-color);
      animation: spin 1s linear infinite;
      margin: 0.5rem auto;
    }
    
    .loading-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background-color: rgba(255,255,255,0.9);
      border-radius: var(--radius-sm);
      z-index: 10;
    }
    
    /* Animation controls for animated chart (from 2nd file) */
    .animation-controls {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      padding: 1rem;
      background-color: #f1f3f5;
      border-radius: var(--radius-sm);
      margin-top: 1rem;
      border: 1px solid var(--border-light);
      gap: 0.75rem;
    }
    
    .animation-controls button {
      padding: 0.5rem 1rem;
      font-size: 0.95rem;
      border-radius: var(--radius-sm);
      border: 1px solid #dee2e6;
      background-color: var(--card-bg);
      color: var(--primary-color);
      cursor: pointer;
      transition: all var(--transition-fast);
      font-weight: 500;
    }
    
    .animation-controls button:hover {
      background-color: #f0f0f0;
    }
    
    .animation-controls button.active {
      background-color: var(--primary-color);
      color: white;
      border-color: var(--primary-color);
    }
===
    </content>
  </change>
  
  <change>
    <description>Improve introduction text and add scrolling button</description>
    <search>
===
  </style>
</head>
<body>
  <header class="header">
    <div class="container">
      <h1>Max Outflow Uncertainty Dashboard</h1>
      <p>
        Interactive analysis of climate scenarios (2050 baseline, Urban development, Replanting efforts)
        and their impact on maximum water outflow across different rainfall event severities.
      </p>
    </div>
  </header>
===
    </search>
    <content>
===
  </style>
</head>
<body>
  <header class="header">
    <div class="container">
      <h1>Max Outflow Uncertainty Dashboard</h1>
      <p>
        This dashboard visualizes how future climate and land-use scenarios could affect peak water outflow compared to today. 
        It compares current conditions to projections for the year 2050 under different scenarios (baseline climate, increased urban development, and replanting of vegetation) 
        across both moderate and extreme rainfall events.
      </p>
    </div>
  </header>
  
  <!-- Scroll to top button -->
  <button id="scrollTopBtn" style="position: fixed; bottom: 30px; right: 30px; width: 50px; height: 50px; border-radius: 50%; background: linear-gradient(135deg, var(--primary-color), #42a5f5); color: white; border: none; box-shadow: 0 3px 10px rgba(0,0,0,0.2); cursor: pointer; display: none; z-index: 1000; opacity: 0; transition: opacity 0.3s ease, transform 0.3s ease;">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 19V5M5 12l7-7 7 7"/>
    </svg>
  </button>
===
    </content>
  </change>
  
  <change>
    <description>Add scroll to top button functionality</description>
    <search>
===
    });
    
  </script>
===
    </search>
    <content>
===
    });
    
    // Scroll to top button functionality
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    
    window.addEventListener('scroll', function() {
      if (document.documentElement.scrollTop > 300) {
        scrollTopBtn.style.display = 'block';
        setTimeout(() => {
          scrollTopBtn.style.opacity = '1';
          scrollTopBtn.style.transform = 'translateY(0)';
        }, 10);
      } else {
        scrollTopBtn.style.opacity = '0';
        scrollTopBtn.style.transform = 'translateY(10px)';
        setTimeout(() => {
          if (document.documentElement.scrollTop <= 300) {
            scrollTopBtn.style.display = 'none';
          }
        }, 300);
      }
    });
    
    scrollTopBtn.addEventListener('click', function() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
    
  </script>
===
    </content>
  </change>
  
  <change>
    <description>Add plot descriptions to the raw outflow tab</description>
    <search>
===
    <!-- Raw Outflow Tab (Chart.js) -->
    <div id="raw" class="tab-content active">
      <h2>Raw Max Outflow Comparison</h2>
      <p class="subtitle">Average values across 100 samples for each return period</p>
      
      <div class="info-box">
        <p>
          This chart compares the average maximum outflow values (in cms) across all scenarios and return periods. 
          Higher values indicate increased water flow volume during rainfall events.
        </p>
      </div>
      
      <div class="chart-container">
        <canvas id="rawChart"></canvas>
      </div>
    </div>
===
    </search>
    <content>
===
    <!-- Raw Outflow Tab (Chart.js) -->
    <div id="raw" class="tab-content active">
      <h2>Raw Max Outflow Comparison</h2>
      <p class="subtitle">Average values across 100 samples for each return period</p>
      
      <div class="plot-description">
        The bar chart below shows the projected <b>maximum outflow</b> (peak water flow rate, in cubic meters per second) for two types of storm events 
        under several scenarios:
        <ul>
          <li><b>Current (2020):</b> Current climate and land-use conditions.</li>
          <li><b>2050 Baseline:</b> Year 2050 climate under baseline conditions (no special intervention).</li>
          <li><b>Urban Development:</b> 2050 scenario with significant urban growth (more paved surfaces, increasing runoff).</li>
          <li><b>Replanting:</b> 2050 scenario with reforestation/revegetation efforts (more permeable land, reducing runoff).</li>
        </ul>
        Each scenario is evaluated for a relatively frequent <b>2-year storm</b> and a rare <b>200-year storm</b>, 
        under both a <i>low-impact</i> climate case and a <i>high-impact</i> (peak climate change) case.
      </div>
      
      <p class="data-source-note">Source: Summary values representing multiple return periods</p>
      
      <div class="chart-container">
        <canvas id="rawChart"></canvas>
      </div>
    </div>
===
    </content>
  </change>
  
  <change>
    <description>Add plot descriptions to the percentage tab</description>
    <search>
===
    <!-- Percentage Change Tab (Chart.js) -->
    <div id="percentage" class="tab-content">
      <h2>Percentage Change from 2050 Baseline</h2>
      <p class="subtitle">Calculated from average values across 100 samples</p>
      
      <div class="info-box">
        <p>
          This chart shows how the Urban and Replant scenarios compare to the 2050 Baseline in percentage terms, based on average outflow.
          Negative values indicate reduced outflow compared to the baseline scenario.
        </p>
      </div>
      
      <div class="chart-container">
        <canvas id="percentageChart"></canvas>
      </div>
    </div>
===
    </search>
    <content>
===
    <!-- Percentage Change Tab (Chart.js) -->
    <div id="percentage" class="tab-content">
      <h2>Percentage Change from 2050 Baseline</h2>
      <p class="subtitle">Calculated from average values across 100 samples</p>
      
      <div class="plot-description">
        This chart shows how the <b>Urban</b> and <b>Replanting</b> scenarios differ from the 2050 Baseline in terms of peak outflow, for each event type. 
        The values are percentages relative to the baseline scenario (the baseline is zero reference). 
        Positive percentages (red bars) indicate higher outflow than the baseline, while negative percentages (teal bars) indicate lower outflow. 
        You can see that the Urban development scenario results in a slight increase in peak flows, whereas the Replanting scenario leads to a few percent reduction in flows. 
        The effect of replanting is most pronounced for the smaller 2-year storm and diminishes for the 200-year event.
      </div>
      
      <p class="data-source-note">Source: Calculated from summary values representing multiple return periods</p>
      
      <div class="chart-container">
        <canvas id="percentageChart"></canvas>
      </div>
    </div>
===
    </content>
  </change>
  
  <change>
    <description>Add plot descriptions to the trends tab</description>
    <search>
===
    <!-- Trend Analysis Tab (Chart.js) -->
    <div id="trends" class="tab-content">
      <h2>Trend Analysis: Scenario Changes Across Events</h2>
      <p class="subtitle">Showing percentage change from current conditions (based on averages)</p>
      
      <div class="info-box">
        <p>
          This visualization shows how the impact of different scenarios changes across rainfall event severities, using average values.
          The chart displays percentage changes relative to current conditions, highlighting how climate change and land use 
          strategies affect water outflows differently across event scales.
        </p>
      </div>
      
      <div class="chart-container">
        <canvas id="trendChart"></canvas>
      </div>
===
    </search>
    <content>
===
    <!-- Trend Analysis Tab (Chart.js) -->
    <div id="trends" class="tab-content">
      <h2>Trend Analysis: Scenario Changes Across Events</h2>
      <p class="subtitle">Showing percentage change from current conditions (based on averages)</p>
      
      <div class="plot-description">
        This visualization shows how the impact of different scenarios changes across rainfall event severities, using average values.
        The chart displays percentage changes relative to current conditions, highlighting how climate change and land use 
        strategies affect water outflows differently across event scales. For more extreme events (like the 200-year storm), 
        the differences between scenarios are smaller, whereas for the 2-year storm, replanting yields a larger relative 
        reduction in outflow and urbanization shows a slight increase.
      </div>
      
      <p class="data-source-note">Source: Calculated from summary values representing multiple return periods</p>
      
      <div class="chart-container">
        <canvas id="trendChart"></canvas>
      </div>
===
    </content>
  </change>
  
  <change>
    <description>Add plot descriptions to the distribution tab</description>
    <search>
===
    <!-- Distribution Analysis Tab (React/Recharts) -->
    <div id="distribution" class="tab-content">
      <!-- React component will render here -->
      <div id="distributionReactRoot"></div> 
    </div>
===
    </search>
    <content>
===
    <!-- Distribution Analysis Tab (React/Recharts) -->
    <div id="distribution" class="tab-content">
      <h2>Distribution Analysis</h2>
      <p class="subtitle">Statistical distribution across 100 samples</p>
      
      <div class="plot-description">
        This visualization illustrates the <b>uncertainty</b> in the model simulations for different scenarios. 
        Each scenario (Current, 2050 Baseline, Urban, Replant) shows results from 100 simulation runs. 
        The charts display the statistical distribution (min, max, quartiles, median, average) of outflow values 
        for both low and peak events, helping to understand not just the average effects but the range of 
        possible outcomes under different climate and land-use scenarios.
      </div>
      
      <p class="data-source-note">Source: Full 100 samples from the uncertainty model runs</p>
      
      <!-- React component will render here -->
      <div id="distributionReactRoot"></div> 
    </div>
===
    </content>
  </change>
  
  <change>
    <description>Add section dividers between tabs for better visual separation</description>
    <search>
===
      <div class="grid" style="margin-top: 2rem;">
        <div class="card">
          <h3>Key Observations (Based on Averages)</h3>
===
    </search>
    <content>
===
      <hr class="section-divider">
      
      <div class="grid" style="margin-top: 2rem;">
        <div class="card">
          <h3>Key Observations (Based on Averages)</h3>
===
    </content>
  </change>
</file>
