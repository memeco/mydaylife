import React, { useState, useEffect } from "react";
import "./App.css";

const App = () => {
  const [data, setData] = useState({
    events: [],
    births: [],
    deaths: [],
    holidays: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  const formatDateForAPI = (date) => {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return { month, day };
  };

  const fetchWikimediaData = async (endpoint, month, day) => {
    try {
      const response = await fetch(
        `https://api.wikimedia.org/feed/v1/wikipedia/en/onthisday/${endpoint}/${month}/${day}`,
        {
          headers: {
            'User-Agent': 'BirthdayHistoryApp/1.0',
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch ${endpoint}`);
      }
      
      const data = await response.json();
      return data[endpoint] || [];
    } catch (err) {
      console.error(`Error fetching ${endpoint}:`, err);
      return [];
    }
  };

  const fetchAllData = async (date) => {
    setLoading(true);
    setError(null);
    
    try {
      const { month, day } = formatDateForAPI(date);
      
      const [events, births, deaths, holidays] = await Promise.all([
        fetchWikimediaData('events', month, day),
        fetchWikimediaData('births', month, day),
        fetchWikimediaData('deaths', month, day),
        fetchWikimediaData('holidays', month, day)
      ]);

      setData({
        events: events.slice(0, 15), // Limit to 15 items
        births: births.slice(0, 15),
        deaths: deaths.slice(0, 15),
        holidays: holidays.slice(0, 10)
      });
    } catch (err) {
      setError('Failed to fetch historical data');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData(currentDate);
  }, [currentDate]);

  const handleDateChange = (e) => {
    const selectedDate = new Date(e.target.value);
    setCurrentDate(selectedDate);
  };

  const formatEventText = (item) => {
    if (item.text) {
      return item.text;
    }
    if (item.extract) {
      return item.extract;
    }
    return item.description || 'No description available';
  };

  const getEventYear = (item) => {
    return item.year || 'Unknown year';
  };

  const todayString = currentDate.toISOString().split('T')[0];
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

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
              Discover fascinating birthdays, events, and celebrations throughout history
            </p>
            
            {/* Date Picker */}
            <div className="flex justify-center items-center space-x-4 mb-4">
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
            
            <h2 className="text-3xl font-semibold text-indigo-600">
              {monthNames[currentDate.getMonth()]} {currentDate.getDate()}, {currentDate.getFullYear()}
            </h2>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        {loading && (
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-500 mx-auto"></div>
            <p className="mt-4 text-xl text-gray-600">Loading historical data from Wikipedia...</p>
          </div>
        )}

        {error && (
          <div className="text-center bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-8">
            <p className="text-xl">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Holidays Section */}
            {data.holidays.length > 0 && (
              <div className="mb-8">
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl shadow-xl overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center justify-center space-x-3 mb-4">
                      <span className="text-4xl">🎉</span>
                      <h3 className="text-2xl font-bold text-white">Holidays & Celebrations</h3>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {data.holidays.map((holiday, index) => (
                        <div key={index} className="bg-white bg-opacity-20 rounded-lg p-4">
                          <p className="text-white font-medium text-center">
                            {formatEventText(holiday)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Main Grid */}
            <div className="grid lg:grid-cols-3 gap-8">
              
              {/* Historical Events */}
              <div className="bg-white rounded-xl shadow-xl overflow-hidden border-t-4 border-blue-500">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6">
                  <div className="flex items-center space-x-3">
                    <img 
                      src="https://images.unsplash.com/photo-1479142506502-19b3a3b7ff33" 
                      alt="Historical books"
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="text-2xl font-bold text-white">📜 Historical Events</h3>
                      <p className="text-blue-100">({data.events.length} events)</p>
                    </div>
                  </div>
                </div>
                <div className="p-6 max-h-96 overflow-y-auto">
                  {data.events.length > 0 ? (
                    <div className="space-y-4">
                      {data.events.map((event, index) => (
                        <div key={index} className="border-l-4 border-blue-200 pl-4 py-3 hover:bg-blue-50 transition-colors">
                          <div className="flex items-start space-x-3">
                            <span className="text-blue-600 font-bold text-lg min-w-fit">
                              {getEventYear(event)}
                            </span>
                            <p className="text-gray-700 leading-relaxed">
                              {formatEventText(event)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic text-center">No historical events found for this date.</p>
                  )}
                </div>
              </div>

              {/* Famous Births */}
              <div className="bg-white rounded-xl shadow-xl overflow-hidden border-t-4 border-pink-500">
                <div className="bg-gradient-to-r from-pink-500 to-pink-600 p-6">
                  <div className="flex items-center space-x-3">
                    <img 
                      src="https://images.unsplash.com/photo-1530103862676-de8c9debad1d" 
                      alt="Birthday celebration"
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="text-2xl font-bold text-white">🎂 Famous Births</h3>
                      <p className="text-pink-100">({data.births.length} births)</p>
                    </div>
                  </div>
                </div>
                <div className="p-6 max-h-96 overflow-y-auto">
                  {data.births.length > 0 ? (
                    <div className="space-y-4">
                      {data.births.map((birth, index) => (
                        <div key={index} className="border-l-4 border-pink-200 pl-4 py-3 hover:bg-pink-50 transition-colors">
                          <div className="flex items-start space-x-3">
                            <span className="text-pink-600 font-bold text-lg min-w-fit">
                              {getEventYear(birth)}
                            </span>
                            <p className="text-gray-700 leading-relaxed">
                              {formatEventText(birth)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic text-center">No famous births found for this date.</p>
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
                    <div>
                      <h3 className="text-2xl font-bold text-white">🕊️ Notable Deaths</h3>
                      <p className="text-gray-100">({data.deaths.length} deaths)</p>
                    </div>
                  </div>
                </div>
                <div className="p-6 max-h-96 overflow-y-auto">
                  {data.deaths.length > 0 ? (
                    <div className="space-y-4">
                      {data.deaths.map((death, index) => (
                        <div key={index} className="border-l-4 border-gray-200 pl-4 py-3 hover:bg-gray-50 transition-colors">
                          <div className="flex items-start space-x-3">
                            <span className="text-gray-600 font-bold text-lg min-w-fit">
                              {getEventYear(death)}
                            </span>
                            <p className="text-gray-700 leading-relaxed">
                              {formatEventText(death)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic text-center">No notable deaths found for this date.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Fun Fact Section */}
            <div className="mt-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-xl overflow-hidden">
              <div className="p-8 text-center">
                <img 
                  src="https://images.pexels.com/photos/820735/pexels-photo-820735.jpeg" 
                  alt="Time and history"
                  className="w-20 h-20 rounded-full mx-auto mb-4 object-cover border-4 border-white"
                />
                <h3 className="text-3xl font-bold text-white mb-4">✨ Powered by Wikipedia</h3>
                <p className="text-xl text-indigo-100 leading-relaxed max-w-4xl mx-auto">
                  Explore the rich tapestry of history with real data from Wikipedia's comprehensive archives. 
                  Every day has witnessed remarkable events, extraordinary births, and notable passings that 
                  shaped our world. Discover the stories that make each day in history unique and fascinating!
                </p>
                <div className="mt-6 flex justify-center space-x-8 text-white">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{data.events.length}</div>
                    <div className="text-indigo-200">Events</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{data.births.length}</div>
                    <div className="text-indigo-200">Births</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{data.deaths.length}</div>
                    <div className="text-indigo-200">Deaths</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{data.holidays.length}</div>
                    <div className="text-indigo-200">Holidays</div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="container mx-auto px-6 text-center">
          <p className="text-lg">
            📚 Powered by Wikimedia Foundation APIs
          </p>
          <p className="text-gray-400 mt-2">
            Discover something amazing every day in history
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;