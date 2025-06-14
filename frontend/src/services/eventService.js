import axios from 'axios';

// API Configuration
const API_CONFIG = {
  BASE_URL: 'https://clist.by/api/v4/contest', // Removed trailing slash for consistency
  CREDENTIALS: {
    username: 'ritwik',
    api_key: 'f7312175239e60080c97af31e829dbe0306fe8dc'
  },
  DEFAULT_PARAMS: {
    order_by: 'start',
    limit: 1000,
    format: 'json' // Ensure JSON response
  },
  HEADERS: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
};

// Helper function to log API errors
const logApiError = (error, context = '') => {
  if (error.response) {
    // The request was made and the server responded with a status code
    console.error(`API Error ${context}:`, {
      status: error.response.status,
      headers: error.response.headers,
      data: error.response.data
    });
  } else if (error.request) {
    // The request was made but no response was received
    console.error(`API Request Error ${context}:`, error.request);
  } else {
    // Something happened in setting up the request
    console.error(`API Setup Error ${context}:`, error.message);
  }
  console.error('Error config:', error.config);
};

// Function to construct the API URL with parameters
const constructApiUrl = (params = {}) => {
  try {
    const queryParams = new URLSearchParams({
      ...API_CONFIG.CREDENTIALS,
      ...API_CONFIG.DEFAULT_PARAMS,
      ...params
    });
    
    // Ensure the URL is properly encoded
    const queryString = queryParams.toString();
    return `${API_CONFIG.BASE_URL}?${queryString}`;
  } catch (error) {
    console.error('Error constructing API URL:', error);
    throw new Error('Failed to construct API URL');
  }
};

// Platform configuration - Only include specified platforms
const PLATFORMS = {
  // Codeforces (including gyms)
  'codeforces.com': {
    name: 'Codeforces',
    icon: 'https://codeforces.org/s/0/favicon-32x32.png',
    include: true
  },
  'codeforces.com/gyms': {
    name: 'Codeforces Gyms',
    icon: 'https://codeforces.org/s/0/favicon-32x32.png',
    include: true
  },
  
  // CodeChef
  'codechef.com': {
    name: 'CodeChef',
    icon: 'https://img.icons8.com/fluent/512/codechef.png',
    include: true
  },
  
  // AtCoder
  'atcoder.jp': {
    name: 'AtCoder',
    icon: 'https://img.atcoder.jp/assets/atcoder.png',
    include: true
  },
  
  // LeetCode
  'leetcode.com': {
    name: 'LeetCode',
    icon: 'https://leetcode.com/favicon.ico',
    include: true
  },
  
  // HackerRank
  'hackerrank.com': {
    name: 'HackerRank',
    icon: 'https://www.hackerrank.com/wp-content/uploads/2018/08/hackerrank_logo.png',
    include: true
  },
  
  // GeeksforGeeks
  'geeksforgeeks.org': {
    name: 'GeeksforGeeks',
    icon: 'https://media.geeksforgeeks.org/gfg-gg-logo.svg',
    include: true,
    aliases: ['practice.geeksforgeeks.org', 'www.geeksforgeeks.org', 'auth.geeksforgeeks.org', 'contests.geeksforgeeks.org']
  },
  
  // Naukri Code 360
  'naukri.com': {
    name: 'Naukri Code 360',
    icon: 'https://www.naukri.com/favicon.ico',
    include: true,
    aliases: ['www.naukri.com', 'naukri.com/code360']
  },
  
  // USACO
  'usaco.org': {
    name: 'USACO',
    icon: 'https://usaco.org/current/images/usaco_logo.png',
    include: true
  },
  'usaco.guide': {
    name: 'USACO Guide',
    icon: 'https://usaco.guide/favicon.ico',
    include: true
  },
  
  // CS Academy
  'csacademy.com': {
    name: 'CS Academy',
    icon: 'https://csacademy.com/favicon.ico',
    include: true
  },
  
  // ICPC
  'icpc.global': {
    name: 'ICPC Global',
    icon: 'https://icpc.global/favicon.ico',
    include: true
  },
  'icpc.baylor.edu': {
    name: 'ICPC',
    icon: 'https://icpc.global/favicon.ico',
    include: true
  },
  'icpcarchive.ecs.baylor.edu': {
    name: 'ICPC Archive',
    icon: 'https://icpc.global/favicon.ico',
    include: true
  }
};

// Map of alternative hostnames to primary hostnames
const HOSTNAME_ALIASES = {
  'www.codeforces.com': 'codeforces.com',
  'www.codechef.com': 'codechef.com',
  'atcoder.jp': 'atcoder.jp',
  'www.leetcode.com': 'leetcode.com',
  'www.hackerrank.com': 'hackerrank.com',
  'practice.geeksforgeeks.org': 'geeksforgeeks.org',
  'www.geeksforgeeks.org': 'geeksforgeeks.org',
  'geeksforgeeks.org': 'geeksforgeeks.org',  // Add base domain as well
  'www.usaco.org': 'usaco.org',
  'www.csacademy.com': 'csacademy.com',
  'icpc.baylor.edu': 'icpc.global',
  'icpcarchive.ecs.baylor.edu': 'icpc.global',
  // Add any other GeeksforGeeks subdomains that might be used
  'auth.geeksforgeeks.org': 'geeksforgeeks.org',
  'contests.geeksforgeeks.org': 'geeksforgeeks.org'
};



export const fetchEvents = async () => {
  console.log('Starting fetchEvents...');
  try {
    // Calculate date range: from 1 month ago to 12 months from now
    const now = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(now.getMonth() - 1);
    
    const oneYearLater = new Date();
    oneYearLater.setFullYear(now.getFullYear() + 1);
    oneYearLater.setMonth(now.getMonth());

    // Format dates for API (YYYY-MM-DDThh:mm:ss)
    const formatDate = (date) => date.toISOString().split('.')[0];
    
    // Construct API URL with date range and other parameters
    const apiUrl = constructApiUrl({
      start__gt: formatDate(oneMonthAgo),
      end__lt: formatDate(oneYearLater),
      with_problems: 'false',
      with_extra: 'true',
      order_by: 'start',
      limit: 1000
    });

    console.log('Fetching events from:', apiUrl);
    
    // Create axios instance with defaults
    const apiClient = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      headers: API_CONFIG.HEADERS,
      timeout: 15000, // 15 seconds timeout
      validateStatus: (status) => status >= 200 && status < 400
    });
    
    // Add request interceptor for logging
    apiClient.interceptors.request.use(
      config => {
        console.log('Request:', config.method.toUpperCase(), config.url);
        return config;
      },
      error => {
        logApiError(error, 'Request Interceptor');
        return Promise.reject(error);
      }
    );
    
    // Add response interceptor for error handling
    apiClient.interceptors.response.use(
      response => response,
      error => {
        logApiError(error, 'Response Interceptor');
        return Promise.reject(error);
      }
    );
    
    const response = await apiClient.get('', {
      params: {
        ...API_CONFIG.CREDENTIALS,
        start__gt: formatDate(oneMonthAgo),
        end__lt: formatDate(oneYearLater),
        with_problems: 'false',
        with_extra: 'true',
        order_by: 'start',
        limit: 1000
      }
    });

    // Log response details for debugging
    console.log('API Response status:', response.status);
    console.log('Response headers: ', response.headers);
    
    if (response.status !== 200) {
      console.error('Unexpected status code:', response.status);
      throw new Error(`Unexpected status code: ${response.status}`);
    }
    
    if (!response.data) {
      console.error('No data in response');
      throw new Error('No data in response');
    }
    
    console.log('API Response data type:', typeof response.data);
    
    // Check if the response has the expected structure
    if (!response.data || !Array.isArray(response.data.objects)) {
      console.error('Unexpected API response format. Expected objects array but got:', response.data);
      throw new Error('Invalid API response format: Expected objects array not found');
    }
    
    console.log(`Found ${response.data.objects.length} events`);
    console.log('Raw events from API:', response.data.objects);
    
    // Get list of allowed hostnames from PLATFORMS
    const allowedHosts = Object.entries(PLATFORMS)
      .filter(([_, config]) => config.include)
      .map(([host]) => host);
      
    console.log('Allowed hosts:', allowedHosts);
    
    // Process all events
    const processedEvents = response.data.objects
      .filter(event => {
        if (!event.host) {
          console.log('Filtered out - No host:', event.event);
          return false;
        }
        
        // Resolve hostname aliases
        const resolvedHost = HOSTNAME_ALIASES[event.host] || event.host;
        
        // Check if event is from an included platform
        const isIncluded = allowedHosts.some(host => {
          return resolvedHost === host || resolvedHost.endsWith(`.${host}`);
        });
        
        if (!isIncluded) {
          console.log('Filtered out - Platform not in allowed list:', event.host, '->', resolvedHost, event.event);
          return false;
        }
        
        // Ensure required fields exist
        if (!event.id || !event.start || !event.end) {
          console.warn('Skipping invalid event - missing required fields:', event);
          return false;
        }
        
        return true;
      })
      .map(event => {
        try {
          const host = event.host || 'other';
          const platform = PLATFORMS[host]?.name || host.replace('www.', '').split('.')[0];
          const platformIcon = PLATFORMS[host]?.icon || getPlatformIcon(host);
          const duration = event.duration || (new Date(event.end) - new Date(event.start)) / 1000; // in seconds
          const isAllDay = duration > 86400; // More than 24 hours
          
          // Parse dates as UTC to avoid timezone issues
          const parseDate = (dateString) => {
            try {
              return new Date(dateString);
            } catch (e) {
              console.warn('Error parsing date:', dateString, e);
              return new Date(); // Return current date as fallback
            }
          };
          
          const eventStart = parseDate(event.start);
          const eventEnd = parseDate(event.end);
          
          // Calculate if the event is longer than 1 day (in milliseconds)
          const oneDayInMs = 24 * 60 * 60 * 1000;
          const eventDuration = eventEnd - eventStart;
          const isLongEvent = eventDuration > oneDayInMs;
          
          // Base event properties
          const baseEvent = {
            id: event.id.toString(),
            title: event.event || 'Coding Contest',
            start: eventStart,
            end: eventEnd,
            platform: platform,
            platformIcon: platformIcon,
            description: `Host: ${host}`,
            link: event.href || event.url || '#',
            duration: duration,
            allDay: isAllDay,
            isLongEvent: isLongEvent,
            resource: {
              name: platform,
              icon: platformIcon
            },
            host: event.host,
            rawData: event // Keep original data for reference
          };
          
          // For long events, create start and end markers
          if (isLongEvent) {
            const startEvent = {
              ...baseEvent,
              id: `${event.id}-start`,
              title: `Start: ${event.event || 'Coding Contest'}`,
              end: new Date(eventStart.getTime() + 60 * 60 * 1000), // 1 hour duration
              isStartMarker: true
            };
            
            const endEvent = {
              ...baseEvent,
              id: `${event.id}-end`,
              title: `End: ${event.event || 'Coding Contest'}`,
              start: new Date(eventEnd.getTime() - 60 * 60 * 1000), // 1 hour before end
              isEndMarker: true
            };
            
            console.log('Split long event into start/end markers:', {
              original: event.event,
              start: startEvent,
              end: endEvent
            });
            
            return [startEvent, endEvent];
          }
          
          // For regular events, return as is
          console.log('Processed event:', {
            id: baseEvent.id,
            platform: baseEvent.platform,
            isUpcoming: baseEvent.start > new Date()
          });
          
          return baseEvent;
        } catch (e) {
          console.error('Error processing event:', e, event);
          return null;
        }
      })
      .filter(event => event !== null) // Remove any null events
      .sort((a, b) => new Date(a.start) - new Date(b.start)); // Sort by start date
    
    console.log(`Successfully processed ${processedEvents.length} events`);
    return processedEvents;
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error; // Rethrow to handle in the component
  }
};

// For future use - Note: These are placeholder implementations
// The actual implementation would depend on your backend API
// Currently using the same base URL as fetchEvents for consistency
export const createEvent = async (eventData) => {
  // This is a placeholder - the actual implementation would need to match your backend API
  console.warn('createEvent is not fully implemented yet');
  throw new Error('Not implemented: Event creation requires backend implementation');
};

export const updateEvent = async (id, eventData) => {
  // This is a placeholder - the actual implementation would need to match your backend API
  console.warn('updateEvent is not fully implemented yet');
  throw new Error('Not implemented: Event update requires backend implementation');
};

export const deleteEvent = async (id) => {
  // This is a placeholder - the actual implementation would need to match your backend API
  console.warn('deleteEvent is not fully implemented yet');
  throw new Error('Not implemented: Event deletion requires backend implementation');
};
