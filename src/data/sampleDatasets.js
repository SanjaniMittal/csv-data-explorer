// Sample datasets for instant 1-click exploration
export const SAMPLE_DATASETS = [
  {
    id: "tech-sales",
    title: "Global Tech & Retail Sales",
    badge: "E-Commerce",
    description: "Multi-regional sales metrics with revenue, profit margins, categories, and order statuses.",
    filename: "global_tech_sales_2024.csv",
    csv: `Order_ID,Date,Product_Category,Region,Customer_Segment,Units_Sold,Unit_Price,Revenue,Profit,Status
ORD-1001,2024-01-15,Laptops,North America,Enterprise,24,1200,28800,7200,Completed
ORD-1002,2024-01-18,Smartphones,Europe,Consumer,65,750,48750,14625,Completed
ORD-1003,2024-01-20,Monitors,Asia Pacific,Small Business,42,320,13440,3360,Completed
ORD-1004,2024-01-22,Accessories,North America,Consumer,180,45,8100,3240,Delivered
ORD-1005,2024-01-25,Tablets,Europe,Enterprise,38,620,23560,5890,Pending
ORD-1006,2024-02-02,Smartphones,Latin America,Consumer,50,690,34500,8625,Completed
ORD-1007,2024-02-05,Laptops,Asia Pacific,Enterprise,30,1350,40500,10125,Completed
ORD-1008,2024-02-09,Accessories,Europe,Small Business,210,35,7350,2940,Delivered
ORD-1009,2024-02-14,Monitors,North America,Enterprise,55,380,20900,5225,Completed
ORD-1010,2024-02-18,Tablets,Asia Pacific,Consumer,48,580,27840,6960,Shipped
ORD-1011,2024-02-23,Smartphones,North America,Enterprise,72,820,59040,17712,Completed
ORD-1012,2024-02-28,Laptops,Europe,Consumer,18,1150,20700,5175,Cancelled
ORD-1013,2024-03-03,Accessories,Asia Pacific,Enterprise,140,55,7700,3080,Completed
ORD-1014,2024-03-07,Monitors,Latin America,Consumer,28,340,9520,2380,Delivered
ORD-1015,2024-03-12,Tablets,North America,Small Business,62,540,33480,8370,Completed
ORD-1016,2024-03-16,Smartphones,Asia Pacific,Consumer,95,780,74100,22230,Completed
ORD-1017,2024-03-20,Laptops,Latin America,Enterprise,15,1400,21000,5250,Shipped
ORD-1018,2024-03-24,Monitors,Europe,Small Business,34,390,13260,3315,Completed
ORD-1019,2024-03-28,Accessories,Latin America,Consumer,125,40,5000,2000,Completed
ORD-1020,2024-04-02,Tablets,Europe,Enterprise,45,610,27450,6862,Completed
ORD-1021,2024-04-07,Smartphones,Europe,Small Business,58,740,42920,12876,Shipped
ORD-1022,2024-04-12,Laptops,North America,Consumer,22,1280,28160,7040,Completed
ORD-1023,2024-04-18,Accessories,Asia Pacific,Consumer,190,48,9120,3648,Delivered
ORD-1024,2024-04-22,Monitors,North America,Small Business,40,360,14400,3600,Completed
ORD-1025,2024-04-27,Tablets,Latin America,Consumer,35,530,18550,4637,Completed`
  },
  {
    id: "hr-directory",
    title: "Employee Directory & Compensation",
    badge: "Human Resources",
    description: "Employee records with departments, roles, salaries, experience, ratings, and work modes.",
    filename: "company_hr_workforce.csv",
    csv: `Employee_ID,Name,Department,Role,Experience_Years,Salary,Performance_Rating,Remote_Status,City
EMP-201,Sarah Jenkins,Engineering,Lead Architect,9,145000,4.9,Hybrid,San Francisco
EMP-202,Marcus Chen,Engineering,Senior Backend Dev,6,122000,4.7,Remote,Seattle
EMP-203,Elena Rostova,Design,UX Director,8,138000,4.8,Hybrid,New York
EMP-204,David Miller,Marketing,Growth Strategist,4,88000,4.3,On-Site,Austin
EMP-205,Amina Diallo,Engineering,DevOps Engineer,5,115000,4.6,Remote,Chicago
EMP-206,Liam O'Connor,Sales,Enterprise Account Exec,7,128000,4.5,Hybrid,New York
EMP-207,Priya Patel,Product,Senior Product Manager,8,142000,4.9,Hybrid,San Francisco
EMP-208,Carlos Mendez,Design,UI Designer,3,76000,4.2,Remote,Denver
EMP-209,Hannah Becker,Marketing,Content Lead,5,92000,4.4,Remote,Seattle
EMP-210,Kenji Takahashi,Engineering,Frontend Engineer,4,105000,4.5,Hybrid,Austin
EMP-211,Rachel Green,Operations,Ops Specialist,3,68000,4.1,On-Site,Chicago
EMP-212,Alex Rivera,Sales,SDR Manager,6,98000,4.4,On-Site,Austin
EMP-213,Sophie Martin,Product,Product Analyst,2,72000,4.0,Remote,Denver
EMP-214,Tariq Al-Mansoor,Engineering,Security Engineer,7,134000,4.8,Hybrid,San Francisco
EMP-215,Jessica Taylor,Marketing,Brand Director,10,146000,4.7,Hybrid,New York
EMP-216,Zackary Brooks,Engineering,QA Automation,4,94000,4.3,Remote,Chicago
EMP-217,Maya Lin,Design,Design Researcher,5,89000,4.6,Remote,Seattle
EMP-218,Samuel Jackson,Sales,VP of Sales,12,185000,4.8,Hybrid,San Francisco
EMP-219,Chloe Dubois,Operations,HR Manager,6,95000,4.5,On-Site,Austin
EMP-220,Daniel Wu,Engineering,Data Scientist,5,126000,4.7,Hybrid,New York`
  },
  {
    id: "weather-sustainability",
    title: "Global Cities Climate & Sustainability",
    badge: "Environment",
    description: "Global metropolitan environmental metrics including AQI, temperature, and renewable energy adoption.",
    filename: "global_climate_sustainability.csv",
    csv: `City,Country,Region,Avg_Temp_C,Humidity_Pct,Air_Quality_Index,Wind_Speed_KmH,Renewable_Energy_Pct,Climate_Zone
Reykjavik,Iceland,Europe,5.2,78,14,24.5,99.2,Subpolar
Stockholm,Sweden,Europe,8.4,72,21,15.2,64.8,Temperate
Tokyo,Japan,Asia,16.8,66,48,12.4,22.4,Subtropical
Singapore,Singapore,Asia,28.6,82,55,8.6,12.1,Tropical
Copenhagen,Denmark,Europe,9.1,75,18,18.0,72.5,Temperate
Sydney,Australia,Oceania,19.4,62,28,16.8,38.9,Temperate
San Francisco,United States,North America,14.5,74,32,19.2,49.0,Mediterranean
Vancouver,Canada,North America,11.2,76,22,11.5,84.2,Temperate
Oslo,Norway,Europe,6.8,70,16,13.2,96.0,Temperate
Zurich,Switzerland,Europe,10.2,68,24,9.8,78.4,Temperate
Dubai,United Arab Emirates,Middle East,31.4,52,112,14.0,15.2,Arid
Santiago,Chile,South America,15.6,58,74,10.2,46.5,Mediterranean
Nairobi,Kenya,Africa,19.2,64,44,11.0,82.0,Tropical Highland
Seoul,South Korea,Asia,13.5,61,68,10.5,18.6,Temperate
Amsterdam,Netherlands,Europe,10.8,80,26,20.4,45.2,Temperate
London,United Kingdom,Europe,11.6,77,35,16.2,42.8,Temperate
Toronto,Canada,North America,9.8,69,38,14.8,39.6,Temperate
Cape Town,South Africa,Africa,17.2,67,31,21.0,28.5,Mediterranean
Munich,Germany,Europe,9.5,74,27,12.0,58.2,Temperate
Auckland,New Zealand,Oceania,16.1,79,19,17.4,81.0,Temperate`
  }
];
