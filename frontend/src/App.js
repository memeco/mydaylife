import React, { useState, useEffect } from "react";
import "./App.css";

const App = () => {
  const [anniversaryData, setAnniversaryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const formatDate = (date) => {
    const month = months[date.getMonth()];
    const day = date.getDate();
    return { month, day };
  };

  const fetchAnniversaries = async (date) => {
    setLoading(true);
    setError(null);
    
    try {
      const { month, day } = formatDate(date);
      const url = `https://en.wikipedia.org/w/api.php`;
      const params = new URLSearchParams({
        action: 'query',
        format: 'json',
        prop: 'extracts',
        titles: `Wikipedia:Selected_anniversaries/${month}_${day}`,
        origin: '*'
      });

      const response = await fetch(`${url}?${params}`);
      const data = await response.json();
      
      const pages = data.query.pages;
      const pageId = Object.keys(pages)[0];
      
      if (pages[pageId].extract) {
        setAnniversaryData(pages[pageId].extract);
      } else {
        setError('No data found for this date');
      }
    } catch (err) {
      setError('Failed to fetch anniversary data');
      console.error('Error fetching anniversaries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnniversaries(currentDate);
  }, [currentDate]);

  const parseAnniversaryContent = (htmlContent) => {
    if (!htmlContent) return { events: [], births: [], deaths: [] };
    
    // Create a temporary div to parse HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    
    const events = [];
    const births = [];
    const deaths = [];
    
    // Find all list items
    const listItems = tempDiv.querySelectorAll('li');
    
    listItems.forEach(item => {
      const text = item.textContent.trim();
      if (text) {
        // Look for years at the beginning to categorize as events
        if (/^\d{1,4}/.test(text)) {
          events.push(text);
        }
        // Check if it's in a births section context
        else if (item.closest('ul')?.previousElementSibling?.textContent?.toLowerCase().includes('birth')) {
          births.push(text);
        }
        // Check if it's in a deaths section context  
        else if (item.closest('ul')?.previousElementSibling?.textContent?.toLowerCase().includes('death')) {
          deaths.push(text);
        }
        // Default to events if unclear
        else {
          events.push(text);
        }
      }
    });
    
    return { events, births, deaths };
  };

  const { events, births, deaths } = anniversaryData ? parseAnniversaryContent(anniversaryData) : { events: [], births: [], deaths: [] };

  const handleDateChange = (e) => {
    const selectedDate = new Date(e.target.value);
    setCurrentDate(selectedDate);
  };

  const todayString = currentDate.toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-lg border-b-4 border-indigo-500">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-800 mb-4">
              🎂 Today in History 📚
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              Discover fascinating birthdays and historical events
            </p>
            
            {/* Date Picker */}
            <div className="flex justify-center items-center space-x-4">
              <label htmlFor="date-picker" className="text-lg font-medium text-gray-700">
                Select Date:
              </label>
              <input
                id="date-picker"
                type="date"
                value={todayString}
                onChange={handleDateChange}
                className="px-4 py-2 border-2 border-indigo-300 rounded-lg text-lg focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
            
            <h2 className="text-3xl font-semibold text-indigo-600 mt-4">
              {months[currentDate.getMonth()]} {currentDate.getDate()}, {currentDate.getFullYear()}
            </h2>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        {loading && (
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-500 mx-auto"></div>
            <p className="mt-4 text-xl text-gray-600">Loading historical data...</p>
          </div>
        )}

        {error && (
          <div className="text-center bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
            <p className="text-xl">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Historical Events */}
            <div className="bg-white rounded-xl shadow-xl overflow-hidden border-t-4 border-blue-500">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6">
                <div className="flex items-center space-x-3">
                  <img 
                    src="https://images.unsplash.com/photo-1479142506502-19b3a3b7ff33" 
                    alt="Historical books"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <h3 className="text-2xl font-bold text-white">📜 Historical Events</h3>
                </div>
              </div>
              <div className="p-6 max-h-96 overflow-y-auto">
                {events.length > 0 ? (
                  <ul className="space-y-4">
                    {events.slice(0, 10).map((event, index) => (
                      <li key={index} className="border-l-4 border-blue-200 pl-4 py-2">
                        <p className="text-gray-700 leading-relaxed">{event}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 italic">No historical events found for this date.</p>
                )}
              </div>
            </div>

            {/* Famous Birthdays */}
            <div className="bg-white rounded-xl shadow-xl overflow-hidden border-t-4 border-pink-500">
              <div className="bg-gradient-to-r from-pink-500 to-pink-600 p-6">
                <div className="flex items-center space-x-3">
                  <img 
                    src="https://images.unsplash.com/photo-1530103862676-de8c9debad1d" 
                    alt="Birthday celebration"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <h3 className="text-2xl font-bold text-white">🎉 Famous Birthdays</h3>
                </div>
              </div>
              <div className="p-6 max-h-96 overflow-y-auto">
                {births.length > 0 ? (
                  <ul className="space-y-4">
                    {births.slice(0, 10).map((birth, index) => (
                      <li key={index} className="border-l-4 border-pink-200 pl-4 py-2">
                        <p className="text-gray-700 leading-relaxed">{birth}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 italic">No famous birthdays found for this date.</p>
                )}
              </div>
            </div>

            {/* Notable Deaths */}
            <div className="bg-white rounded-xl shadow-xl overflow-hidden border-t-4 border-gray-500">
              <div className="bg-gradient-to-r from-gray-500 to-gray-600 p-6">
                <div className="flex items-center space-x-3">
                  <img 
                    src="https://images.unsplash.com/photo-1461360370896-922624d12aa1" 
                    alt="Historical memories"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <h3 className="text-2xl font-bold text-white">🕊️ Notable Deaths</h3>
                </div>
              </div>
              <div className="p-6 max-h-96 overflow-y-auto">
                {deaths.length > 0 ? (
                  <ul className="space-y-4">
                    {deaths.slice(0, 10).map((death, index) => (
                      <li key={index} className="border-l-4 border-gray-200 pl-4 py-2">
                        <p className="text-gray-700 leading-relaxed">{death}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 italic">No notable deaths found for this date.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Fun Fact Section */}
        {!loading && !error && (
          <div className="mt-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-xl overflow-hidden">
            <div className="p-8 text-center">
              <img 
                src="https://images.pexels.com/photos/820735/pexels-photo-820735.jpeg" 
                alt="Time and history"
                className="w-20 h-20 rounded-full mx-auto mb-4 object-cover border-4 border-white"
              />
              <h3 className="text-3xl font-bold text-white mb-4">✨ Did You Know?</h3>
              <p className="text-xl text-indigo-100 leading-relaxed max-w-4xl mx-auto">
                History is full of fascinating coincidences and remarkable events. Every day has witnessed 
                incredible achievements, groundbreaking discoveries, and the birth of extraordinary individuals 
                who shaped our world. Explore any date to uncover the amazing stories that make each day special!
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="container mx-auto px-6 text-center">
          <p className="text-lg">
            📚 Powered by Wikipedia's historical archives
          </p>
          <p className="text-gray-400 mt-2">
            Discover something new every day
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;