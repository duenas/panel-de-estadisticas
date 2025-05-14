
Built by https://www.blackbox.ai

---

# Panel de Estadísticas

## Project Overview

Panel de Estadísticas is a web application that provides a user-friendly interface for viewing various statistics related to visits on a website. Utilizing interactive charts, users can explore total visits over time, visits by day, by country, by parameters, by hour, by device type, and by status. The application uses Tailwind CSS for styling and Chart.js for rendering charts.

## Installation

To run the Panel de Estadísticas locally, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/your_username/panel_estadisticas.git
   ```
2. Navigate into the project directory:
   ```bash
   cd panel_estadisticas
   ```
3. Start the proxy server:
   A Python script is included to act as a proxy server to fetch data from the API.

   ```bash
   python proxy.py
   ```
   The server will be running on `http://localhost:8000`.

4. Open the `index.html` file in your web browser to view the application.

## Usage

- Open the `index.html` file in your browser. 
- You will see a sidebar with navigation options. Click on any of the options to scroll to the respective section.
- Interact with the charts to analyze the statistics displayed.
- Make sure the Python proxy server is running to fetch the data correctly.

## Features

- **Total Visits**: View the total number of visits to the website.
- **Visits by Day**: Analyze the trends in visits on a day-to-day basis through a line chart.
- **Visits by Country**: Visualize the distribution of visitors based on their geographic location.
- **Visits by Parameter**: Understand visitor behavior based on different site parameters.
- **Visits by Hour**: Assess the number of visits during different hours of the day.
- **Visits by Device**: See statistics based on the type of device used by visitors.
- **Visits by Status**: View the visits filtered by their status code.

## Dependencies

The project utilizes the following dependencies, which are included via CDN in the `index.html` file:

- [Tailwind CSS](https://tailwindcss.com)
- [Chart.js](https://www.chartjs.org)
- [Font Awesome](https://fontawesome.com)

## Project Structure

```
/panel_estadisticas
│
├── index.html           # Main HTML file containing the application structure
├── proxy.py             # Python script acting as a proxy to fetch API data
└── js
    └── app.js           # JavaScript file for client-side functionality (optional, may need to create)
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

This project incorporates various open-source libraries and resources. We express our gratitude to the maintainers and contributors of these projects.