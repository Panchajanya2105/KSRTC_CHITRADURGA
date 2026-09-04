import { Bus, StationInfo } from '../types/bus';

export function downloadSearchResultsAsPDF(
  buses: Bus[],
  stationInfo: StationInfo,
  searchQuery: string = ''
) {
  const title = searchQuery
    ? `${stationInfo.label} — Search Results for "${searchQuery}"`
    : `${stationInfo.label} — Complete Departure Timetable`;

  const dateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Construct printable HTML document
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const tableRows = buses.map((bus, index) => `
    <tr style="background-color: ${index % 2 === 0 ? '#f8fafc' : '#ffffff'};">
      <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: bold; font-family: monospace; font-size: 14px;">${bus.time}</td>
      <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: bold;">${bus.from || stationInfo.label.split(' ')[0]}</td>
      <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: bold; color: #c8102e;">${bus.destination}</td>
      <td style="padding: 10px; border: 1px solid #e2e8f0;">${bus.service || 'Express'}</td>
      <td style="padding: 10px; border: 1px solid #e2e8f0; color: #475569;">${bus.via || '—'}</td>
    </tr>
  `).join('');

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 30px; color: #0f172a; }
          .header { border-bottom: 3px solid #c8102e; padding-bottom: 15px; margin-bottom: 20px; }
          .title { font-size: 24px; font-weight: bold; color: #c8102e; margin: 0; }
          .subtitle { font-size: 14px; color: #64748b; margin-top: 5px; }
          .badge { display: inline-block; background-color: #fee2e2; color: #991b1b; padding: 4px 10px; border-radius: 12px; font-size: 12px; font-weight: bold; }
          table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 13px; }
          th { background-color: #0f172a; color: white; padding: 12px; text-align: left; border: 1px solid #0f172a; text-transform: uppercase; font-size: 11px; letter-spacing: 0.5px; }
          .footer { margin-top: 30px; padding-top: 15px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8; text-align: center; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1 class="title">KSRTC Chitradurga Division</h1>
          <div class="subtitle">${title}</div>
          <p style="margin-top: 10px; font-size: 12px;"><strong>Date:</strong> ${dateStr} &nbsp;|&nbsp; <strong>Total Buses:</strong> <span class="badge">${buses.length} Scheduled</span></p>
        </div>

        <table>
          <thead>
            <tr>
              <th>Departure Time</th>
              <th>Origin (From)</th>
              <th>Destination (To)</th>
              <th>Service Category</th>
              <th>Via Stops</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>

        <div class="footer">
          Generated from KSRTC Chitradurga Division Bus Timetable • ${dateStr}
        </div>

        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();
}

export async function shareSearchResults(
  buses: Bus[],
  stationInfo: StationInfo,
  searchQuery: string = ''
) {
  const topBuses = buses.slice(0, 8);
  const busText = topBuses
    ? topBuses.map(b => `• ${b.time} | ${b.from || stationInfo.label.split(' ')[0]} ➔ ${b.destination} (${b.service || 'Express'}${b.via ? ' via ' + b.via : ''})`).join('\n')
    : '';

  const title = searchQuery
    ? `KSRTC Timetable: ${searchQuery} from ${stationInfo.label}`
    : `KSRTC ${stationInfo.label} Departure Timetable`;

  const shareText = `🚌 ${title} (${buses.length} buses found):\n\n${busText}\n\nView complete schedules on KSRTC Chitradurga Division Portal.`;

  if (navigator.share) {
    try {
      await navigator.share({
        title: title,
        text: shareText,
      });
    } catch (err) {
      console.log('Share cancelled or not supported:', err);
    }
  } else {
    navigator.clipboard.writeText(shareText);
    alert('Search timetable summary copied to clipboard!');
  }
}
