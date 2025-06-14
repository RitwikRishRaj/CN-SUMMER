import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay, parseISO, addMonths } from 'date-fns';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../styles/calender.css';
import NavBar from '../components/NavBar';
import AuroraBackground from '../components/AuroraBackground';
import { fetchEvents } from '../services/eventService';

// Set up the localizer for the calendar
const localizer = dateFnsLocalizer({
  format,
  parse: (dateString, formatString, locale) => {
    try {
      return parse(dateString, formatString, new Date(), { locale });
    } catch (e) {
      console.error('Error parsing date:', e);
      return new Date();
    }
  },
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
  getDay,
  locales: {},
});

const EventCalendar = () => {
  // State management - all hooks at the top level, no conditions
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const now = useMemo(() => new Date(), []);

  // Filter events to only show upcoming events
  const filteredEvents = useMemo(() => {
    return events.filter(event => new Date(event.end) >= now);
  }, [events, now]);

  // Get upcoming events for the sidebar - must be before any conditional returns
  const upcomingEvents = useMemo(() => {
    return [...filteredEvents]
      .filter(event => new Date(event.end) >= now)
      .sort((a, b) => new Date(a.start) - new Date(b.start))
      .slice(0, 5);
  }, [filteredEvents, now]);

  // Helper function to handle event clicks
  const handleEventClick = useCallback((event) => {
    if (event.link) {
      window.open(event.link, '_blank', 'noopener,noreferrer');
    }
  }, []);

  // Fetch contests when component mounts
  useEffect(() => {
    const getContests = async () => {
      try {
        setLoading(true);
        const contests = await fetchEvents();
        console.log('Fetched contests:', contests);
        
        // Transform contests to match the calendar event format
        const formattedEvents = contests.map(contest => ({
          // Handle different possible title fields from the API
          id: contest.id || Date.now() + Math.random().toString(36).substr(2, 9),
          title: contest.event || contest.name || contest.title || contest.contest_name || 'Untitled Event',
          start: new Date(contest.start),
          end: new Date(contest.end),
          platform: contest.resource?.name || contest.host || contest.platform || 'Contest',
          platformIcon: contest.resource?.icon || getPlatformIcon(contest.host || contest.platform) || 'https://via.placeholder.com/32',
          description: contest.host || contest.description || '',
          link: contest.href || contest.url || contest.link || '#',
          duration: contest.duration || (new Date(contest.end) - new Date(contest.start)) / 1000, // in seconds
          allDay: contest.duration > 86400 || (new Date(contest.end) - new Date(contest.start)) > 86400000 // > 24 hours
        }));
        
        setEvents(formattedEvents);
        setError(null);
      } catch (err) {
        console.error('Error fetching contests:', err);
        setError('Failed to load contests. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    getContests();
  }, []);
  
  // Helper function to get platform icon based on host
  const getPlatformIcon = (host) => {
    if (!host) return null;
    
    const hostLower = host.toLowerCase();
    
    // Check for known platforms and return their icons
    if (hostLower.includes('codeforces')) return 'https://codeforces.org/s/0/favicon-32x32.png';
    if (hostLower.includes('codechef')) return 'https://img.icons8.com/fluent/512/codechef.png';
    if (hostLower.includes('atcoder')) return 'https://img.atcoder.jp/assets/atcoder.png';
    if (hostLower.includes('leetcode')) return 'https://leetcode.com/favicon.ico';
    if (hostLower.includes('hackerrank')) return 'https://www.hackerrank.com/wp-content/uploads/2018/08/hackerrank_logo.png';
    if (hostLower.includes('geeksforgeeks')) return 'https://media.geeksforgeeks.org/gfg-gg-logo.svg';
    
    return null;
  };

  // Loading state with better visual feedback
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center p-6 bg-gray-900/80 rounded-lg max-w-md">
          <div className="flex justify-center mb-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
          <h2 className="text-xl font-semibold mb-2">Loading Contests</h2>
          <p className="text-gray-400">Fetching the latest coding competitions...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center p-6 bg-gray-900/80 rounded-lg max-w-md">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold mb-2">Error Loading Contests</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative">
      <AuroraBackground 
        colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
        blend={0.5}
        amplitude={0.5}
        speed={0.5}
        className="absolute inset-0 z-0"
      />
      <div className="relative z-10 min-h-screen flex flex-col">
        <NavBar />
        <main className="flex-1 pt-20">
          <div className="w-full max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Upcoming Events Sidebar - Wider */}
              <div className="lg:col-span-4 xl:col-span-3 order-1 lg:order-1">
                <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl border border-gray-700/50 shadow-2xl p-6 sticky top-28 flex flex-col" style={{ height: 'calc(100vh - 6rem)' }}>
                  <h2 className="text-xl font-bold mb-4">Upcoming Events</h2>
                  <div className="flex-1 overflow-hidden">
                    {upcomingEvents.length > 0 ? (
                      <div className="h-full overflow-y-auto pr-2 -mr-2 hover:pr-1 hover:-mr-1 transition-all scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent space-y-3">
                      {upcomingEvents.map(event => (
                        <div 
                          key={event.id}
                          onClick={() => handleEventClick(event)}
                          className="p-3 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 cursor-pointer transition-colors"
                        >
                          <div className="flex items-start gap-2">
                            {event.platformIcon && (
                              <img 
                                src={event.platformIcon} 
                                alt={event.platform} 
                                className="w-5 h-5 mt-0.5 rounded-sm flex-shrink-0"
                                onError={(e) => e.target.style.display = 'none'}
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-sm text-white truncate" title={event.title}>
                                {event.title}
                              </h3>
                              <div className="text-xs text-gray-400 mt-1">
                                <div>{format(new Date(event.start), 'MMM d, yyyy')}</div>
                                <div>{format(new Date(event.start), 'h:mm a')} - {format(new Date(event.end), 'h:mm a')}</div>
                              </div>
                              {event.platform && (
                                <div className="text-xs text-gray-500 mt-1">
                                  {event.platform}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                      </div>
                    ) : (
                      <div className="h-full flex items-center justify-center text-gray-400">
                        No upcoming events found
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Main Content - Adjusted width */}
              <div className="lg:col-span-8 xl:col-span-9 order-2 lg:order-2">
                <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl border border-gray-700/50 shadow-2xl p-6 h-full w-full">
                  <div className="bg-gray-900/80 rounded-lg p-4 h-full">
                    <Calendar
                      localizer={localizer}
                      events={filteredEvents}
                      startAccessor={event => new Date(event.start)}
                      endAccessor={event => new Date(event.end)}
                      style={{ 
                        flex: '1 1 auto', 
                        minHeight: '900px',
                        '--rbc-row-min-height': '120px'  // Increased from 100px
                      }}                      
                      className="bg-transparent text-white [&_.rbc-month-row]:min-h-[var(--rbc-row-min-height)]"
                      defaultView="month"
                      views={['month']}
                      dayPropGetter={(date) => {
                        // Get events for this date
                        const dateEvents = filteredEvents.filter(event => {
                          const eventDate = new Date(event.start);
                          return (
                            eventDate.getDate() === date.getDate() &&
                            eventDate.getMonth() === date.getMonth() &&
                            eventDate.getFullYear() === date.getFullYear()
                          );
                        });
                        
                        // If there are events, adjust row height
                        if (dateEvents.length > 0) {
                          return {
                            style: {
                              minHeight: '150px',  // Increased from 120px
                            },
                          };
                        }
                        return {};
                      }}
                      eventPropGetter={(event, start, end, isSelected) => {
                        const now = new Date();
                        const isPast = end < now;
                        const isHappeningNow = start <= now && end >= now;
                        const isLongEvent = event.duration > 86400;
                        
                        let backgroundColor = isPast 
                          ? 'rgba(82, 82, 91, 0.7)'  
                          : isHappeningNow
                            ? 'rgba(16, 185, 129, 0.8)'  
                            : 'rgba(59, 130, 246, 0.8)';  
                        
                        if (isLongEvent) {
                          backgroundColor = isPast 
                            ? 'rgba(113, 113, 122, 0.7)'  
                            : 'rgba(99, 102, 241, 0.8)';  
                        }
                        
                        return {
                          style: {
                            backgroundColor,
                            color: 'white',
                            borderRadius: '0.25rem',
                            border: 'none',
                            padding: '0.125rem 0.375rem',
                            fontSize: '0.8125rem',
                            lineHeight: '1.25',
                            cursor: 'pointer',
                            boxShadow: isSelected ? '0 0 0 1px white' : 'none',
                            opacity: isPast ? 0.7 : 1,
                            margin: '0.125rem 0.25rem',
                            height: 'auto',
                            minHeight: '1.5rem',
                            width: 'calc(100% - 0.5rem)',
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                            transition: 'all 0.2s ease',
                          },
                        };
                      }}
                      onSelectEvent={handleEventClick}
                      components={{
                        toolbar: (props) => (
                          <div className="rbc-toolbar mb-4 flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => props.onNavigate('PREV')}
                                className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-md text-sm font-medium transition-colors"
                              >
                                &larr; Previous
                              </button>
                              <button
                                onClick={() => props.onNavigate('TODAY')}
                                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded-md text-sm font-medium transition-colors"
                              >
                                Today
                              </button>
                              <button
                                onClick={() => props.onNavigate('NEXT')}
                                className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-md text-sm font-medium transition-colors"
                              >
                                Next &rarr;
                              </button>
                            </div>
                            <span className="text-lg font-semibold">
                              {format(props.date, 'MMMM yyyy')}
                            </span>
                            <div className="opacity-0 w-24">
                              {/* Empty div for spacing */}
                            </div>
                          </div>
                        ),
                        month: {
                          event: ({ event }) => (
                            <div className="p-0.5 h-auto min-h-[1.5rem] overflow-hidden">
                              <div className="flex items-center gap-1.5">
                                {event.platformIcon && (
                                  <img 
                                    src={event.platformIcon} 
                                    alt={event.platform} 
                                    className="w-3 h-3 rounded-sm flex-shrink-0"
                                    onError={(e) => e.target.style.display = 'none'}
                                  />
                                )}
                                <div className="text-xs font-medium truncate" title={event.title}>
                                  {event.title}
                                </div>
                              </div>
                            </div>
                          ),
                          date: (props) => {
                            // Get all events for this date
                            const dateEvents = filteredEvents.filter(event => {
                              const eventDate = new Date(event.start);
                              return (
                                eventDate.getDate() === props.date.getDate() &&
                                eventDate.getMonth() === props.date.getMonth() &&
                                eventDate.getFullYear() === props.date.getFullYear()
                              );
                            });

                            // Show up to 3 events in the cell, or more if there's space
                            const eventsToShow = dateEvents.slice(0, 5);  
                            const remainingEvents = dateEvents.length - eventsToShow.length;

                            return (
                              <div className="rbc-day-bg flex flex-col h-full">
                                {props.children[0]}
                                <div className="rbc-events-container flex-1 flex flex-col gap-0.5 overflow-y-auto">
                                  {eventsToShow.map((event, index) => (
                                    <div 
                                      key={event.id || index}
                                      className="rbc-event"
                                      onClick={() => handleEventClick(event)}
                                    >
                                      <div className="p-0.5 h-auto min-h-[1.5rem] overflow-hidden">
                                        <div className="flex items-center gap-1.5">
                                          <div className="flex-shrink-0">
                                            {event.platformIcon && (
                                              <img 
                                                src={event.platformIcon} 
                                                alt={event.platform} 
                                                className="w-3 h-3 rounded-sm"
                                                onError={(e) => e.target.style.display = 'none'}
                                              />
                                            )}
                                          </div>
                                          <div className="text-xs font-medium truncate" title={event.title}>
                                            {event.title}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                  {remainingEvents > 0 && (
                                    <div className="text-xs text-right pr-1 text-blue-400">
                                      +{remainingEvents} more
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          }
                        }
                      }}
                      tooltipAccessor={(event) => {
                        const startTime = format(new Date(event.start), 'MMM d, yyyy h:mm a');
                        const endTime = format(new Date(event.end), 'MMM d, yyyy h:mm a');
                        const durationHours = Math.floor(event.duration / 3600);
                        const durationMinutes = Math.floor((event.duration % 3600) / 60);
                        
                        return (
                          <div className="p-2 max-w-xs">
                            <div className="font-bold text-sm mb-1">{event.title || 'Untitled Event'}</div>
                            <div className="text-xs mb-1">
                              {event.platform && <div className="font-medium">{event.platform}</div>}
                              <div>Starts: {startTime}</div>
                              <div>Ends: {endTime}</div>
                              <div>Duration: {durationHours > 0 ? `${durationHours}h ` : ''}{durationMinutes}m</div>
                              {event.description && <div>Host: {event.description}</div>}
                            </div>
                            <div className="text-xs text-blue-400 mt-1">
                              {event.link ? 'Click to view competition' : 'No link available'}
                            </div>
                          </div>
                        );
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EventCalendar;