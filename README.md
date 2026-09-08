# SoilGuard Insights

Build a beautiful, modern, fully responsive web application called “SoilGuard” — an AI-powered smart agriculture and soil-health monitoring platform.

PROJECT CONCEPT:

SoilGuard helps farmers monitor field health, analyze soil properties, identify crop disease risks, use satellite indicators, view weather information, and receive AI-powered recommendations and action plans.

TAGLINE:

“Healthy Soil • Higher Yields”

DESIGN DIRECTION:

Create a premium SaaS dashboard that combines:

- Modern agricultural aesthetics

- AI/technology feel

- Clean professional UI

- Nature-inspired visuals

- Simple and easy-to-understand information for farmers

- Desktop-first dashboard with excellent mobile responsiveness

Do NOT make it look like a generic admin dashboard.

The interface should feel like a real commercial AgriTech product.

==================================================

BRAND COLOUR SYSTEM

==================================================

Use this exact colour palette:

Primary Deep Forest Green:

#075B45

Primary Green:

#168A4A

Fresh Leaf Green:

#45B649

Lime Green:

#8BD12B

Soft Mint:

#E8F6EE

Background:

#F7FAF8

White:

#FFFFFF

Text:

#102A24

Secondary Text:

#64756F

Soil Brown:

#79502E

Water Blue:

#1299D4

Sun Yellow:

#F9B51B

Risk Red:

#E53935

Primary gradient:

linear-gradient(135deg, #075B45, #168A4A, #45B649)

Use green primarily for healthy/positive states.

Use yellow for moderate warnings.

Use red only for high-risk alerts.

Use blue for water/rain/moisture information.

Use brown for soil-related information.

==================================================

LOGO

==================================================

Use the SoilGuard logo prominently.

The logo should communicate:

- Leaf

- Healthy soil

- Growing plant

- Agriculture

- Water

- Satellite/technology

- Sustainability

Brand name:

“SoilGuard”

Tagline:

“Healthy Soil • Higher Yields”

Place the logo in the sidebar and top navigation where appropriate.

==================================================

TECH STACK

==================================================

Use:

- React

- Vite

- JavaScript or TypeScript

- Tailwind CSS

- Lucide React icons

- Recharts for charts

- Leaflet or another suitable map library for the interactive field map

Create clean reusable components.

Organize the project professionally with components, pages, data, and utilities.

==================================================

MAIN APPLICATION LAYOUT

==================================================

Create a dashboard layout with:

LEFT SIDEBAR:

- SoilGuard logo

- Overview

- Field Map

- Analyze Soil

- Risk Intelligence

- Action Plan

- Reports

- Settings

At the bottom of sidebar:

“Better Soil

Greener Tomorrow”

Use icons beside every navigation item.

The selected navigation item should have a rounded green highlighted background.

TOP NAVBAR:

- SoilGuard logo/name

- Search bar:

  “Search fields, villages, or reports...”

- Location selector:

  “Maharashtra > Pune”

- Notification icon with notification badge

- User profile:

  “Ramesh Kumar”

  “Large Farmer”

- Profile dropdown

==================================================

OVERVIEW DASHBOARD

==================================================

Main heading:

“Good morning, Ramesh! ☀️”

Subtitle:

“Healthy soil today. A more productive tomorrow.”

Add a motivational quote:

“Better soil. Higher yields.

A greener India.”

Create summary cards:

1. Total Fields

   5

2. Healthy Fields

   3

3. At Risk

   1

4. High Risk

   1

5. AI Insights

   “Understand your soil better”

Cards should have:

- Rounded corners

- Subtle shadows

- Clean icons

- Small supporting text

- Hover animations

==================================================

WEATHER CARD

==================================================

Create a weather card for:

Pune, Maharashtra

Temperature:

28°C

Condition:

Partly Cloudy

Humidity:

72%

Rainfall (24h):

20 mm

Wind:

12 km/h

Also create a larger weather section:

Temperature:

27.8°C

Rainfall (30 days):

126 mm

Humidity:

72%

Wind Speed:

12 km/h

Use beautiful weather icons.

==================================================

FIELD SELECTION + MAP

==================================================

Create a large section called:

“Select Your Field”

Subtitle:

“Click 4 points on the map to mark your field, or use the draw tool.”

Add buttons:

- Draw Field

- Select Field

- Clear

Create an interactive satellite map.

The map should display:

- Satellite imagery

- Field boundaries

- Green polygon representing selected field

- Editable polygon points

- Search location box

- Zoom controls

- Current-location control

- Satellite / Map toggle

Selected field:

Area:

2.84 hectares

Area in square meters:

28,400 m²

Center:

18.5204° N

73.8567° E

Show four corner coordinates.

Create a floating label on the map:

“Selected Field

2.84 ha”

Add:

“Field Boundary”

“Drag points to edit”

==================================================

FIELD DETAILS PANEL

==================================================

Beside the map create:

“Field Details”

Status:

“Field Selected”

Area:

2.84 hectares

Center:

18.5204° N

73.8567° E

Corner Coordinates:

1. 18.5211° N, 73.8559° E

2. 18.5213° N, 73.8574° E

3. 18.5198° N, 73.8576° E

4. 18.5196° N, 73.8560° E

Add:

“View GeoJSON”

Primary CTA:

“Analyze This Field →”

When clicked, show an analysis loading state and then display soil/field insights.

==================================================

OVERALL FIELD HEALTH

==================================================

Create a large circular/donut health gauge.

Score:

68 / 100

Status:

“Moderate Risk”

Description:

“Risk of soil-borne diseases is moderate.

Take preventive measures.”

Create a “Satellite Indicators” panel:

NDVI:

0.62 — Good

NDMI:

0.41 — Moderate

NDRE:

0.58 — Good

Vegetation Health:

Good

Moisture Indicator:

Moderate

Last Satellite Image:

4 Sep 2025

Use visually clear progress indicators.

==================================================

DISEASE PROBABILITY

==================================================

Create a section:

“Disease Probability”

“AI Model”

Include:

Fusarium Wilt

72%

High

Rhizoctonia (Root Rot)

54%

Medium

Pythium (Damping Off)

28%

Low

Nematodes

18%

Low

Use horizontal progress bars.

Use:

- Red = High

- Yellow = Medium

- Green = Low

Add:

“View Details →”

==================================================

SOIL PROPERTIES

==================================================

Create a clean data card:

“Soil Properties”

Source:

“SoilGrids”

Display:

pH

6.8

Organic Carbon

0.5%

Clay

22%

Sand

48%

Silt

30%

Use small icons and visual indicators.

==================================================

QUICK ACTIONS

==================================================

Create a “Quick Actions” section containing:

View Action Plan

Download Report

Compare Fields

Each should look like an interactive card/button.

==================================================

AI INSIGHTS

==================================================

Create an AI-powered section that provides understandable recommendations.

Example:

“AI Insight”

“Your field has moderate soil-health risk. Moisture levels are slightly elevated and Fusarium Wilt probability is high.”

Recommendations:

1. Improve field drainage.

2. Avoid excessive irrigation.

3. Monitor affected plants for early symptoms.

4. Consider preventive soil treatment.

5. Recheck field conditions within 7 days.

Add a button:

“Generate Detailed AI Report”

Include a subtle AI animation/loading state.

==================================================

RISK INTELLIGENCE PAGE

==================================================

Create a separate page for Risk Intelligence.

Display:

- Overall risk score

- Disease probabilities

- Soil moisture risk

- Nutrient risk

- Weather risk

- Historical risk trends

Create charts using Recharts.

Include filters:

- 7 Days

- 30 Days

- 3 Months

- 1 Year

==================================================

ANALYZE SOIL PAGE

==================================================

Create a beautiful soil analysis interface.

Allow the user to enter/upload:

- Soil pH

- Nitrogen

- Phosphorus

- Potassium

- Organic Carbon

- Moisture

- Temperature

Display:

- Soil Health Score

- Nutrient status

- Soil quality classification

- AI recommendations

Use visual gauges and charts.

==================================================

ACTION PLAN PAGE

==================================================

Create an actionable farming plan.

Example:

TODAY

✓ Check soil moisture

✓ Inspect crop roots

NEXT 3 DAYS

⚠ Improve drainage

⚠ Monitor disease symptoms

NEXT 7 DAYS

✓ Recheck soil conditions

✓ Update field analysis

NEXT 30 DAYS

✓ Compare soil health

✓ Review crop performance

Use green checkmarks, yellow warnings, and red urgent actions.

==================================================

REPORTS PAGE

==================================================

Create a professional reports dashboard.

Include:

- Soil Health Report

- Field Analysis Report

- Disease Risk Report

- Monthly Field Report

Buttons:

- View

- Download PDF

- Share

Add report history with dates.

==================================================

FIELD COMPARISON

==================================================

Allow farmers to compare multiple fields.

Example:

Field A

Health Score: 82

Field B

Health Score: 68

Field C

Health Score: 74

Use bar charts and comparison cards.

==================================================

SETTINGS PAGE

==================================================

Include:

- Profile

- Farm Information

- Notification Settings

- Language

- Units

- Data Preferences

- Logout

==================================================

INTERACTIONS

==================================================

Make the website functional, not just static.

Implement:

- Sidebar navigation

- Page routing

- Search interaction

- Field selection

- Map interactions

- Draw/edit field polygon

- Analyze button

- AI loading animation

- Notification dropdown

- User profile dropdown

- Date filters

- Report buttons

- Responsive mobile navigation

- Toast notifications

- Hover effects

- Smooth transitions

Use realistic mock data where backend/API data is unavailable.

==================================================

MAP FUNCTIONALITY

==================================================

The field map is one of the most important parts of the project.

Implement:

- Polygon drawing

- Polygon editing

- Area calculation

- Coordinate display

- Satellite/map layer switch

- Location search

- Zoom controls

When a field is selected, automatically update:

- Area

- Center coordinates

- Field health

- Soil properties

- Disease probability

- Satellite indicators

==================================================

DESIGN DETAILS

==================================================

Use:

- Large rounded cards

- 16–24px border radius

- Very subtle shadows

- Lots of whitespace

- Clean typography

- Professional iconography

- Soft green backgrounds

- Minimal gradients

- Smooth hover transitions

- Micro animations

Avoid:

- Excessive gradients

- Neon colours

- Clutter

- Tiny text

- Too many borders

- Generic Bootstrap-looking components

- Excessive glassmorphism

The dashboard should feel similar to a premium modern SaaS product while maintaining an agricultural identity.

==================================================

RESPONSIVE DESIGN

==================================================

Desktop:

- Fixed sidebar

- Spacious dashboard

- Two/three-column card layout

Tablet:

- Collapsible sidebar

- Responsive cards

Mobile:

- Bottom navigation or hamburger menu

- Single-column layout

- Touch-friendly buttons

- Map should remain usable

- Cards should stack cleanly

==================================================

ACCESSIBILITY

==================================================

Use:

- Semantic HTML

- Accessible buttons

- Proper labels

- Keyboard navigation

- Good contrast

- ARIA labels where required

==================================================

FINAL QUALITY REQUIREMENTS

==================================================

The final website must look like a polished hackathon-winning AgriTech product.

Prioritize:

1. Excellent visual design

2. Clear user experience

3. Interactive field map

4. AI-powered soil insights

5. Disease-risk visualization

6. Professional charts

7. Responsive design

8. Consistent SoilGuard branding

Make the first screen visually impressive enough for a hackathon demo.

The user should immediately understand:

“Select my field → Analyze my soil → Understand the risk → Get an action plan.”

Use realistic agricultural data and make every major button/interaction demonstrable during a hackathon presentation. the attached image is wireframe of our project

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/55b6a8c2-f17c-4b16-bff3-5645e5d63d36).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
